import { useState, useCallback } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import GraphVisualization from "@/components/GraphVisualization";
import FraudRingTable from "@/components/FraudRingTable";
import SummaryStats from "@/components/SummaryStats";
import { parseCSV } from "@/lib/csvParser";
import { analyzeTransactions, AnalysisResult } from "@/lib/graphAnalysis";

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setErrors([]);
    setAnalysis(null);

    // Small delay so UI can update
    await new Promise((r) => setTimeout(r, 50));

    const { transactions, errors: parseErrors } = await parseCSV(file);

    if (parseErrors.length > 0) {
      setErrors(parseErrors.slice(0, 5));
    }

    if (transactions.length === 0) {
      setErrors((prev) => [...prev, "No valid transactions found in the file."]);
      setIsLoading(false);
      return;
    }

    const result = analyzeTransactions(transactions);
    setAnalysis(result);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/0.8)] backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-[hsl(var(--accent))]">
              <Shield className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[hsl(var(--foreground))]">
                Money Mule Detector
              </h1>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] tracking-wider uppercase">
                Financial Crime Intelligence Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">Local Analysis Engine</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
              01 — Data Input
            </span>
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>
          <FileUpload onUpload={handleUpload} isLoading={isLoading} />

          {errors.length > 0 && (
            <div className="mt-3 panel rounded-xl p-4 border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">Parse Warnings</span>
              </div>
              <ul className="space-y-1">
                {errors.map((e, i) => (
                  <li key={i} className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {analysis && (
          <>
            {/* Summary Stats */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
                  02 — Analysis Summary
                </span>
                <div className="h-px flex-1 bg-[hsl(var(--border))]" />
              </div>
              <SummaryStats analysis={analysis} />
            </section>

            {/* Graph Visualization */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
                  03 — Network Graph
                </span>
                <div className="h-px flex-1 bg-[hsl(var(--border))]" />
              </div>
              <GraphVisualization analysis={analysis} />
            </section>

            {/* Fraud Ring Table */}
            <section className="pb-10">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">
                  04 — Fraud Ring Registry
                </span>
                <div className="h-px flex-1 bg-[hsl(var(--border))]" />
              </div>
              <FraudRingTable rings={analysis.fraudRings} />
            </section>
          </>
        )}

        {/* Empty state */}
        {!analysis && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--accent))] flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[hsl(var(--primary))] opacity-60" />
            </div>
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              Awaiting Transaction Data
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md">
              Upload a CSV file to begin graph analysis. The engine will detect circular routing,
              smurfing patterns, and layered transfer chains entirely within your browser.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { label: "Cycle Detection", desc: "Rings of 3–5 accounts" },
                { label: "Smurfing", desc: "Fan-in / fan-out patterns" },
                { label: "Shell Chains", desc: "Low-activity intermediaries" },
              ].map(({ label, desc }) => (
                <div key={label} className="panel rounded-xl p-3 text-center">
                  <div className="text-xs font-semibold text-[hsl(var(--primary))] mb-1">{label}</div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
