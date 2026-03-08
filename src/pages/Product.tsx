import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Network,
  Shield,
  BarChart3,
  Eye,
  FileJson,
  Lock,
  Server,
  Plug,
  Building2,
  Landmark,
  Search,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const modules = [
  { icon: Network, title: "Transaction Graph Engine", desc: "Converts raw transaction data into directed graph structures for network analysis." },
  { icon: Shield, title: "Fraud Pattern Detection", desc: "Detects cycles, fan-in/out patterns, and layered transfers using graph algorithms." },
  { icon: BarChart3, title: "Risk Scoring System", desc: "Assigns suspicion scores based on detected patterns and behavioral analysis." },
  { icon: Eye, title: "Investigation Dashboard", desc: "Interactive visualization of transaction networks with node inspection." },
  { icon: FileJson, title: "Report Generator", desc: "Structured JSON output for compliance teams and regulatory filings." },
];

const useCases = [
  { icon: Landmark, title: "Banks", desc: "Monitor inter-account transfers for coordinated money movement patterns." },
  { icon: Building2, title: "Fintech Companies", desc: "Integrate fraud detection into payment processing pipelines." },
  { icon: Search, title: "Fraud Investigators", desc: "Accelerate investigation workflows with automated pattern detection." },
  { icon: UserCheck, title: "Regulators", desc: "Standardized reporting for regulatory compliance and oversight." },
];

export default function ProductPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Product</motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              The Complete Financial Crime Detection Platform
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
              Strivion provides end-to-end transaction network analysis, combining graph algorithms with pattern detection to uncover hidden money-muling operations that traditional tools miss.
            </motion.p>
            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}>
              <Button size="lg" onClick={() => navigate("/app")} className="gap-2 glow-button">
                Try It Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Core Modules</p>
            <h2 className="text-3xl font-bold text-foreground">Built for Precision</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <motion.div key={m.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="panel rounded-xl p-6 hover:glow-cyan transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <m.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-3xl mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Architecture</p>
            <h2 className="text-3xl font-bold text-foreground mb-4">Graph Analytics Pipeline</h2>
            <p className="text-muted-foreground leading-relaxed">
              Transaction data flows through a multi-stage pipeline: ingestion, graph construction, pattern detection, scoring, and visualization — all running locally for maximum data privacy.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Server, title: "Graph Analysis Algorithms", desc: "Cycle detection, DFS traversal, and connected component analysis." },
              { icon: BarChart3, title: "Data Processing Pipeline", desc: "CSV parsing, validation, and graph construction in real-time." },
              { icon: Eye, title: "Interactive Visualization", desc: "Force-directed graph rendering with real-time node inspection." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="panel rounded-xl p-6">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Security</p>
            <h2 className="text-3xl font-bold text-foreground mb-4">Security Infrastructure</h2>
            <p className="text-muted-foreground">Your data never leaves your browser. All analysis runs locally.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Lock, title: "Secure Processing", desc: "Client-side only — no server uploads." },
              { icon: Shield, title: "Compliance Ready", desc: "Designed for regulatory environments." },
              { icon: Server, title: "Data Protection", desc: "Zero data retention policy." },
            ].map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="text-center panel rounded-xl p-6">
                <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Use Cases</p>
            <h2 className="text-3xl font-bold text-foreground">Built for Every Financial Institution</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {useCases.map((uc, i) => (
              <motion.div key={uc.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex gap-4 p-6 rounded-xl border border-border hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <uc.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <Plug className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">API Integrations</h2>
            <p className="text-muted-foreground mb-8">
              Future support for direct banking system integrations, real-time transaction monitoring, and automated alerting pipelines.
            </p>
            <Button variant="outline" onClick={() => navigate("/contact")}>Contact Sales</Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
