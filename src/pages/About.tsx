import { motion } from "framer-motion";
import { Shield, Lightbulb, Eye, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const values = [
  { icon: Shield, title: "Security", desc: "Data protection is at the core of everything we build." },
  { icon: Lightbulb, title: "Innovation", desc: "Pushing the boundaries of financial crime detection with graph analytics." },
  { icon: Eye, title: "Transparency", desc: "Open, explainable analysis that investigators can trust." },
  { icon: Heart, title: "Trust", desc: "Building lasting relationships with financial institutions worldwide." },
];

export default function About() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">About</motion.p>
            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Making Financial Crime Detection Accessible
            </motion.h1>
            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
              Strivion was founded with a clear mission: build powerful financial investigation tools using AI and graph analytics that make it easier for teams of any size to detect and prevent financial crime.
            </motion.p>
          </div>

          {/* Mission */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="panel rounded-xl p-10 max-w-3xl mb-20">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Our Mission</p>
            <p className="text-xl text-foreground font-medium leading-relaxed">
              Build powerful financial investigation tools using AI and graph analytics to make financial crime detection faster, more accurate, and accessible to organizations worldwide.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="max-w-3xl mb-20">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Our Vision</p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To make financial crime detection faster and more accessible worldwide — empowering every bank, fintech company, and regulatory body with the tools to protect their ecosystems.
            </p>
          </motion.div>

          {/* Values */}
          <div className="mb-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp} className="mb-12">
              <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Our Values</p>
              <h2 className="text-3xl font-bold text-foreground">What Drives Us</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              {values.map((v, i) => (
                <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="flex gap-4 p-6 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-3">Team</p>
            <h2 className="text-3xl font-bold text-foreground mb-8">Built by Experts</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl">
              {[
                { name: "Alex Chen", role: "Founder & CEO", desc: "Former Head of Financial Crime at a top-tier bank." },
                { name: "Sarah Kim", role: "CTO", desc: "Graph algorithms researcher with 10+ years in fintech." },
                { name: "Marcus Reed", role: "Head of Product", desc: "Built fraud detection systems for multiple unicorns." },
              ].map((member, i) => (
                <motion.div key={member.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                  className="panel rounded-xl p-6">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">{member.name[0]}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
