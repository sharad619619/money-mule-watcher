import { AnalysisResult } from "@/lib/graphAnalysis";
import { Download, ShieldAlert, Users, Network, Clock } from "lucide-react";

interface SummaryStatsProps {
  analysis: AnalysisResult;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`panel rounded-xl p-4 ${highlight ? "border-red-500/30" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${highlight ? "bg-red-500/15" : "bg-[hsl(var(--accent))]"}`}>
          <Icon className={`w-4 h-4 ${highlight ? "text-red-400" : "text-[hsl(var(--primary))]"}`} />
        </div>
        <span className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <div className={`text-2xl font-bold ${highlight ? "text-red-400" : "text-[hsl(var(--foreground))]"}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{sub}</div>}
    </div>
  );
}

export default function SummaryStats({ analysis }: SummaryStatsProps) {
  const handleDownload = () => {
    const suspiciousNodes = analysis.nodes.filter((n) => n.isSuspicious);

    const output = {
      suspicious_accounts: suspiciousNodes.map((n) => ({
        account_id: n.id,
        suspicion_score: n.suspicionScore,
        detected_patterns: n.detectedPatterns,
        ring_id: n.ringId || null,
      })),
      fraud_rings: analysis.fraudRings.map((r) => ({
        ring_id: r.ring_id,
        member_accounts: r.member_accounts,
        pattern_type: r.pattern_type,
        risk_score: r.risk_score,
      })),
      summary: {
        total_accounts_analyzed: analysis.totalAccountsAnalyzed,
        suspicious_accounts_flagged: analysis.suspiciousAccountsFlagged,
        fraud_rings_detected: analysis.fraudRings.length,
        processing_time_seconds: analysis.processingTimeSeconds,
      },
    };

    const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money_mule_analysis_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suspicionRate =
    analysis.totalAccountsAnalyzed > 0
      ? ((analysis.suspiciousAccountsFlagged / analysis.totalAccountsAnalyzed) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Accounts Analyzed"
          value={analysis.totalAccountsAnalyzed.toLocaleString()}
        />
        <StatCard
          icon={ShieldAlert}
          label="Flagged Accounts"
          value={analysis.suspiciousAccountsFlagged.toLocaleString()}
          sub={`${suspicionRate}% of total`}
          highlight={analysis.suspiciousAccountsFlagged > 0}
        />
        <StatCard
          icon={Network}
          label="Fraud Rings"
          value={analysis.fraudRings.length.toLocaleString()}
          highlight={analysis.fraudRings.length > 0}
        />
        <StatCard
          icon={Clock}
          label="Processing Time"
          value={`${analysis.processingTimeSeconds}s`}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]
            hover:opacity-90 active:scale-95 transition-all duration-150
            shadow-[0_0_16px_hsl(var(--primary)/0.25)]"
        >
          <Download className="w-4 h-4" />
          Download JSON Report
        </button>
      </div>
    </div>
  );
}
