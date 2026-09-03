import React from "react";
import Link from "next/link";
import { Lock, Shield, EyeOff, Database } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Maison de Fyné",
  description: "Privacy policy and personal data protection principles in accordance with the laws of the Republic of Iraq.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground min-h-screen py-16 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto pt-10">

        {/* Top label & Heading */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-foreground/60 uppercase">
            DATA PROTECTION · REPUBLIC OF IRAQ
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-heading uppercase">
            Privacy Policy
          </h1>
          <p className="font-sans text-xs tracking-widest text-brand-foreground/60 uppercase">
            Commitment to Personal Privacy & Confidentiality
          </p>
          <div className="w-12 h-px bg-brand-primary mx-auto mt-6" />
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 text-[10px] tracking-widest uppercase">
          <Link
            href="/terms"
            className="px-4 py-2 border border-brand-border text-brand-foreground/70 hover:text-brand-heading hover:border-brand-heading transition-colors"
          >
            Terms & Conditions
          </Link>
          <span className="px-4 py-2 border border-brand-heading text-brand-heading bg-brand-bg-gray/50 dark:bg-zinc-800/50 font-semibold">
            Privacy Policy
          </span>
          <Link
            href="/refund"
            className="px-4 py-2 border border-brand-border text-brand-foreground/70 hover:text-brand-heading hover:border-brand-heading transition-colors"
          >
            Refund & Returns
          </Link>
        </div>

        {/* Legal Body */}
        <div className="space-y-10 text-xs md:text-sm font-light text-brand-foreground/85 leading-relaxed border-t border-brand-border pt-10">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">01.</span>
              Constitutional Foundation & Privacy Pledge
            </h2>
            <p>
              At <strong>Maison de Fyné</strong>, we regard customer privacy as an inviolable standard of luxury. Our privacy practices are grounded in the principles of personal liberty and confidentiality enshrined in <strong>Article 17 of the Constitution of the Republic of Iraq (2005)</strong>, which protects the sanctity of personal privacy and communications, alongside Iraqi civil jurisprudence.
            </p>
            <p>
              This policy clarifies how we collect, safeguard, and utilize customer information across our digital atelier, customizer, and concierge communications.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">02.</span>
              Information Collected by the Atelier
            </h2>
            <p>
              In the course of providing our bespoke products and services, we collect only information strictly necessary for fulfilling transactions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-foreground/80">
              <li><strong>Contact Particulars:</strong> Full name, telephone contact, and email address for order dispatches and order verification.</li>
              <li><strong>Delivery Coordinates:</strong> Residential or commercial delivery address in Iraq, GCC, or international destinations.</li>
              <li><strong>Bespoke Customization Specifications:</strong> Monogram initials (letters and foil tone preferences) chosen for personalized craft.</li>
              <li><strong>Transaction Data:</strong> Payment verification status, chosen currency (IQD/AED/USD), and billing records. Note: We do not store raw credit card numbers; payment tokens are handled securely via PCI-compliant gateways.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">03.</span>
              Purpose of Data Processing
            </h2>
            <p>We process your personal information strictly for legitimate commercial purposes:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-brand-border bg-brand-bg-gray/30 dark:bg-zinc-900/30 rounded-xs">
                <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-brand-heading">Order Execution</h4>
                <p className="text-[11px] text-brand-foreground/75 mt-1">
                  Artisan personalization, quality verification, packaging, and secure delivery logistics.
                </p>
              </div>
              <div className="p-4 border border-brand-border bg-brand-bg-gray/30 dark:bg-zinc-900/30 rounded-xs">
                <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-brand-heading">Concierge Service</h4>
                <p className="text-[11px] text-brand-foreground/75 mt-1">
                  Addressing customer inquiries, order modifications prior to engraving, and client assistance.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">04.</span>
              Non-Disclosure & Third-Party Limitations
            </h2>
            <p>
              Fyné maintains an uncompromising policy against selling, leasing, or distributing client information to unauthorized commercial entities or marketing brokers.
            </p>
            <p>
              Data is disclosed strictly to essential operational partners—specifically licensed courier companies and accredited payment gateways—solely to complete fulfillment. Any disclosure mandated by lawful decree shall strictly adhere to judicial processes mandated by Iraqi regulatory authorities.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">05.</span>
              Data Security & Electronic Integrity
            </h2>
            <p>
              In compliance with the security provisions of <strong>Iraqi Electronic Signatures and Electronic Transactions Law No. 78 of 2012</strong>, we implement enterprise-grade encryption (TLS/HTTPS), restricted database credentials, and session access controls to protect stored personal information from unauthorized access, loss, or alteration.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">06.</span>
              Customer Rights & Data Rectification
            </h2>
            <p>
              Under Iraqi legal standards and international privacy norms, you hold the right to request review, update, or deletion of your customer account record. You may at any time contact our data protection desk to exercise these rights or revoke marketing communication consent.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-12 p-6 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/20 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xs font-semibold tracking-widest text-brand-heading uppercase">
                Privacy Officer Contact
              </h4>
              <p className="text-[11px] text-brand-foreground/70 mt-1">
                Direct all privacy notices or data access requests to our Atelier Concierge desk.
              </p>
            </div>
            <a
              href="mailto:Fyneae@outlook.com"
              className="text-[10px] tracking-widest font-semibold uppercase px-4 py-2.5 bg-brand-primary text-white dark:text-black rounded-xs hover:opacity-85 transition-opacity"
            >
              Fyneae@outlook.com
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
