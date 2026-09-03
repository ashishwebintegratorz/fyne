import React from "react";
import Link from "next/link";
import { ShieldCheck, Scale, FileText, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Maison de Fyné",
  description: "Terms and conditions of service and sale in accordance with the laws of the Republic of Iraq.",
};

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground min-h-screen py-16 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto pt-10">

        {/* Breadcrumb / Top label */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-foreground/60 uppercase">
            LEGAL & COMPLIANCE · REPUBLIC OF IRAQ
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-heading uppercase">
            Terms & Conditions
          </h1>
          <p className="font-sans text-xs tracking-widest text-brand-foreground/60 uppercase">
            Effective Date: January 2026 · Governed by Iraqi Law
          </p>
          <div className="w-12 h-px bg-brand-primary mx-auto mt-6" />
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 text-[10px] tracking-widest uppercase">
          <span className="px-4 py-2 border border-brand-heading text-brand-heading bg-brand-bg-gray/50 dark:bg-zinc-800/50 font-semibold">
            Terms & Conditions
          </span>
          <Link
            href="/privacy"
            className="px-4 py-2 border border-brand-border text-brand-foreground/70 hover:text-brand-heading hover:border-brand-heading transition-colors"
          >
            Privacy Policy
          </Link>
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
              Legal Preamble & Regulatory Framework
            </h2>
            <p>
              Welcome to <strong>Maison de Fyné</strong> (&ldquo;Fyné&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). These Terms and Conditions govern your access to and purchase of luxury leather casings, cosmetic balms, and bespoke personalization services via our digital platform.
            </p>
            <p>
              By accessing this website, placing an order, or commissioning bespoke personalization, you enter into a legally binding commercial agreement subject to the prevailing commercial legislation of the <strong>Republic of Iraq</strong>, including <strong>Iraqi Commercial Code (Law No. 30 of 1984)</strong>, the <strong>Consumer Protection Law (Law No. 79 of 2017)</strong>, and the <strong>Electronic Transactions and Electronic Signatures Law (Law No. 78 of 2012)</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">02.</span>
              Eligibility & Order Formation
            </h2>
            <p>
              By using our service, you affirm that you have attained the legal age of majority under Iraqi law (18 lunar/solar years) and possess the civil legal capacity to execute contracts.
            </p>
            <p>
              An electronic sales contract is concluded when you finalize your checkout and receive our digital confirmation. Fyné reserves the right to review, restrict, or decline orders in circumstances involving suspected unauthorized resale, inaccurate pricing displays, or inability to authorize payments.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">03.</span>
              Bespoke & Personalized Goods Exemption
            </h2>
            <div className="p-4 bg-brand-bg-gray dark:bg-zinc-900/40 border-l-2 border-brand-heading space-y-2">
              <p className="font-semibold text-brand-heading text-[11px] uppercase tracking-wider">
                Statutory Notice on Custom Crafts & Monograms
              </p>
              <p className="text-[11px] leading-normal text-brand-foreground/80">
                In accordance with <strong>Article 10 of Iraqi Consumer Protection Law No. 79 of 2017</strong> and standard commercial custom, products tailored to the consumer&rsquo;s specific individual instructions—including hot-stamped initials, monograms, and custom leather foil embossing—are classified as bespoke goods and are strictly non-cancellable once engraving has commenced, except in the event of an artisan manufacturing defect.
              </p>
            </div>
            <p>
              Customers bear sole responsibility for verifying the accuracy of initials, foil tones (Gold/Silver), and casing leather colors selected in the Atelier Customizer before completing checkout.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">04.</span>
              Pricing, Currency & Payment Mechanisms
            </h2>
            <p>
              All listed prices are displayed with options for GCC currencies and USD. Transactions completed in Iraq comply with official fiscal directives, and payments may be processed via authorized electronic payment processors or approved Cash on Delivery (COD) services where verified by our dispatch network.
            </p>
            <p>
              Fyné reserves the right to modify prices for future orders without retroactive penalty to existing, confirmed orders.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">05.</span>
              Intellectual Property Rights
            </h2>
            <p>
              All trademarks, trade names, logo motifs, typography, product casing configurations, and digital media hosted on this platform are the sole proprietary property of Maison de Fyné. Unauthorized reproduction, imitation, commercial exploitation, or brand infringement is subject to civil and criminal remedies pursuant to <strong>Iraqi Trademarks and Commercial Data Law No. 21 of 1957</strong> (as amended).
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">06.</span>
              Limitation of Liability & Force Majeure
            </h2>
            <p>
              To the fullest extent sanctioned under Iraqi Civil Code No. 40 of 1951, Fyné shall not be liable for indirect, incidental, or consequential damages resulting from platform downtime, carrier delays, or customs clearance delays beyond our reasonable operational control. In all events, our total cumulative liability shall not exceed the total amount paid by the customer for the specific purchase order.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">07.</span>
              Governing Law & Dispute Settlement
            </h2>
            <p>
              These Terms, transactions, and any controversies arising hereunder shall be construed and governed strictly by the <strong>Laws of the Republic of Iraq</strong>. The commercial courts of competent territorial jurisdiction in Iraq shall possess exclusive authority to adjudicate any unresolved disputes following initial amicable concierge mediation.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-12 p-6 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/20 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xs font-semibold tracking-widest text-brand-heading uppercase">
                Legal & Concierge Inquiries
              </h4>
              <p className="text-[11px] text-brand-foreground/70 mt-1">
                For contract inquiries or clarification regarding Iraqi commercial terms, contact our legal desk.
              </p>
            </div>
            <a
              href="mailto:Fyneae@outlook.com"
              className="text-[10px] tracking-widest font-semibold uppercase px-4 py-2.5 bg-brand-primary text-white dark:text-black rounded-xs hover:opacity-85 transition-opacity"
            >
              Contact Legal
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
