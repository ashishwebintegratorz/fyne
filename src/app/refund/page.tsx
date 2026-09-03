import React from "react";
import Link from "next/link";
import { RotateCcw, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Refund & Return Policy | Maison de Fyné",
  description: "Bespoke return, replacement, and refund policies under the Consumer Protection Law of the Republic of Iraq.",
};

export default function RefundPage() {
  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground min-h-screen py-16 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto pt-10">

        {/* Top label & Heading */}
        <div className="text-center space-y-4 mb-16">
          <span className="font-sans text-[10px] tracking-[0.3em] font-semibold text-brand-foreground/60 uppercase">
            CONSUMER RIGHTS · REPUBLIC OF IRAQ
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-brand-heading uppercase">
            Refund & Return Policy
          </h1>
          <p className="font-sans text-xs tracking-widest text-brand-foreground/60 uppercase">
            In Accordance with Iraqi Consumer Protection Law No. 79 of 2017
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
            Refund & Returns
          </span>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-xs md:text-sm font-light text-brand-foreground/85 leading-relaxed border-t border-brand-border pt-10">

          {/* Statutory Notice Banner */}
          <div className="p-5 border border-brand-heading/20 bg-brand-bg-gray dark:bg-zinc-900/30 rounded-xs space-y-2">
            <div className="flex items-center gap-2 text-brand-heading font-serif text-xs md:text-sm uppercase tracking-wider font-medium">
              <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400" />
              <span>Important Notice on Bespoke Luxury & Hygienic Goods</span>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-foreground/80">
              Pursuant to the <strong>Iraqi Consumer Protection Law (Law No. 79 of 2017)</strong> and international luxury atelier standards, items that have been customized or personalized according to client specifications (including custom foil hot-stamped monograms) and personal cosmetic items (such as lip balms with unsealed packaging) are <strong>strictly exempt from voluntary return or exchange</strong>, except in instances of genuine defect or transportation damage verified upon receipt.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">01.</span>
              Statutory Consumer Rights in Iraq
            </h2>
            <p>
              Under <strong>Law No. 79 of 2017</strong>, consumers in the Republic of Iraq are entitled to receive goods that strictly conform to agreed specifications, are free from hidden defects, and are fit for purpose. Maison de Fyné honors all statutory consumer guarantees under Iraqi law.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">02.</span>
              Bespoke Monogram Exclusions
            </h2>
            <p>
              Each Fyné leather casing is personalized individually by hand using precision foil hot-stamping. Because personalized goods cannot be re-stocked or re-sold:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-brand-foreground/80">
              <li>
                <strong>Non-Returnable:</strong> Monogrammed leather cases cannot be returned, exchanged, or refunded for change of mind, choice of color, or personal initial misspelling entered by the buyer.
              </li>
              <li>
                <strong>Cancellations:</strong> Order cancellations or initial changes can only be accommodated within <strong>2 hours</strong> of order placement, provided artisan embossing has not yet begun.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">03.</span>
              Cosmetic Hygiene Protection
            </h2>
            <p>
              To ensure the health, safety, and hygiene of all patrons, lip balm cartridges and cosmetic formulas cannot be accepted for return if the exterior tamper seal, protective foil, or packaging has been unsealed or handled, unless an adverse formulation defect is substantiated.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">04.</span>
              Defective, Damaged or Non-Conforming Deliveries
            </h2>
            <p>
              If your bespoke piece arrives with a craftsmanship defect, leather flaw, incorrect monogram stamping executed by our atelier, or physical damage sustained during transit:
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#121110] border border-brand-border">
                <span className="font-serif font-semibold text-xs text-brand-heading">Step 1:</span>
                <p className="text-[11px] text-brand-foreground/80">
                  Notify our Atelier Concierge within <strong>48 hours</strong> of courier delivery at <a href="mailto:Fyneae@outlook.com" className="underline font-medium text-brand-heading">Fyneae@outlook.com</a> with your order number and clear photographs of the defect/damage.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#121110] border border-brand-border">
                <span className="font-serif font-semibold text-xs text-brand-heading">Step 2:</span>
                <p className="text-[11px] text-brand-foreground/80">
                  Our master artisan team will inspect the documentation. Upon approval, our courier service will arrange return collection of the defective item at zero expense to you.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-[#121110] border border-brand-border">
                <span className="font-serif font-semibold text-xs text-brand-heading">Step 3:</span>
                <p className="text-[11px] text-brand-foreground/80">
                  You may choose between: (a) An immediate priority replacement crafted and dispatched without charge, or (b) A full refund credited via the original payment method or secure bank transfer.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-base md:text-lg font-normal tracking-wider text-brand-heading uppercase flex items-center gap-2">
              <span className="text-brand-foreground/40 font-sans text-xs">05.</span>
              Refund Processing Timelines
            </h2>
            <p>
              Approved refunds are initiated within <strong>3 to 5 business days</strong> following receipt and verification of the returned parcel. Depending on your banking institution or electronic payment card issuer, funds typically reflect in your account within 5 to 14 business days. For approved Cash on Delivery orders, refunds are issued via direct bank deposit or digital atelier credit.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-12 p-6 border border-brand-border bg-brand-bg-gray/40 dark:bg-zinc-900/20 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-serif text-xs font-semibold tracking-widest text-brand-heading uppercase">
                Initiate a Claim or Inquire
              </h4>
              <p className="text-[11px] text-brand-foreground/70 mt-1">
                Reach our customer care team regarding delivery damage, replacement requests, or refund status.
              </p>
            </div>
            <a
              href="mailto:Fyneae@outlook.com"
              className="text-[10px] tracking-widest font-semibold uppercase px-4 py-2.5 bg-brand-primary text-white dark:text-black rounded-xs hover:opacity-85 transition-opacity"
            >
              Contact Concierge
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
