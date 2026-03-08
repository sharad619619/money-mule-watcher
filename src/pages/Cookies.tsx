import Layout from "@/components/layout/Layout";

export default function Cookies() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-primary font-medium uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <p>Last updated: March 2026</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">2. How We Use Cookies</h2>
            <p>We use minimal cookies for essential functionality such as theme preferences. No tracking cookies are used for advertising purposes.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">3. Essential Cookies</h2>
            <p>These cookies are necessary for the platform to function and cannot be disabled. They include theme preference and session management cookies.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">4. Analytics Cookies</h2>
            <p>We may use anonymized analytics cookies to understand how visitors use our site. These do not contain personal information.</p>
            <h2 className="text-lg font-semibold text-foreground mt-8">5. Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling certain cookies may affect platform functionality.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
