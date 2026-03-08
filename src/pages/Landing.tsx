import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  RefreshCw,
  Users,
  Layers,
  BarChart3,
  Network,
  Upload,
  Search,
  FileJson,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import HeroBackground from "@/components/landing/HeroBackground";
import HeroNetworkGraph from "@/components/landing/HeroNetworkGraph";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import TrustSection from "@/components/landing/TrustSection";
import DashboardShowcase from "@/components/landing/DashboardShowcase";

const features = [
  {
    icon: RefreshCw,
    title: "Circular Fund Routing Detection",
    desc: "Detects transaction cycles such as A → B → C → A that indicate coordinated fraud rings.",
  },
  {
    icon: Users,
    title: "Smurfing Pattern Detection",
    desc: "Identifies fan-in and fan-out behaviors where multiple accounts funnel funds to one account or one account distributes funds to many accounts.",
  },
  {
    icon: Layers,
    title: "Layered Transfer Chains",
    desc: "Detects layered transaction paths where funds pass through multiple shell accounts to obscure their origin.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring System",
    desc: "Assigns a suspicion score to accounts based on detected fraud patterns.",
  },
  {
    icon: Network,
    title: "Interactive Graph Visualization",
    desc: "Displays transaction networks as interactive graphs with suspicious nodes clearly highlighted.",
  },
];

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload CSV Transaction Data",
    desc: "Upload a dataset containing transaction_id, sender_id, receiver_id, amount, and timestamp.",
  },
  {
    num: "02",
    icon: Search,
    title: "Network Graph Analysis",
    desc: "The system converts transaction data into a graph network and analyzes it for suspicious patterns.",
  },
  {
    num: "03",
    icon: FileJson,
    title: "Fraud Detection Results",
    desc: "Visualize fraud rings, suspicious accounts, and download a JSON investigation report.",
  },
];

const outputs = [
  {
    title: "Interactive Graph Visualization",
    desc: "Shows account nodes and directed transaction edges.",
  },
  {
    title: "Fraud Ring Detection",
    desc: "Highlights detected rings and suspicious nodes.",
  },
  {
    title: "JSON Investigation Report",
    desc: "Download a structured report containing suspicious accounts and fraud ring summaries.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-accent">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight">Money Mule Detection Engine</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <button onClick={() => scrollTo("hero")} className="hover:text-foreground transition-colors">Home</button>
            <button onClick={() => scrollTo("how")} className="hover:text-foreground transition-colors">How It Works</button>
            <button onClick={() => scrollTo("features")} className="hover:text-foreground transition-colors">Features</button>
            <Button size="sm" onClick={() => navigate("/analysis")} className="ml-2 glow-button">
              Start Analysis
            </Button>
          </div>

          <Button size="sm" className="md:hidden glow-button" onClick={() => navigate("/analysis")}>
            Start Analysis
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated network background */}
        <HeroBackground />
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-destructive/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-semibold tracking-wider uppercase mb-6">
              <Shield className="w-3 h-3" /> Financial Crime Intelligence
            </div>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Money Mule<br />
            <span className="text-primary">Detection Engine</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground font-medium mb-3">
            Graph-Based Financial Crime Detection Using Transaction Network Analysis
          </motion.p>
          <motion.p initial="hidden" animate="visible" custom={3} variants={fadeUp} className="text-sm text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            This platform analyzes financial transaction data to detect coordinated money-muling activities using graph algorithms and pattern detection. It helps investigators identify suspicious transaction flows, fraud rings, and hidden financial networks.
          </motion.p>
          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp} className="flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => navigate("/analysis")} className="gap-2 text-sm glow-button">
              Start Analysis <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("features")} className="text-sm">
              View Features
            </Button>
          </motion.div>

          <button
            onClick={() => scrollTo("problem")}
            className="mt-14 mx-auto flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem" className="py-20 px-6 bg-muted/40">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">The Challenge</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4">
            The Problem: Money Muling Networks
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Money muling is a major component of financial crime where illicit funds are transferred through networks of accounts to hide the origin of the money. Traditional database analysis often fails to identify these multi-hop transaction patterns.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By converting transaction data into a <span className="text-primary font-semibold">directed graph</span> and applying cycle detection, fan-in/fan-out analysis, and chain traversal, hidden fraud networks become visible — even when individual transactions appear legitimate.
          </p>
        </motion.div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <ArchitectureSection />

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Key Detection Capabilities</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                variants={fadeUp}
                className="glass-card rounded-xl p-6 hover-lift group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD SHOWCASE ── */}
      <DashboardShowcase />

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 px-6 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">How the System Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc }, i) => (
              <motion.div key={num} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t border-dashed border-border" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-4 relative">
                  <Icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center">
                    {num}
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST & SECURITY ── */}
      <TrustSection />

      {/* ── DEMO OUTPUT ── */}
      <section className="py-20 px-6 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Output</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">What You Get</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {outputs.map(({ title, desc }, i) => (
              <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5} variants={fadeUp}
                className="glass-card rounded-xl p-5 text-center hover-lift">
                <h3 className="text-sm font-bold mb-2 text-primary">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Investigate?</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Upload your transaction data and uncover hidden financial crime networks.
          </p>
          <Button size="lg" onClick={() => navigate("/analysis")} className="gap-2 text-sm glow-button">
            Start Analysis <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Strivion. All rights reserved.</p>
          <p>AI-powered graph analytics for detecting financial crime networks.</p>
        </div>
      </footer>
    </div>
  );
}
