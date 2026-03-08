import Layout from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p>Last updated: March 2026</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>Strivion processes transaction data entirely within your browser. We do not collect, store, or transmit any uploaded transaction data to our servers.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">2. How We Use Information</h2>
            <p>We may collect basic usage analytics (page views, feature usage) to improve the platform. No personally identifiable information from uploaded datasets is retained.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">3. Data Security</h2>
            <p>All transaction analysis occurs client-side. Your financial data never leaves your browser environment.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">4. Third-Party Services</h2>
            <p>We may use third-party analytics services that collect anonymized usage data. These services have their own privacy policies.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">5. Contact</h2>
            <p>For privacy inquiries, contact us at privacy@strivion.com.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
