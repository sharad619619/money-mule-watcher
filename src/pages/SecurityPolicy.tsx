import Layout from "@/components/layout/Layout";

export default function SecurityPolicy() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-8">Security Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p>Last updated: March 2026</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">1. Client-Side Processing</h2>
            <p>All transaction analysis runs entirely within the user's browser. No uploaded data is transmitted to or stored on Strivion servers.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">2. Data Handling</h2>
            <p>Uploaded CSV files are processed in-memory and discarded when the browser session ends. No persistent storage of transaction data occurs.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">3. Infrastructure Security</h2>
            <p>Our web application is served over HTTPS with modern TLS encryption. We follow industry best practices for web application security.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">4. Vulnerability Reporting</h2>
            <p>If you discover a security vulnerability, please report it to security@strivion.com. We take all reports seriously and will respond within 48 hours.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
