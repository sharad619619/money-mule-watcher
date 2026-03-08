import { motion } from "framer-motion";
import {
  Activity, BarChart3, Bell, Eye, FileJson, Lock, Network,
  RefreshCw, Search, Shield, Users, Zap, Layers, Plug,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const features = [
  { icon: Activity, title: "Real-Time Monitoring", desc: "Analyze transaction streams as they happen with instant pattern detection." },
  { icon: Search, title: "Behavior Pattern Detection", desc: "Identify fan-in, fan-out, and velocity anomalies across account networks." },
  { icon: BarChart3, title: "Risk Scoring Engine", desc: "Multi-factor scoring based on pattern severity and network position." },
  { icon: Network, title: "Graph-Based Analytics", desc: "Transform flat transaction data into explorable network graphs." },
  { icon: RefreshCw, title: "Fraud Ring Discovery", desc: "Detect circular fund routing through cycle detection algorithms." },
  { icon: Bell, title: "Automated Alerts", desc: "Configurable thresholds trigger instant notifications for suspicious activity." },
  { icon: Eye, title: "Investigation Dashboard", desc: "Interactive node inspection with transaction history and risk breakdown." },
  { icon: Layers, title: "Data Visualization Tools", desc: "Force-directed graphs, heat maps, and trend analysis displays." },
  { icon: Plug, title: "API Integrations", desc: "RESTful endpoints for embedding detection into existing systems." },
  { icon: Lock, title: "Enterprise Security", desc: "Client-side processing ensures sensitive data never leaves your environment." },
  { icon: Users, title: "Team Collaboration", desc: "Share investigation results and annotate findings with your team." },
  { icon: FileJson, title: "Export & Reporting", desc: "Download structured JSON reports for compliance and audit trails." },
];

export default function Features() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Features</motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Everything You Need to Detect Financial Crime
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground">
              A comprehensive suite of tools designed for financial investigators, compliance teams, and fraud analysts.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group panel rounded-xl p-6 hover:glow-cyan transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
