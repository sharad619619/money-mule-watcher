import Layout from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p>Last updated: March 2026</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p>By using Strivion, you agree to these Terms of Service. If you do not agree, please do not use the platform.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">2. Use License</h2>
            <p>Strivion grants you a limited, non-exclusive license to use the platform for legitimate financial investigation purposes.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">3. Disclaimer</h2>
            <p>The platform is provided "as is" without warranties. Strivion does not guarantee the accuracy of fraud detection results and should be used as a supplementary investigation tool.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">4. Limitation of Liability</h2>
            <p>Strivion shall not be liable for any damages arising from the use or inability to use the platform.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">5. Changes</h2>
            <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of updated terms.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
