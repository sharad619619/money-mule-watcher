import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Network, ArrowRight, Upload, Cpu, Search, BarChart3,
  AlertTriangle, Shield, Download, Database, Layers,
  RefreshCw, Users, FileJson, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import GraphVisualization from "@/components/GraphVisualization";
import FraudRingTable from "@/components/FraudRingTable";
import SummaryStats from "@/components/SummaryStats";
import FileUpload from "@/components/FileUpload";
import { parseCSV, parseCSVText } from "@/lib/csvParser";
import { analyzeTransactions, AnalysisResult } from "@/lib/graphAnalysis";
import { fadeUp } from "@/lib/animations";

const workflowSteps = [
  {
    icon: Database,
    title: "Transaction Data Input",
    desc: "CSV file with transaction_id, sender_id, receiver_id, amount, and timestamp fields.",
  },
  {
    icon: Network,
    title: "Graph Network Construction",
    desc: "Transaction records are converted into a directed network graph of nodes and edges.",
  },
  {
    icon: Cpu,
    title: "Fraud Pattern Detection",
    items: [
      { icon: RefreshCw, label: "Circular Fund Routing", example: "A → B → C → A" },
      { icon: Users, label: "Smurfing Patterns", example: "Fan-in / Fan-out" },
      { icon: Layers, label: "Layered Shell Networks", example: "Multi-hop chains" },
    ],
  },
  {
    icon: BarChart3,
    title: "Risk Scoring & Alerts",
    desc: "Suspicious accounts receive risk scores and are grouped into detected fraud rings.",
  },
  {
    icon: FileJson,
    title: "Investigation Output",
    desc: "Interactive graph, fraud ring summary table, and downloadable JSON investigation report.",
  },
];

export default function Demo() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<"idle" | "sample" | "custom">("idle");

  // Load sample dataset
  const loadSampleData = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);
    setAnalysis(null);
    setMode("sample");

    await new Promise((r) => setTimeout(r, 100));

    try {
      const response = await fetch("/sample_transactions.csv");
      const text = await response.text();
      const { transactions, errors: parseErrors } = parseCSVText(text);

      if (parseErrors.length > 0) setErrors(parseErrors.slice(0, 5));

      if (transactions.length === 0) {
        setErrors(["No valid transactions found in sample dataset."]);
        setIsLoading(false);
        return;
      }

      const result = analyzeTransactions(transactions);
      setAnalysis(result);
    } catch (err) {
      setErrors(["Failed to load sample dataset."]);
    }
    setIsLoading(false);
  }, []);

  // Handle custom CSV upload
  const handleUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setErrors([]);
    setAnalysis(null);
    setMode("custom");

    await new Promise((r) => setTimeout(r, 50));

    const { transactions, errors: parseErrors } = await parseCSV(file);

    if (parseErrors.length > 0) setErrors(parseErrors.slice(0, 5));

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
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        {/* ── HERO ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-3xl">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp}
              className="text-sm text-primary font-medium uppercase tracking-widest mb-4">
              Interactive Demo
            </motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Strivion Investigation Demo
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="text-lg text-muted-foreground mb-4">
              Explore how graph-based analytics uncover hidden money-muling networks.
            </motion.p>
            <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="text-muted-foreground mb-8">
              Upload transaction data or explore the sample dataset to see how Strivion detects suspicious
              transaction patterns, fraud rings, and coordinated money-muling activity.
            </motion.p>
            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}
              className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={loadSampleData} disabled={isLoading} className="gap-2 glow-button">
                <Play className="w-4 h-4" /> Try Demo Dataset
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                setMode("custom");
                setAnalysis(null);
                document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
              }}>
                <Upload className="w-4 h-4 mr-2" /> Upload CSV
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── LOADING STATE ── */}
        {isLoading && (
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}
            className="panel rounded-2xl p-12 text-center mb-12">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-foreground font-semibold">Analyzing transaction network...</p>
            <p className="text-sm text-muted-foreground mt-1">Running detection algorithms on graph data</p>
          </motion.div>
        )}

        {/* ── ERRORS ── */}
        {errors.length > 0 && (
          <div className="panel rounded-xl p-4 border-amber-500/30 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Parse Warnings</span>
            </div>
            <ul className="space-y-1">
              {errors.map((e, i) => (
                <li key={i} className="text-xs text-muted-foreground font-mono">{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── INVESTIGATION DASHBOARD ── */}
        {analysis && (
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            {/* Summary Stats */}
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  01 — Analysis Summary
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <SummaryStats analysis={analysis} />
            </section>

            {/* Graph Visualization */}
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  02 — Transaction Network Graph
                </span>
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground">
                  Hover nodes for details · Click for investigation panel
                </span>
              </div>
              <GraphVisualization analysis={analysis} />
            </section>

            {/* Fraud Ring Table */}
            <section className="mb-12">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  03 — Fraud Ring Registry
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <FraudRingTable rings={analysis.fraudRings} />
            </section>
          </motion.div>
        )}

        {/* ── UPLOAD SECTION ── */}
        <section id="upload-section" className="mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {analysis ? "04 — " : ""}Upload Your Own Data
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="panel rounded-2xl p-6 lg:p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Try Your Own Dataset</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload a CSV file to run the full detection pipeline on your own transaction data.
                    All analysis runs locally in your browser — no data is transmitted.
                  </p>

                  <div className="panel rounded-xl p-4 mb-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Required CSV Structure
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Column</th>
                            <th className="text-left py-2 text-muted-foreground font-semibold">Type</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground font-mono">
                          {[
                            ["transaction_id", "string"],
                            ["sender_id", "string"],
                            ["receiver_id", "string"],
                            ["amount", "number"],
                            ["timestamp", "datetime"],
                          ].map(([col, type]) => (
                            <tr key={col} className="border-b border-border/50">
                              <td className="py-2 pr-4 text-primary">{col}</td>
                              <td className="py-2 text-muted-foreground">{type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <FileUpload onUpload={handleUpload} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── DETECTION ENGINE WORKFLOW ── */}
        <section className="mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center mb-12">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Engine Workflow</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How the Detection Engine Works</h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />

            {workflowSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                variants={fadeUp}
                className={`relative flex items-start gap-6 mb-10 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-accent border border-border flex items-center justify-center z-10">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content card */}
                <div className={`ml-20 lg:ml-0 lg:w-[calc(50%-3rem)] ${
                  i % 2 === 0 ? "lg:pr-8" : "lg:pl-8"
                } ${i % 2 === 0 ? "" : "lg:ml-auto"}`}>
                  <div className="glass-card rounded-xl p-5 hover-lift">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Step {i + 1}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{step.title}</h3>
                    {step.desc && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    )}
                    {step.items && (
                      <div className="space-y-2 mt-2">
                        {step.items.map((item) => (
                          <div key={item.label} className="flex items-start gap-2">
                            <item.icon className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-semibold text-foreground">{item.label}</span>
                              <span className="text-xs text-muted-foreground ml-1.5">{item.example}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="mb-16">
          <div className="panel rounded-2xl p-12 text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Run Your Own Analysis
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upload transaction data and uncover hidden financial crime networks using Strivion's
              graph analysis engine. Full investigation tools available in the analysis platform.
            </p>
            <Button size="lg" onClick={() => navigate("/analysis")} className="gap-2 glow-button">
              Open Full Platform <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
