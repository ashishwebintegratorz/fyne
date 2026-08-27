"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Instagram, MapPin, Check } from "lucide-react";

// Form Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  inquiryType: z.string().min(1, "Please choose an inquiry type"),
  message: z.string().min(10, "Your message must contain at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactInput) => {
    console.log("Submitting contact message:", data);
    reset();
  };

  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground py-16 px-6 md:px-12 font-sans">
      <div className="max-w-6xl mx-auto pt-12">

        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <span className="font-sans text-xs tracking-[0.3em] font-semibold text-brand-foreground/50 uppercase">CONTACT US</span>
          <h1 className="font-serif text-4xl md:text-6xl font-light tracking-wide text-brand-heading uppercase">
            Atelier Concierge
          </h1>
          <div className="w-12 h-px bg-brand-primary mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Info Card Columns (Left) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h3 className="font-serif text-lg tracking-wider text-brand-heading uppercase">How can we assist you?</h3>
              <p className="font-sans text-xs md:text-sm font-light text-brand-foreground/75 leading-relaxed">
                Our bespoke concierge desk is available to assist you with order status, custom monogram requests, wholesale inquiries, or ingredients details. Please expect a reply within 12–24 business hours.
              </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-brand-border">

              {/* Direct Mail */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 rounded-full border border-brand-border text-brand-foreground mt-1">
                  <Mail size={14} />
                </div>
                <div>
                  <h4 className="font-serif tracking-widest text-[10px] font-semibold text-brand-heading uppercase">Email concierge</h4>
                  <p className="font-sans text-xs md:text-sm font-light hover:text-brand-primary transition-colors mt-1">
                    <a href="mailto:Fyneae@outlook.com">Fyneae@outlook.com</a>
                  </p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start space-x-4">
                <div className="p-2.5 rounded-full border border-brand-border text-brand-foreground mt-1">
                  <Instagram size={14} />
                </div>
                <div>
                  <h4 className="font-serif tracking-widest text-[10px] font-semibold text-brand-heading uppercase">Follow Instagram</h4>
                  <p className="font-sans text-xs md:text-sm font-light hover:text-brand-primary transition-colors mt-1">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">@fyne.ae</a>
                  </p>
                </div>
              </div>



            </div>
          </div>

          {/* Contact Form Box (Right) */}
          <div className="lg:col-span-7 bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs p-8 md:p-10 shadow-xs">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name field */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] font-semibold tracking-widest uppercase text-brand-heading">Name</label>
                  <input
                    type="text"
                    placeholder="YOUR FULL NAME"
                    {...register("name")}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3.5 focus:outline-hidden rounded-xs placeholder-brand-foreground/30 uppercase"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-red-500 font-sans tracking-wide">{errors.name.message}</p>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label className="font-serif text-[10px] font-semibold tracking-widest uppercase text-brand-heading">Email Address</label>
                  <input
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    {...register("email")}
                    className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3.5 focus:outline-hidden rounded-xs placeholder-brand-foreground/30 uppercase"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-sans tracking-wide">{errors.email.message}</p>
                  )}
                </div>

              </div>

              {/* Inquiry type */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] font-semibold tracking-widest uppercase text-brand-heading">Inquiry Type</label>
                <select
                  {...register("inquiryType")}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3.5 focus:outline-hidden rounded-xs placeholder-brand-foreground/30 uppercase"
                >
                  <option value="">CHOOSE REASON</option>
                  <option value="order-status">Order Status / Delivery</option>
                  <option value="customization">Bespoke Monogram Requests</option>
                  <option value="refill">Refill System Support</option>
                  <option value="general">General Atelier Request</option>
                </select>
                {errors.inquiryType && (
                  <p className="text-[10px] text-red-500 font-sans tracking-wide">{errors.inquiryType.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="font-serif text-[10px] font-semibold tracking-widest uppercase text-brand-heading">Message</label>
                <textarea
                  rows={5}
                  placeholder="WRITE YOUR MESSAGE HERE..."
                  {...register("message")}
                  className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3.5 focus:outline-hidden rounded-xs placeholder-brand-foreground/30 uppercase leading-relaxed resize-none"
                />
                {errors.message && (
                  <p className="text-[10px] text-red-500 font-sans tracking-wide">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-[10px] py-4"
              >
                SEND INQUIRY TO ATELIER
              </button>

              {isSubmitSuccessful && (
                <div className="flex items-center gap-2 p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xs text-xs tracking-wide font-sans justify-center">
                  <Check size={16} />
                  <span>Message sent successfully. Our concierge will be in touch shortly.</span>
                </div>
              )}

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
