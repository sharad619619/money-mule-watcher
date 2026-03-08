import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Network,
  Shield,
  Search,
  BarChart3,
  Eye,
  FileJson,
  Zap,
  TrendingDown,
  ClipboardCheck,
  Building2,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const features = [
  { icon: Network, title: "Transaction Graph Analysis", desc: "Convert transaction data into network graphs to reveal relationships between accounts." },
  { icon: Shield, title: "Money Mule Detection", desc: "Identify coordinated networks used to move illicit funds." },
  { icon: Search, title: "Fraud Ring Discovery", desc: "Automatically detect circular transaction chains indicating coordinated fraud." },
  { icon: BarChart3, title: "Behavior Pattern Detection", desc: "Detect smurfing patterns including fan-in and fan-out money flows." },
  { icon: Eye, title: "Interactive Graph Visualization", desc: "Visualize financial networks and suspicious nodes in an intuitive investigation interface." },
  { icon: FileJson, title: "Automated Investigation Reports", desc: "Generate structured JSON reports for investigators and compliance teams." },
];

const benefits = [
  { icon: Zap, title: "Faster Fraud Investigations", desc: "Reduce investigation time from weeks to minutes with automated graph analysis." },
  { icon: TrendingDown, title: "Reduced Financial Crime Risk", desc: "Proactively identify suspicious networks before funds are lost." },
  { icon: ClipboardCheck, title: "Improved Compliance", desc: "Generate comprehensive reports that meet regulatory requirements." },
  { icon: Building2, title: "Enterprise-Grade Monitoring", desc: "Scale from thousands to millions of transactions with consistent accuracy." },
];

const stats = [
  { value: "10M+", label: "Transactions Analyzed" },
  { value: "50K+", label: "Suspicious Accounts Detected" },
  { value: "99.2%", label: "Detection Precision" },
  { value: "<1s", label: "Average Analysis Time" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[80px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-8"
            >
              <Shield className="w-3.5 h-3.5" />
              AI-Powered Financial Forensics
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            >
              <span className="text-foreground">Strivion</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed mb-4"
            >
              AI-Powered Financial Forensics for Detecting Money Mule Networks
            </motion.p>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="text-base text-muted-foreground leading-relaxed mb-10 max-w-2xl"
            >
              Strivion analyzes transaction networks using advanced graph analytics and AI pattern detection
              to uncover hidden fraud rings, money-muling chains, and suspicious financial behavior within
              large transaction datasets.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate("/app")}
                className="gap-2 text-base h-12 px-8 glow-button transition-shadow duration-300"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/demo")}
                className="text-base h-12 px-8"
              >
                View Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground text-center mb-10 uppercase tracking-widest font-medium"
          >
            Trusted by financial security teams worldwide
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Core Detection Features
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Powerful Investigation Dashboard
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
            className="panel rounded-2xl p-1 max-w-5xl mx-auto"
          >
            <div className="rounded-xl bg-surface overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">strivion.app/analysis</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {["Accounts Analyzed", "Flagged Accounts", "Fraud Rings", "Processing Time"].map((label) => (
                    <div key={label} className="panel rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-1">{label}</div>
                      <div className="text-xl font-bold text-foreground">—</div>
                    </div>
                  ))}
                </div>
                <div className="panel rounded-lg p-6 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Network className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Interactive Transaction Network Graph</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Benefits</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Why Choose Strivion
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex gap-4 p-6 rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                quote: "Strivion allows our investigation team to identify complex fraud rings in minutes instead of weeks.",
                author: "Head of Financial Crime",
                company: "Major European Bank",
              },
              {
                quote: "Graph-based analysis has dramatically improved our fraud detection capabilities and reduced false positives.",
                author: "Chief Compliance Officer",
                company: "Digital Payments Provider",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="panel rounded-xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-base text-foreground leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Plans for Every Team
            </h2>
            <p className="text-muted-foreground">
              Start free. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Starter", price: "$0", desc: "For individual investigators" },
              { name: "Professional", price: "$299", desc: "For growing teams", featured: true },
              { name: "Enterprise", price: "Custom", desc: "For large organizations" },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`panel rounded-xl p-6 text-center ${plan.featured ? "ring-2 ring-primary" : ""}`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <div className="text-3xl font-bold text-foreground mb-6">
                  {plan.price}
                  {plan.price !== "Custom" && <span className="text-sm text-muted-foreground font-normal">/mo</span>}
                </div>
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className={`w-full ${plan.featured ? "glow-button" : ""}`}
                  onClick={() => navigate("/pricing")}
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Start detecting financial crime networks today.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your transaction data and uncover hidden fraud rings.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/app")}
              className="gap-2 text-base h-12 px-8 glow-button transition-shadow duration-300"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
