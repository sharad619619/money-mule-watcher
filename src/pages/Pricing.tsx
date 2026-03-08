import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const plans = [
  {
    name: "Starter",
    desc: "For individual investigators",
    monthly: "$0",
    yearly: "$0",
    features: [
      "Basic graph analysis",
      "Up to 10,000 transactions",
      "Basic reporting",
      "Community support",
      "Single user",
    ],
  },
  {
    name: "Professional",
    desc: "For growing teams",
    monthly: "$299",
    yearly: "$249",
    featured: true,
    features: [
      "Advanced fraud detection",
      "Unlimited transactions",
      "Full dashboard access",
      "Priority support",
      "Up to 10 users",
      "JSON report export",
      "Custom risk thresholds",
    ],
  },
  {
    name: "Enterprise",
    desc: "For large organizations",
    monthly: "Custom",
    yearly: "Custom",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated support",
      "SSO & RBAC",
      "Unlimited users",
      "API access",
      "SLA guarantee",
      "On-premise deployment",
    ],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp} className="text-center mb-16">
            <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Pricing</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Start free. Upgrade when you're ready.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full bg-muted">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Yearly <span className="text-xs opacity-80">Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`panel rounded-xl p-8 ${plan.featured ? "ring-2 ring-primary relative" : ""}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {yearly ? plan.yearly : plan.monthly}
                  </span>
                  {plan.monthly !== "Custom" && (
                    <span className="text-sm text-muted-foreground">/mo</span>
                  )}
                </div>
                <Button
                  className={`w-full mb-8 ${plan.featured ? "glow-button" : ""}`}
                  variant={plan.featured ? "default" : "outline"}
                  onClick={() => navigate(plan.monthly === "Custom" ? "/contact" : "/app")}
                >
                  {plan.monthly === "Custom" ? "Contact Sales" : "Get Started"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
