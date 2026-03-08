import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Network, FileJson, ArrowRight, Upload, Cpu, Search, BarChart3,
  AlertTriangle, Shield, TrendingUp, Download, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const sampleAccounts = [
  { id: "ACC-7291", score: 94, reason: "Circular fund routing" },
  { id: "ACC-3845", score: 87, reason: "High fan-in transfers" },
  { id: "ACC-1023", score: 76, reason: "Layered transaction chain" },
  { id: "ACC-5610", score: 68, reason: "Smurfing pattern detected" },
];

const sampleInsights = [
  "Circular transaction pattern detected: A → B → C → A",
  "High fan-in transfers detected on ACC-3845 (12 sources)",
  "Suspicious transaction layering identified across 4 hops",
  "Anomalous velocity: 23 transactions in 90-second window",
];

const steps = [
  { icon: Upload, title: "Upload Transaction Dataset", desc: "Upload transaction data in CSV format containing sender, receiver, amount, and timestamp." },
  { icon: Network, title: "Graph Network Construction", desc: "The system converts transactions into a network graph of accounts and money flows." },
  { icon: Cpu, title: "AI Pattern Analysis", desc: "Advanced algorithms detect patterns including circular routing, smurfing, and layered transfers." },
  { icon: Search, title: "Fraud Detection Results", desc: "Investigators receive graph visualizations, suspicious account flags, and downloadable investigation reports." },
];

const outputs = [
  { icon: Network, title: "Graph Visualization", desc: "Interactive transaction network map showing account relationships and fund flows." },
  { icon: AlertTriangle, title: "Fraud Ring Detection", desc: "Circular transaction chains automatically identified and highlighted." },
  { icon: BarChart3, title: "Risk Score Report", desc: "Suspicious accounts ranked by composite fraud risk score." },
  { icon: Download, title: "JSON Investigation Report", desc: "Downloadable structured fraud investigation report for compliance teams." },
];

export default function Demo() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* ── HEADER ── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">
              Product Demo
            </motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Product Demo
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground mb-4">
              Explore how Strivion detects hidden fraud networks using graph-based financial analysis.
            </motion.p>
            <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp} className="text-muted-foreground">
              This demonstration showcases how transaction data is analyzed, transformed into network graphs, and used to identify suspicious financial behavior such as money-muling rings, circular transactions, and layered fund transfers.
            </motion.p>
          </div>

          {/* ── DASHBOARD PREVIEW ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="panel rounded-2xl p-6 lg:p-8 max-w-6xl mx-auto mb-24">
            <h2 className="text-xl font-bold text-foreground mb-6">Investigation Dashboard</h2>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Graph area */}
              <div className="lg:col-span-2 rounded-xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">Transaction Network Graph</h3>
                  <span className="text-xs text-primary font-medium px-2 py-1 rounded-full bg-primary/10">Live</span>
                </div>
                <div className="relative aspect-[16/9] rounded-lg bg-muted/30 overflow-hidden flex items-center justify-center">
                  {/* Simulated graph nodes */}
                  <svg viewBox="0 0 400 220" className="w-full h-full" fill="none">
                    {/* Edges */}
                    <line x1="80" y1="60" x2="200" y2="40" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.5" />
                    <line x1="200" y1="40" x2="320" y2="80" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.5" />
                    <line x1="320" y1="80" x2="280" y2="170" stroke="hsl(var(--destructive))" strokeWidth="2" opacity="0.7" />
                    <line x1="280" y1="170" x2="140" y2="160" stroke="hsl(var(--destructive))" strokeWidth="2" opacity="0.7" />
                    <line x1="140" y1="160" x2="80" y2="60" stroke="hsl(var(--destructive))" strokeWidth="2" opacity="0.7" />
                    <line x1="200" y1="40" x2="200" y2="130" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.4" />
                    <line x1="200" y1="130" x2="140" y2="160" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.4" />
                    <line x1="320" y1="80" x2="360" y2="160" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.3" />
                    <line x1="80" y1="60" x2="40" y2="130" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.3" />

                    {/* Normal nodes */}
                    <circle cx="200" cy="40" r="12" fill="hsl(var(--primary))" opacity="0.8" />
                    <circle cx="200" cy="130" r="8" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="360" cy="160" r="7" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="40" cy="130" r="7" fill="hsl(var(--primary))" opacity="0.5" />

                    {/* Suspicious nodes (fraud ring) */}
                    <circle cx="80" cy="60" r="14" fill="hsl(var(--destructive))" opacity="0.15" />
                    <circle cx="80" cy="60" r="10" fill="hsl(var(--destructive))" opacity="0.8" />
                    <circle cx="320" cy="80" r="14" fill="hsl(var(--destructive))" opacity="0.15" />
                    <circle cx="320" cy="80" r="10" fill="hsl(var(--destructive))" opacity="0.8" />
                    <circle cx="280" cy="170" r="14" fill="hsl(var(--destructive))" opacity="0.15" />
                    <circle cx="280" cy="170" r="10" fill="hsl(var(--destructive))" opacity="0.8" />
                    <circle cx="140" cy="160" r="14" fill="hsl(var(--destructive))" opacity="0.15" />
                    <circle cx="140" cy="160" r="10" fill="hsl(var(--destructive))" opacity="0.8" />

                    {/* Labels */}
                    <text x="80" y="45" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">A</text>
                    <text x="200" y="27" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">B</text>
                    <text x="320" y="67" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">C</text>
                    <text x="280" y="190" textAnchor="middle" fill="hsl(var(--destructive))" fontSize="9" fontWeight="700">Fraud Ring</text>
                    <text x="280" y="200" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">A → B → C → A</text>
                  </svg>
                </div>
              </div>

              {/* Right panels */}
              <div className="space-y-6">
                {/* Risk scores */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Risk Scores
                  </h3>
                  <div className="space-y-3">
                    {sampleAccounts.map((acc) => (
                      <div key={acc.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-mono text-foreground">{acc.id}</span>
                          <p className="text-xs text-muted-foreground">{acc.reason}</p>
                        </div>
                        <span className={`font-bold text-sm ${acc.score >= 80 ? "text-destructive" : "text-yellow-500"}`}>
                          {acc.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="rounded-xl border border-border bg-background p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" /> Investigation Insights
                  </h3>
                  <ul className="space-y-2">
                    {sampleInsights.map((insight, i) => (
                      <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── WORKFLOW ── */}
          <div className="max-w-5xl mx-auto mb-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Workflow</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How the Detection Engine Works</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div key={step.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="panel rounded-xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                  <step.icon className="w-8 h-8 text-primary mx-auto mb-4 mt-2" />
                  <h3 className="font-semibold text-foreground mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── SAMPLE OUTPUTS ── */}
          <div className="max-w-5xl mx-auto mb-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Outputs</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Example Investigation Results</h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {outputs.map((item, i) => (
                <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="panel rounded-xl p-6 flex gap-4 items-start hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-center panel rounded-2xl p-12 max-w-3xl mx-auto">
            <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Run Your Own Analysis</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Upload transaction data and uncover hidden financial crime networks using Strivion's graph analysis engine.
            </p>
            <Button size="lg" onClick={() => navigate("/app")} className="gap-2 glow-button">
              Try Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
