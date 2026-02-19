import { FraudRing } from "@/lib/graphAnalysis";
import { ShieldAlert, Users, Hash, Activity } from "lucide-react";

interface FraudRingTableProps {
  rings: FraudRing[];
}

const PATTERN_LABELS: Record<string, { label: string; color: string }> = {
  cycle: { label: "Circular Routing", color: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/25" },
  fan_in_smurfing: { label: "Fan-in Smurfing", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25" },
  fan_out_smurfing: { label: "Fan-out Smurfing", color: "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/25" },
  layered_transfer: { label: "Layered Transfer", color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/25" },
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 60 ? "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20" :
    score >= 30 ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" :
    "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {score.toFixed(1)}
    </span>
  );
}

export default function FraudRingTable({ rings }: FraudRingTableProps) {
  if (rings.length === 0) {
    return (
      <div className="panel rounded-xl p-8 text-center">
        <ShieldAlert className="w-10 h-10 text-[hsl(var(--muted-foreground))] mx-auto mb-3 opacity-40" />
        <p className="text-sm text-[hsl(var(--muted-foreground))]">No fraud rings detected in this dataset.</p>
      </div>
    );
  }

  const sorted = [...rings].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="panel rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[hsl(var(--border))] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-xs font-semibold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
            Fraud Ring Registry
          </span>
        </div>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{rings.length} rings detected</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              {[
                { icon: Hash, label: "Ring ID" },
                { icon: Activity, label: "Pattern Type" },
                { icon: Users, label: "Members" },
                { icon: ShieldAlert, label: "Risk Score" },
                { label: "Account IDs" },
              ].map(({ icon: Icon, label }) => (
                <th
                  key={label}
                  className="text-left px-4 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ring, i) => {
              const patternInfo = PATTERN_LABELS[ring.pattern_type] || {
                label: ring.pattern_type,
                color: "text-slate-400 bg-slate-500/10 border-slate-500/25",
              };

              return (
                <tr
                  key={ring.ring_id}
                  className={`border-b border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors ${
                    i % 2 === 0 ? "" : "bg-[hsl(var(--muted)/0.15)]"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-[hsl(var(--primary))]">
                      {ring.ring_id}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${patternInfo.color}`}>
                      {patternInfo.label}
                    </span>
                    {ring.description && (
                      <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{ring.description}</div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-[hsl(var(--foreground))] font-semibold">{ring.member_accounts.length}</span>
                  </td>

                  <td className="px-4 py-3">
                    <ScoreBadge score={ring.risk_score} />
                  </td>

                  <td className="px-4 py-3 max-w-[320px]">
                    <div className="flex flex-wrap gap-1">
                      {ring.member_accounts.slice(0, 6).map((acc) => (
                        <span
                          key={acc}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]"
                        >
                          {acc}
                        </span>
                      ))}
                      {ring.member_accounts.length > 6 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--muted)/0.5)] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]">
                          +{ring.member_accounts.length - 6} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
