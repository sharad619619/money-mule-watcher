import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Network, FileJson, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Demo() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Demo</motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              See Strivion in Action
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground">
              Explore how Strivion detects hidden fraud networks in transaction data.
            </motion.p>
          </div>

          {/* Video placeholder */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="panel rounded-2xl p-1 max-w-4xl mx-auto mb-20">
            <div className="rounded-xl bg-surface overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 hover:bg-primary/20 transition-colors cursor-pointer">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">Product Walkthrough</p>
                <p className="text-sm text-muted-foreground">Watch how Strivion analyzes transaction networks</p>
              </div>
            </div>
          </motion.div>

          {/* Demo features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            {[
              { icon: Network, title: "Interactive Dashboard", desc: "Explore the graph visualization with real-time node inspection and drag-to-rearrange." },
              { icon: Eye, title: "Live Detection", desc: "Watch as the engine identifies fraud rings, smurfing patterns, and layered transfers." },
              { icon: FileJson, title: "Sample Dataset", desc: "Download our sample CSV with realistic transaction patterns for testing." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="panel rounded-xl p-6 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to try it yourself?</h2>
            <p className="text-muted-foreground mb-8">Upload your own transaction data or use our sample dataset.</p>
            <Button size="lg" onClick={() => navigate("/app")} className="gap-2 glow-button">
              Try Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
