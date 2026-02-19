import { Transaction } from "./csvParser";

export interface AccountNode {
  id: string;
  transactions: Transaction[];
  suspicionScore: number;
  detectedPatterns: string[];
  ringId?: string;
  isSuspicious: boolean;
  totalSent: number;
  totalReceived: number;
  txCount: number;
}

export interface FraudRing {
  ring_id: string;
  member_accounts: string[];
  pattern_type: string;
  risk_score: number;
  description?: string;
}

export interface AnalysisResult {
  nodes: AccountNode[];
  fraudRings: FraudRing[];
  edges: Array<{ source: string; target: string; amount: number; timestamp: Date }>;
  processingTimeSeconds: number;
  totalAccountsAnalyzed: number;
  suspiciousAccountsFlagged: number;
}

type AdjacencyList = Map<string, Set<string>>;
type ReverseAdjacency = Map<string, Set<string>>;

function buildGraph(transactions: Transaction[]): {
  adj: AdjacencyList;
  revAdj: ReverseAdjacency;
  accountTxs: Map<string, Transaction[]>;
} {
  const adj: AdjacencyList = new Map();
  const revAdj: ReverseAdjacency = new Map();
  const accountTxs: Map<string, Transaction[]> = new Map();

  for (const tx of transactions) {
    const { sender_id, receiver_id } = tx;

    if (!adj.has(sender_id)) adj.set(sender_id, new Set());
    if (!adj.has(receiver_id)) adj.set(receiver_id, new Set());
    if (!revAdj.has(sender_id)) revAdj.set(sender_id, new Set());
    if (!revAdj.has(receiver_id)) revAdj.set(receiver_id, new Set());

    adj.get(sender_id)!.add(receiver_id);
    revAdj.get(receiver_id)!.add(sender_id);

    if (!accountTxs.has(sender_id)) accountTxs.set(sender_id, []);
    if (!accountTxs.has(receiver_id)) accountTxs.set(receiver_id, []);
    accountTxs.get(sender_id)!.push(tx);
    accountTxs.get(receiver_id)!.push(tx);
  }

  return { adj, revAdj, accountTxs };
}

