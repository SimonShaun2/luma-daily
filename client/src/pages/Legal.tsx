/*
 * LUMA DAILY — Legal Pages (Privacy Policy + Terms of Service)
 * Design: Warm Editorial — clean, readable legal content
 * Routes: /privacy, /terms
 */

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

function LegalLayout({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1E1B16]/8">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#C8813A] flex items-center justify-center">
                <span className="text-white font-display font-700 text-xs">L</span>
              </div>
              <span className="font-display font-700 text-lg text-[#1E1B16]">Luma Daily</span>
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 font-body text-sm text-[#1E1B16]/60 hover:text-[#1E1B16] transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
      </header>

      <div className="container py-14 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-body text-xs text-[#1E1B16]/40 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-display font-800 text-4xl text-[#1E1B16] mb-2">{title}</h1>
          <p className="font-body text-sm text-[#1E1B16]/40 mb-10">Last updated: {lastUpdated}</p>

          <div className="prose prose-sm max-w-none font-body text-[#1E1B16]/70 leading-relaxed space-y-6">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display font-700 text-xl text-[#1E1B16] mb-3">{title}</h2>
      <div className="space-y-3 text-[#1E1B16]/65 font-body text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="January 1, 2026">
      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact our support team. This includes your name, email address, shipping address, payment information, and any communications you send us.</p>
        <p>We also collect certain information automatically when you use our website, including your IP address, browser type, referring URLs, and pages visited. We use cookies and similar tracking technologies to enhance your experience.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to process your orders, manage your subscription, send you transactional emails, and provide customer support. With your consent, we may also send you marketing communications about new products and promotions.</p>
        <p>We use analytics data to improve our website, understand customer behavior, and optimize our product offerings. We never sell your personal information to third parties.</p>
      </Section>

      <Section title="3. Information Sharing">
        <p>We share your information with trusted service providers who assist us in operating our website and fulfilling orders — including payment processors (Stripe), shipping carriers, and email service providers. These partners are contractually obligated to protect your information.</p>
        <p>We may disclose your information if required by law or to protect the rights, property, or safety of Luma Daily, our customers, or others.</p>
      </Section>

      <Section title="4. Data Retention">
        <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. You may request deletion of your account and associated data at any time by contacting us at privacy@lumadaily.com.</p>
      </Section>

      <Section title="5. Your Rights">
        <p>Depending on your location, you may have the right to access, correct, or delete your personal information; object to or restrict certain processing; and receive a copy of your data in a portable format. To exercise these rights, please contact us at privacy@lumadaily.com.</p>
      </Section>

      <Section title="6. Cookies">
        <p>We use cookies to remember your preferences, keep you logged in, and understand how you use our site. You can control cookie settings through your browser. Note that disabling certain cookies may affect the functionality of our website.</p>
      </Section>

      <Section title="7. Security">
        <p>We implement industry-standard security measures including SSL encryption, secure payment processing through Stripe, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
      </Section>

      <Section title="8. Contact Us">
        <p>If you have questions about this Privacy Policy, please contact us at privacy@lumadaily.com or write to us at: Luma Daily, Inc., 123 Market Street, San Francisco, CA 94105.</p>
      </Section>
    </LegalLayout>
  );
}

export function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="January 1, 2026">
      <Section title="1. Acceptance of Terms">
        <p>By accessing or using the Luma Daily website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
      </Section>

      <Section title="2. Products and Pricing">
        <p>All prices are listed in USD and are subject to change without notice. We reserve the right to limit quantities and refuse orders at our discretion. Product images are for illustrative purposes; actual products may vary slightly.</p>
        <p>Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the FDA.</p>
      </Section>

      <Section title="3. Subscriptions">
        <p>Subscription orders are processed automatically on your selected billing frequency. By subscribing, you authorize Luma Daily to charge your payment method on a recurring basis until you cancel.</p>
        <p>You may pause, skip, or cancel your subscription at any time through your account dashboard or by contacting our support team. Cancellations must be made at least 24 hours before your next scheduled billing date to avoid being charged for that order.</p>
      </Section>

      <Section title="4. Returns and Refunds">
        <p>We offer a 60-day money-back guarantee on your first order of any formula. If you are not satisfied, contact us within 60 days of your purchase date for a full refund of the product price.</p>
        <p>For subsequent orders, we accept returns of unopened products within 30 days of delivery. Opened products are not eligible for return unless defective. Shipping costs for returns are the responsibility of the customer unless the return is due to our error.</p>
      </Section>

      <Section title="5. Intellectual Property">
        <p>All content on the Luma Daily website, including text, images, logos, and product designs, is the property of Luma Daily, Inc. and is protected by copyright and trademark law. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>To the maximum extent permitted by law, Luma Daily shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services. Our total liability shall not exceed the amount you paid for the product in question.</p>
      </Section>

      <Section title="7. Governing Law">
        <p>These Terms of Service are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes shall be resolved in the courts of San Francisco County, California.</p>
      </Section>

      <Section title="8. Changes to Terms">
        <p>We reserve the right to modify these terms at any time. We will notify you of material changes by email or by posting a notice on our website. Continued use of our services after changes constitutes acceptance of the new terms.</p>
      </Section>

      <Section title="9. Contact">
        <p>Questions about these Terms of Service may be directed to legal@lumadaily.com.</p>
      </Section>
    </LegalLayout>
  );
}
