import React from "react";
import Link from "next/link";
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, FileText, Mail } from "lucide-react";

export const metadata = {
  title: "Return & Refund Policy | Maison de Fyné",
  description: "FYNÉ return, replacement, and refund policies in accordance with applicable UAE consumer-protection laws.",
};

export default function RefundPage() {
  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground min-h-screen py-16 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto pt-10">

        {/* Top label & Heading */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-foreground/60 uppercase">
            MAISON DE FYNÉ · UAE
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-heading uppercase">
            Return & Refund Policy
          </h1>
          <p className="font-sans text-xs tracking-widest text-brand-foreground/60 uppercase">
            In Accordance with Applicable UAE Consumer-Protection Laws
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
          <Link
            href="/privacy"
            className="px-4 py-2 border border-brand-border text-brand-foreground/70 hover:text-brand-heading hover:border-brand-heading transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="px-4 py-2 border border-brand-heading text-brand-heading bg-brand-bg-gray/50 dark:bg-zinc-800/50 font-semibold">
            Return & Refund Policy
          </span>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 text-xs md:text-sm font-light text-brand-foreground/85 leading-relaxed border-t border-brand-border pt-10">

          {/* Quality Dispatch Promise */}
          <div className="p-6 border border-brand-heading/20 bg-brand-bg-gray/60 dark:bg-zinc-900/30 rounded-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-heading font-serif text-sm uppercase tracking-wider font-medium">
              <ShieldCheck size={18} className="text-brand-primary" />
              <span>Our Quality Commitment</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-brand-foreground/90 font-light">
              At <strong>FYNÉ</strong>, every order is carefully checked before dispatch to ensure pristine quality and artisan craftsmanship.
            </p>
          </div>

          {/* 1. Accepted Returns & Exchanges */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">01.</span>
              Returns & Exchanges Eligibility
            </h2>
            <p className="text-brand-foreground/85">
              Returns and exchanges are only accepted if the issue is caused by <strong>FYNÉ</strong>, such as receiving an incorrect, damaged, or defective item.
            </p>
          </section>

          {/* 2. Change of Mind & Personal Preference */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">02.</span>
              Non-Eligible Reasons
            </h2>
            <p className="text-brand-foreground/85">
              We do not accept returns or exchanges due to change of mind, incorrect selection, or personal preference.
            </p>
          </section>

          {/* 3. 48-Hour Claim Window */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">03.</span>
              Reporting an Issue (48 Hours)
            </h2>
            <p className="text-brand-foreground/85">
              For eligible issues, please contact us within <strong>48 hours of delivery</strong> with your order number and clear photos/videos of the issue.
            </p>
          </section>

          {/* 4. Personalised & Monogrammed Products */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">04.</span>
              Personalised & Custom-Made Creations
            </h2>
            <p className="text-brand-foreground/85">
              Personalised, monogrammed, engraved, and custom-made items are non-returnable unless the error was made by <strong>FYNÉ</strong>.
            </p>
          </section>

          {/* 5. UAE Consumer Protection Laws */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">05.</span>
              Legal Governance
            </h2>
            <p className="text-brand-foreground/85">
              Any refunds or replacements will be handled in accordance with applicable <strong>UAE consumer-protection laws</strong>.
            </p>
          </section>

          {/* Contact & Concierge Action Box */}
          <div className="mt-12 p-6 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/20 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-serif text-xs font-semibold tracking-widest text-brand-heading uppercase flex items-center gap-2">
                <Mail size={14} className="text-brand-primary" />
                <span>Contact FYNÉ Concierge</span>
              </h4>
              <p className="text-[11px] text-brand-foreground/70">
                To report an issue or inquire about an order, email us at <a href="mailto:Fyneae@outlook.com" className="underline font-medium text-brand-heading">Fyneae@outlook.com</a>.
              </p>
            </div>
            <a
              href="mailto:Fyneae@outlook.com"
              className="text-[10px] tracking-widest font-semibold uppercase px-5 py-3 bg-brand-primary text-white dark:text-black rounded-xs hover:opacity-85 transition-opacity whitespace-nowrap"
            >
              Contact Support
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
