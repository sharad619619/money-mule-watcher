import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left */}
            <div>
              <motion.p initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Contact</motion.p>
              <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Get in Touch
              </motion.h1>
              <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp} className="text-lg text-muted-foreground mb-10">
                Have questions about Strivion? We'd love to hear from you.
              </motion.p>

              <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Support</p>
                    <p className="text-sm text-muted-foreground">support@strivion.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Sales</p>
                    <p className="text-sm text-muted-foreground">sales@strivion.com</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div initial="hidden" animate="visible" custom={2} variants={fadeUp}>
              {submitted ? (
                <div className="panel rounded-xl p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Message Sent</h2>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="panel rounded-xl p-8 space-y-5">
                  {[
                    { name: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
                    { name: "company", label: "Company", type: "text", placeholder: "Company name" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-foreground mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.name !== "company"}
                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your needs..."
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full glow-button gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
