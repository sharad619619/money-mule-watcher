import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { AccountNode, AnalysisResult } from "@/lib/graphAnalysis";
import { Transaction } from "@/lib/csvParser";
import { X, TrendingUp, ArrowRightLeft, DollarSign } from "lucide-react";
import { useTheme } from "next-themes";

interface GraphVisualizationProps {
  analysis: AnalysisResult;
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  score: number;
  isSuspicious: boolean;
  patterns: string[];
  txCount: number;
  totalSent: number;
  totalReceived: number;
  transactions: Transaction[];
  ringId?: string;
}

interface SimEdge {
  source: string;
  target: string;
  amount: number;
}

export default function GraphVisualization({ analysis }: GraphVisualizationProps) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<SimEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef<SimNode | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const isDark = theme === "dark";

  const getColor = (score: number) => {
    if (score >= 60) return isDark ? "#ef4444" : "#dc2626";
    if (score >= 30) return isDark ? "#f59e0b" : "#d97706";
    return isDark ? "#06b6d4" : "#0891b2";
  };

  const getNodeRadius = (node: SimNode) => {
    return Math.max(6, Math.min(18, 6 + node.txCount * 0.4));
  };

  // Initialize simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;

    const nodeMap = new Map<string, SimNode>();
    analysis.nodes.forEach((n: AccountNode, i: number) => {
      const angle = (i / analysis.nodes.length) * 2 * Math.PI;
      const radius = Math.min(w, h) * 0.3;
      nodeMap.set(n.id, {
        id: n.id,
        x: w / 2 + radius * Math.cos(angle) + (Math.random() - 0.5) * 60,
        y: h / 2 + radius * Math.sin(angle) + (Math.random() - 0.5) * 60,
        vx: 0,
        vy: 0,
        score: n.suspicionScore,
        isSuspicious: n.isSuspicious,
        patterns: n.detectedPatterns,
        txCount: n.txCount,
        totalSent: n.totalSent,
        totalReceived: n.totalReceived,
        transactions: n.transactions,
        ringId: n.ringId,
      });
    });

    // Deduplicate edges
    const edgeSet = new Set<string>();
    const uniqueEdges: SimEdge[] = [];
    for (const e of analysis.edges) {
      const key = `${e.source}->${e.target}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        uniqueEdges.push({ source: e.source, target: e.target, amount: e.amount });
      }
    }

    nodesRef.current = Array.from(nodeMap.values());
    edgesRef.current = uniqueEdges;
  }, [analysis]);

  // Force simulation + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const simulate = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Build position map
      const posMap = new Map<string, SimNode>();
      for (const n of nodes) posMap.set(n.id, n);

      // Forces
      const repulsion = 1800;
      const springLen = 80;
      const springK = 0.04;
      const damping = 0.7;
      const centerK = 0.01;

      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (dragNodeRef.current?.id === a.id) continue;

        // Center gravity
        a.vx += (w / 2 - a.x) * centerK;
        a.vy += (h / 2 - a.y) * centerK;

        // Node repulsion
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy + 1;
          const dist = Math.sqrt(dist2);
          const force = repulsion / dist2;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }

      // Spring forces along edges
      for (const edge of edges) {
        const a = posMap.get(edge.source);
        const b = posMap.get(edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const force = (dist - springLen) * springK;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (dragNodeRef.current?.id !== a.id) { a.vx += fx; a.vy += fy; }
        if (dragNodeRef.current?.id !== b.id) { b.vx -= fx; b.vy -= fy; }
      }

      // Integrate
      for (const n of nodes) {
        if (dragNodeRef.current?.id === n.id) continue;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        // Bounds
        n.x = Math.max(20, Math.min(w - 20, n.x));
        n.y = Math.max(20, Math.min(h - 20, n.y));
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(scaleRef.current, scaleRef.current);

      // Draw edges
      for (const edge of edges) {
        const a = posMap.get(edge.source);
        const b = posMap.get(edge.target);
        if (!a || !b) continue;

        const aSusp = a.score >= 30;
        const bSusp = b.score >= 30;

        ctx.beginPath();
        ctx.strokeStyle = aSusp && bSusp
          ? (isDark ? "rgba(239, 68, 68, 0.35)" : "rgba(220, 38, 38, 0.4)")
          : (isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(100, 116, 139, 0.15)");
        ctx.lineWidth = aSusp && bSusp ? 1.5 : 0.8;
        ctx.moveTo(a.x, a.y);

        // Arrow
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const r = getNodeRadius(b) + 2;
        const ex = b.x - (dx / dist) * r;
        const ey = b.y - (dy / dist) * r;
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(dy, dx);
        const arrowLen = 6;
        ctx.beginPath();
        ctx.fillStyle = aSusp && bSusp 
          ? (isDark ? "rgba(239, 68, 68, 0.5)" : "rgba(220, 38, 38, 0.6)") 
          : (isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(100, 116, 139, 0.25)");
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - arrowLen * Math.cos(angle - 0.4), ey - arrowLen * Math.sin(angle - 0.4));
        ctx.lineTo(ex - arrowLen * Math.cos(angle + 0.4), ey - arrowLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fill();
      }

      // Draw nodes
      for (const node of nodes) {
        const r = getNodeRadius(node);
        const color = getColor(node.score);
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Glow
        if (node.score >= 30 || isHovered || isSelected) {
          const glowR = r * (isHovered || isSelected ? 2.4 : 2);
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR);
          gradient.addColorStop(0, `${color}44`);
          gradient.addColorStop(1, `${color}00`);
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered || isSelected ? r + 2 : r, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
        grad.addColorStop(0, `${color}ee`);
        grad.addColorStop(1, `${color}88`);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = isSelected ? "#fff" : `${color}cc`;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();

        // Label for larger nodes or hovered
        if (r > 10 || isHovered || isSelected) {
          ctx.fillStyle = isDark ? "rgba(226, 232, 240, 0.9)" : "rgba(15, 23, 42, 0.85)";
          ctx.font = `${isHovered ? "bold " : ""}${Math.max(8, r * 0.7)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const label = node.id.length > 10 ? node.id.slice(0, 8) + "…" : node.id;
          ctx.fillText(label, node.x, node.y + r + 10);
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(simulate);
    };

    animFrameRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [hoveredNode, selectedNode]);

  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - panRef.current.x) / scaleRef.current;
    const my = (e.clientY - rect.top - panRef.current.y) / scaleRef.current;
    return { mx, my };
  }, []);

  const findNodeAt = useCallback((mx: number, my: number) => {
    for (const node of nodesRef.current) {
      const dx = mx - node.x;
      const dy = my - node.y;
      const r = getNodeRadius(node) + 4;
      if (dx * dx + dy * dy <= r * r) return node;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCanvasPos(e);

    if (isDraggingRef.current && dragNodeRef.current) {
      dragNodeRef.current.x = mx + offsetRef.current.x;
      dragNodeRef.current.y = my + offsetRef.current.y;
      return;
    }

    if (isPanningRef.current) {
      panRef.current = {
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      };
      return;
    }

    const node = findNodeAt(mx, my);
    setHoveredNode(node);
    if (node) {
      setTooltip({ x: e.clientX, y: e.clientY });
    } else {
      setTooltip(null);
    }
  }, [getCanvasPos, findNodeAt]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCanvasPos(e);
    const node = findNodeAt(mx, my);

    if (node) {
      isDraggingRef.current = true;
      dragNodeRef.current = node;
      offsetRef.current = { x: node.x - mx, y: node.y - my };
      node.vx = 0;
      node.vy = 0;
    } else {
      isPanningRef.current = true;
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      panStartRef.current = {
        x: e.clientX - panRef.current.x,
        y: e.clientY - panRef.current.y,
      };
    }
  }, [getCanvasPos, findNodeAt]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current && dragNodeRef.current) {
      isDraggingRef.current = false;
      dragNodeRef.current = null;
    }
    isPanningRef.current = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCanvasPos(e);
    const node = findNodeAt(mx, my);
    setSelectedNode(node?.id === selectedNode?.id ? null : node);
  }, [getCanvasPos, findNodeAt, selectedNode]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    scaleRef.current = Math.max(0.2, Math.min(4, scaleRef.current * factor));
  }, []);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const scoreColor = (s: number) =>
    s >= 60 ? "text-red-500 dark:text-red-400" : s >= 30 ? "text-amber-600 dark:text-amber-400" : "text-cyan-600 dark:text-cyan-400";

  return (
    <div className="relative w-full">
      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden panel">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[hsl(var(--border))]">
          <span className="text-xs font-semibold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
            Transaction Network Graph
          </span>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-600 dark:bg-cyan-400" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600 dark:bg-amber-400" />
              <span>Moderate risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-500" />
              <span>High risk</span>
            </div>
            <span className="ml-2 opacity-60">Scroll to zoom · Drag to pan</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={900}
          height={560}
          className="w-full h-[560px] cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { setHoveredNode(null); setTooltip(null); isPanningRef.current = false; isDraggingRef.current = false; }}
          onClick={handleClick}
          onWheel={handleWheel}
        />
      </div>

      {/* Hover tooltip */}
      {hoveredNode && tooltip && !selectedNode && (
        <div
          className="fixed z-50 pointer-events-none panel rounded-lg p-3 min-w-[200px]"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[hsl(var(--foreground))] font-mono">{hoveredNode.id}</span>
            <span className={`text-xs font-bold ml-2 ${scoreColor(hoveredNode.score)}`}>
              {hoveredNode.score.toFixed(0)}/100
            </span>
          </div>
          <div className="space-y-1 text-xs text-[hsl(var(--muted-foreground))]">
            <div className="flex justify-between gap-4">
              <span>Transactions</span>
              <span className="text-[hsl(var(--foreground))]">{hoveredNode.txCount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Sent</span>
              <span className="text-[hsl(var(--foreground))]">{formatCurrency(hoveredNode.totalSent)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Received</span>
              <span className="text-[hsl(var(--foreground))]">{formatCurrency(hoveredNode.totalReceived)}</span>
            </div>
            {hoveredNode.patterns.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[hsl(var(--border))]">
                {hoveredNode.patterns.map((p) => (
                  <span key={p} className="inline-block mr-1 mb-1 px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))] opacity-60">Click to view transactions</div>
        </div>
      )}

      {/* Selected node panel */}
      {selectedNode && (
        <div className="mt-3 panel rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-[hsl(var(--foreground))]">{selectedNode.id}</span>
                {selectedNode.ringId && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {selectedNode.ringId}
                  </span>
                )}
              </div>
              <div className={`text-2xl font-bold ${scoreColor(selectedNode.score)}`}>
                {selectedNode.score.toFixed(0)}
                <span className="text-sm text-[hsl(var(--muted-foreground))] font-normal ml-1">/100 risk score</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { icon: ArrowRightLeft, label: "Transactions", value: selectedNode.txCount },
              { icon: DollarSign, label: "Total Sent", value: formatCurrency(selectedNode.totalSent) },
              { icon: TrendingUp, label: "Total Received", value: formatCurrency(selectedNode.totalReceived) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="surface rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
                </div>
                <div className="text-sm font-semibold text-[hsl(var(--foreground))]">{value}</div>
              </div>
            ))}
          </div>

          {selectedNode.patterns.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wider">Detected Patterns</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.patterns.map((p) => (
                  <span key={p} className="px-2 py-1 rounded text-xs bg-red-500/15 text-red-400 border border-red-500/25">
                    {p.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transaction history */}
          <div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-wider">
              Recent Transactions ({selectedNode.transactions.length})
            </p>
            <div className="max-h-40 overflow-y-auto space-y-1.5">
              {selectedNode.transactions.slice(0, 20).map((tx) => (
                <div key={tx.transaction_id} className="flex items-center justify-between text-xs surface rounded px-2.5 py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[hsl(var(--muted-foreground))] shrink-0">{tx.transaction_id}</span>
                    <span className="truncate text-[hsl(var(--muted-foreground))]">
                      {tx.sender_id === selectedNode.id ? (
                        <span>→ <span className="text-[hsl(var(--foreground))]">{tx.receiver_id}</span></span>
                      ) : (
                        <span>← <span className="text-[hsl(var(--foreground))]">{tx.sender_id}</span></span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={tx.sender_id === selectedNode.id ? "text-red-500 dark:text-red-400" : "text-cyan-600 dark:text-cyan-400"}>
                      {tx.sender_id === selectedNode.id ? "-" : "+"}{formatCurrency(tx.amount)}
                    </span>
                    <span className="text-[hsl(var(--muted-foreground))] text-[10px]">
                      {tx.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
