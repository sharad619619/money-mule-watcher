import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Network, Search, BarChart3, Eye, FileJson, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload Transaction Dataset",
    desc: "Upload a CSV file containing transaction records with the following fields:",
    fields: ["transaction_id", "sender_id", "receiver_id", "amount", "timestamp"],
  },
  {
    num: "02",
    icon: Network,
    title: "Network Graph Construction",
    desc: "Transactions are automatically converted into a directed graph where accounts become nodes and transactions become edges. The system builds adjacency lists for efficient traversal.",
  },
  {
    num: "03",
    icon: Search,
    title: "AI Pattern Detection",
    desc: "The engine runs multiple detection algorithms simultaneously:",
    patterns: ["Circular fund routing (cycle detection)", "Smurfing patterns (fan-in / fan-out)", "Layered transaction chains (shell account detection)", "High-velocity transaction analysis"],
  },
  {
    num: "04",
    icon: BarChart3,
    title: "Fraud Detection Results",
    desc: "View comprehensive results including:",
    patterns: ["Interactive graph visualization", "Suspicious account flagging with risk scores", "Fraud ring detection and classification", "Downloadable JSON investigation report"],
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Process</motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              How the System Works
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground">
              From raw transaction data to actionable fraud intelligence in four simple steps.
            </motion.p>
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="grid md:grid-cols-[120px_1fr] gap-6"
              >
                <div className="flex md:flex-col items-center md:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center relative">
                    <step.icon className="w-6 h-6 text-primary" />
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                </div>
                <div className="panel rounded-xl p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
                  {step.fields && (
                    <div className="flex flex-wrap gap-2">
                      {step.fields.map((f) => (
                        <span key={f} className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {step.patterns && (
                    <ul className="space-y-2">
                      {step.patterns.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mt-20 text-center">
            <Button size="lg" onClick={() => navigate("/app")} className="gap-2 glow-button">
              Start Analysis <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