// Detect cycles of length 3–5 using DFS
function detectCycles(
  adj: AdjacencyList,
  maxLen: number = 5
): string[][] {
  const allCycles: string[][] = [];
  const cycleSet = new Set<string>();
  const nodes = Array.from(adj.keys());

  for (const startNode of nodes) {
    const stack: Array<{ node: string; path: string[] }> = [
      { node: startNode, path: [startNode] },
    ];

    while (stack.length > 0) {
      const { node, path } = stack.pop()!;
      const neighbors = adj.get(node) || new Set();

      for (const neighbor of neighbors) {
        if (neighbor === startNode && path.length >= 3) {
          // Found a cycle
          const canonicalCycle = [...path].sort().join(",");
          if (!cycleSet.has(canonicalCycle)) {
            cycleSet.add(canonicalCycle);
            allCycles.push([...path]);
          }
          continue;
        }

        if (!path.includes(neighbor) && path.length < maxLen) {
          stack.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }
  }

  return allCycles;
}

// Detect smurfing: fan-in (many senders → one receiver) within 72 hours
function detectFanIn(
  transactions: Transaction[],
  threshold: number = 10
): Map<string, string[]> {
  const windowMs = 72 * 60 * 60 * 1000;
  const suspiciousAggregators = new Map<string, string[]>();

  const byReceiver = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    if (!byReceiver.has(tx.receiver_id)) byReceiver.set(tx.receiver_id, []);
    byReceiver.get(tx.receiver_id)!.push(tx);
  }

  for (const [receiver, txs] of byReceiver) {
    // Sliding window check
    const sorted = [...txs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    for (let i = 0; i < sorted.length; i++) {
      const windowStart = sorted[i].timestamp.getTime();
      const windowEnd = windowStart + windowMs;
      const uniqueSenders = new Set<string>();

      for (let j = i; j < sorted.length && sorted[j].timestamp.getTime() <= windowEnd; j++) {
        uniqueSenders.add(sorted[j].sender_id);
      }

      if (uniqueSenders.size >= threshold) {
        suspiciousAggregators.set(receiver, Array.from(uniqueSenders));
        break;
      }
    }
  }

  return suspiciousAggregators;
}

// Detect smurfing: fan-out (one sender → many receivers) within 72 hours
function detectFanOut(
  transactions: Transaction[],
  threshold: number = 10
): Map<string, string[]> {
  const windowMs = 72 * 60 * 60 * 1000;
  const suspiciousDistributors = new Map<string, string[]>();

  const bySender = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    if (!bySender.has(tx.sender_id)) bySender.set(tx.sender_id, []);
    bySender.get(tx.sender_id)!.push(tx);
  }

  for (const [sender, txs] of bySender) {
    const sorted = [...txs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    for (let i = 0; i < sorted.length; i++) {
      const windowStart = sorted[i].timestamp.getTime();
      const windowEnd = windowStart + windowMs;
      const uniqueReceivers = new Set<string>();

      for (let j = i; j < sorted.length && sorted[j].timestamp.getTime() <= windowEnd; j++) {
        uniqueReceivers.add(sorted[j].receiver_id);
      }

      if (uniqueReceivers.size >= threshold) {
        suspiciousDistributors.set(sender, Array.from(uniqueReceivers));
        break;
      }
    }
  }

  return suspiciousDistributors;
}

// Detect layered transfers: chains of 3+ hops where ALL intermediate accounts are shells (≤3 txs)
function detectLayeredTransfers(
  adj: AdjacencyList,
  accountTxCounts: Map<string, number>,
  shellThreshold: number = 3,
  minChainLen: number = 3
): Array<{ chain: string[]; shells: string[] }> {
  const layeredChains: Array<{ chain: string[]; shells: string[] }> = [];
  const foundChains = new Set<string>();

  const nodes = Array.from(adj.keys());

  for (const startNode of nodes) {
    // Only start chains from non-shell accounts (legitimate originators)
    const startTxCount = accountTxCounts.get(startNode) || 0;
    if (startTxCount <= shellThreshold) continue;

    const stack: Array<{ node: string; path: string[]; shells: string[]; allIntermediatesAreShells: boolean }> = [
      { node: startNode, path: [startNode], shells: [], allIntermediatesAreShells: true },
    ];

    while (stack.length > 0) {
      const { node, path, shells, allIntermediatesAreShells } = stack.pop()!;
      const neighbors = adj.get(node) || new Set();

      for (const neighbor of neighbors) {
        if (path.includes(neighbor)) continue;
        if (path.length >= 8) continue; // Limit chain length for performance

        const txCount = accountTxCounts.get(neighbor) || 0;
        const isShell = txCount <= shellThreshold;

        // The neighbor is an intermediate if it's not the last node we're evaluating
        // We accumulate shells only for intermediate nodes (not the final destination)
        const newPath = [...path, neighbor];
        const newShells = isShell ? [...shells, neighbor] : shells;

        // A valid layered chain requires:
        // 1. Chain length >= minChainLen (3+)
        // 2. ALL intermediate nodes (everything except start and end) must be shells
        if (newPath.length >= minChainLen) {
          // Intermediates = all nodes except the first (startNode) and last (neighbor/current end)
          const intermediates = newPath.slice(1, -1);
          const allIntermediatesShell = intermediates.every(
            (acc) => (accountTxCounts.get(acc) || 0) <= shellThreshold
          );

          if (allIntermediatesShell && intermediates.length > 0) {
            const key = newPath.join("->");
            if (!foundChains.has(key)) {
              foundChains.add(key);
              // Shells = only the intermediate nodes that are shells
              const shellIntermediates = intermediates.filter(
                (acc) => (accountTxCounts.get(acc) || 0) <= shellThreshold
              );
              layeredChains.push({ chain: newPath, shells: shellIntermediates });
            }
          }
        }

        // Only continue traversal through shell intermediates to keep chains valid
        if (isShell) {
          stack.push({ node: neighbor, path: newPath, shells: newShells, allIntermediatesAreShells });
        }
      }
    }
  }

  return layeredChains;
}

// Detect high velocity: ≥5 tx in 1 hour
function detectHighVelocity(
  accountTxs: Map<string, Transaction[]>
): Set<string> {
  const highVelocityAccounts = new Set<string>();
  const windowMs = 60 * 60 * 1000;

  for (const [account, txs] of accountTxs) {
    const sorted = [...txs].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    for (let i = 0; i < sorted.length; i++) {
      const windowStart = sorted[i].timestamp.getTime();
      let count = 0;
      for (let j = i; j < sorted.length && sorted[j].timestamp.getTime() <= windowStart + windowMs; j++) {
        count++;
      }
      if (count >= 5) {
        highVelocityAccounts.add(account);
        break;
      }
    }
  }

  return highVelocityAccounts;
}

export function analyzeTransactions(transactions: Transaction[]): AnalysisResult {
  const startTime = performance.now();

  const { adj, accountTxs } = buildGraph(transactions);

  // Build tx count per account
  const accountTxCounts = new Map<string, number>();
  for (const [account, txs] of accountTxs) {
    const uniqueTxIds = new Set(txs.map((t) => t.transaction_id));
    accountTxCounts.set(account, uniqueTxIds.size);
  }

  // Run detection
  const cycles = detectCycles(adj);
  const fanInAggregators = detectFanIn(transactions);
  const fanOutDistributors = detectFanOut(transactions);
  const layeredChains = detectLayeredTransfers(adj, accountTxCounts);
  const highVelocityAccounts = detectHighVelocity(accountTxs);

  // Build account score map
  const accountScores = new Map<string, number>();
  const accountPatterns = new Map<string, Set<string>>();
  const accountRings = new Map<string, string>();

  const allAccounts = new Set<string>(adj.keys());

  const initAccount = (id: string) => {
    if (!accountScores.has(id)) {
      accountScores.set(id, 0);
      accountPatterns.set(id, new Set());
    }
  };

  const addScore = (id: string, score: number) => {
    initAccount(id);
    const current = accountScores.get(id)!;
    accountScores.set(id, Math.min(100, current + score));
  };

  const addPattern = (id: string, pattern: string) => {
    initAccount(id);
    accountPatterns.get(id)!.add(pattern);
  };

  // Build fraud rings
  const fraudRings: FraudRing[] = [];
  let ringCounter = 1;

  // Cycle-based rings
  const cycleRingMap = new Map<string, string>(); // cycle key → ring_id
  for (const cycle of cycles) {
    const ringId = `RING_${String(ringCounter++).padStart(3, "0")}`;
    const cycleLen = cycle.length;

    for (const account of cycle) {
      addScore(account, 40);
      addPattern(account, `cycle_length_${cycleLen}`);
      if (!accountRings.has(account)) {
        accountRings.set(account, ringId);
      }
    }

    const key = [...cycle].sort().join(",");
    if (!cycleRingMap.has(key)) {
      cycleRingMap.set(key, ringId);
      const avgScore = cycle.reduce((sum, acc) => sum + (accountScores.get(acc) || 0), 0) / cycle.length;
      fraudRings.push({
        ring_id: ringId,
        member_accounts: cycle,
        pattern_type: "cycle",
        risk_score: Math.round(avgScore * 10) / 10,
        description: `Circular fund routing (${cycleLen} hops)`,
      });
    }
  }

  // Fan-in rings
  for (const [aggregator, senders] of fanInAggregators) {
    const ringId = `RING_${String(ringCounter++).padStart(3, "0")}`;
    const members = [aggregator, ...senders];

    addScore(aggregator, 25);
    addPattern(aggregator, "fan_in_aggregator");
    if (!accountRings.has(aggregator)) accountRings.set(aggregator, ringId);

    for (const sender of senders) {
      if (!accountRings.has(sender)) accountRings.set(sender, ringId);
    }

    const avgScore = members.reduce((sum, acc) => sum + (accountScores.get(acc) || 0), 0) / members.length;
    fraudRings.push({
      ring_id: ringId,
      member_accounts: members,
      pattern_type: "fan_in_smurfing",
      risk_score: Math.round(avgScore * 10) / 10,
      description: `Smurfing – Fan-in aggregator (${senders.length} senders)`,
    });
  }

  // Fan-out rings
  for (const [distributor, receivers] of fanOutDistributors) {
    const ringId = `RING_${String(ringCounter++).padStart(3, "0")}`;
    const members = [distributor, ...receivers];

    addScore(distributor, 25);
    addPattern(distributor, "fan_out_distributor");
    if (!accountRings.has(distributor)) accountRings.set(distributor, ringId);

    for (const receiver of receivers) {
      if (!accountRings.has(receiver)) accountRings.set(receiver, ringId);
    }

    const avgScore = members.reduce((sum, acc) => sum + (accountScores.get(acc) || 0), 0) / members.length;
    fraudRings.push({
      ring_id: ringId,
      member_accounts: members,
      pattern_type: "fan_out_smurfing",
      risk_score: Math.round(avgScore * 10) / 10,
      description: `Smurfing – Fan-out distributor (${receivers.length} receivers)`,
    });
  }

  // Layered transfer rings
  const layerRingMap = new Set<string>();
  for (const { chain, shells } of layeredChains) {
    const key = chain.join("->");
    if (layerRingMap.has(key)) continue;
    layerRingMap.add(key);

    const ringId = `RING_${String(ringCounter++).padStart(3, "0")}`;
    for (const shell of shells) {
      addScore(shell, 30);
      addPattern(shell, "shell_account");
      if (!accountRings.has(shell)) accountRings.set(shell, ringId);
    }

    const avgScore = chain.reduce((sum, acc) => sum + (accountScores.get(acc) || 0), 0) / chain.length;
    fraudRings.push({
      ring_id: ringId,
      member_accounts: chain,
      pattern_type: "layered_transfer",
      risk_score: Math.round(avgScore * 10) / 10,
      description: `Layered transfer chain (${chain.length} hops, ${shells.length} shells)`,
    });
  }

  // High velocity
  for (const account of highVelocityAccounts) {
    addScore(account, 10);
    addPattern(account, "high_velocity");
  }

  // Build nodes
  const nodes: AccountNode[] = [];
  for (const accountId of allAccounts) {
    const txs = accountTxs.get(accountId) || [];
    const score = Math.min(100, accountScores.get(accountId) || 0);
    const patterns = Array.from(accountPatterns.get(accountId) || []);

    const sent = transactions.filter((t) => t.sender_id === accountId);
    const received = transactions.filter((t) => t.receiver_id === accountId);

    nodes.push({
      id: accountId,
      transactions: txs,
      suspicionScore: score,
      detectedPatterns: patterns,
      ringId: accountRings.get(accountId),
      isSuspicious: score > 0,
      totalSent: sent.reduce((s, t) => s + t.amount, 0),
      totalReceived: received.reduce((s, t) => s + t.amount, 0),
      txCount: new Set(txs.map((t) => t.transaction_id)).size,
    });
  }

  // Build edges
  const edges = transactions.map((tx) => ({
    source: tx.sender_id,
    target: tx.receiver_id,
    amount: tx.amount,
    timestamp: tx.timestamp,
  }));

  const endTime = performance.now();

  // Update ring risk scores with final account scores
  for (const ring of fraudRings) {
    const scores = ring.member_accounts.map((acc) => accountScores.get(acc) || 0);
    ring.risk_score = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
  }

  return {
    nodes,
    fraudRings,
    edges,
    processingTimeSeconds: Math.round(((endTime - startTime) / 1000) * 100) / 100,
    totalAccountsAnalyzed: allAccounts.size,
    suspiciousAccountsFlagged: nodes.filter((n) => n.isSuspicious).length,
  };
}
