"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore, convertAndFormatPrice } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, CreditCard, ShieldCheck, CheckCircle2, ArrowLeft, Landmark } from "lucide-react";
import PersonalizerPreview from "@/components/PersonalizerPreview";

const GCC_COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman"
] as const;

// Checkout Validation Schema
const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address details are required"),
  city: z.string().min(2, "City name is required"),
  country: z.enum(GCC_COUNTRIES),
  zipCode: z.string().min(1, "Zip code is required"),
  phone: z.string().min(6, "Phone number is required"),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, currency } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [shippingMethod, setShippingMethod] = useState<"standard" | "priority">("standard");
  const [paymentProvider] = useState<"cod">("cod");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [orderRef, setOrderRef] = useState("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError(null);
      } else {
        setCouponError(data.error || "Failed to validate coupon.");
      }
    } catch (err) {
      setCouponError("Unable to validate coupon code.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const subtotalUSD = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCostUSD = shippingMethod === "priority" ? 15 : 0;
  
  let discountUSD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discountUSD = (subtotalUSD * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "fixed") {
      discountUSD = appliedCoupon.value;
    }
  }
  const totalUSD = Math.max(0, subtotalUSD + shippingCostUSD - discountUSD);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "United Arab Emirates",
      zipCode: "00000",
    }
  });

  const watchedFirstName = watch("firstName") || "";
  const watchedLastName = watch("lastName") || "";
  const watchedAddress = watch("address") || "";
  const watchedCity = watch("city") || "";

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["firstName", "lastName", "email", "address", "city", "country", "zipCode", "phone"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const onInvalid = (formErrors: any) => {
    console.warn("Validation errors on checkout submission:", formErrors);
    setStep(1);
  };

  const processPayment = async (data: CheckoutInput) => {
    setPaymentStatus("processing");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customerInfo: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            address: data.address,
            city: data.city,
            country: data.country,
            phone: data.phone,
            zipCode: data.zipCode
          },
          paymentProvider: paymentProvider,
          shippingMethod: shippingMethod,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
        }),
      });

      const result = await response.json();
      console.log("MongoDB Inbound Order API Output:", result);

      setTimeout(() => {
        setPaymentStatus("success");
        setOrderRef(result.orderReference || `FYN-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep(4);
      }, 1500);

    } catch (err) {
      console.error(err);
      setPaymentStatus("idle");
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-white dark:bg-[#0d0c0b]">
        <h2 className="font-serif text-lg tracking-widest text-brand-foreground/50 mb-6 uppercase">YOUR SHOPPING BAG IS CURRENTLY EMPTY</h2>
        <button
          onClick={() => router.push("/")}
          className="btn-primary py-3 px-8 text-[10px]"
        >
          RETURN TO HOME
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d0c0b] text-brand-foreground py-16 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto pt-12">
        
        {/* Step Progress bar */}
        {step < 4 && (
          <div className="max-w-xl mx-auto mb-16 relative">
            <div className="flex items-center justify-between text-[10px] tracking-widest font-semibold uppercase text-brand-foreground/50 z-10 relative">
              <span className={step >= 1 ? "text-brand-primary font-bold" : ""}>1. Customer</span>
              <span className={step >= 2 ? "text-brand-primary font-bold" : ""}>2. Delivery</span>
              <span className={step >= 3 ? "text-brand-primary font-bold" : ""}>3. Payment</span>
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-border -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-px bg-brand-primary -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? "10%" : step === 2 ? "50%" : "90%" }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: checkout step form panels */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Customer info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-left">
                    <h2 className="font-serif text-2xl tracking-wide uppercase text-brand-heading">Customer Information</h2>
                    <p className="text-xs text-brand-foreground/60">Enter your shipping details below.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-left">
                        <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">First Name</label>
                        <input
                          type="text"
                          {...register("firstName")}
                          className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                          placeholder="First Name"
                        />
                        {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Last Name</label>
                        <input
                          type="text"
                          {...register("lastName")}
                          className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                          placeholder="Last Name"
                        />
                        {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Email Address</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                        placeholder="email@example.com"
                      />
                      {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Shipping Address</label>
                      <input
                        type="text"
                        {...register("address")}
                        className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                        placeholder="Street Address, Apt #"
                      />
                      {errors.address && <p className="text-[10px] text-red-500">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 text-left">
                        <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">City</label>
                        <input
                          type="text"
                          {...register("city")}
                          className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                          placeholder="Dubai"
                        />
                        {errors.city && <p className="text-[10px] text-red-500">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">GCC Destination Country</label>
                        <select
                          {...register("country")}
                          className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden text-brand-foreground cursor-pointer"
                        >
                          {GCC_COUNTRIES.map((c) => (
                            <option key={c} value={c} className="bg-white dark:bg-[#121110] text-brand-foreground">
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.country && <p className="text-[10px] text-red-500">{errors.country.message}</p>}
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Zip/Postal Code</label>
                        <input
                          type="text"
                          {...register("zipCode")}
                          className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                          placeholder="00000"
                        />
                        {errors.zipCode && <p className="text-[10px] text-red-500">{errors.zipCode.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Phone Number</label>
                      <input
                        type="text"
                        {...register("phone")}
                        className="w-full bg-white dark:bg-[#0d0c0b] border border-brand-border focus:border-brand-primary text-xs tracking-widest px-4 py-3 rounded-xs uppercase focus:outline-hidden"
                        placeholder="+971 50 123 4567"
                      />
                      {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message}</p>}
                    </div>

                  </div>

                  <div className="pt-6 border-t border-brand-border flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary py-3.5 px-8 text-[10px] flex items-center gap-1.5"
                    >
                      CONTINUE TO DELIVERY <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Shipping Method */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-left">
                    <h2 className="font-serif text-2xl tracking-wide uppercase text-brand-heading">Delivery Method</h2>
                    <p className="text-xs text-brand-foreground/60">Choose your shipping tier preference.</p>
                  </div>

                  <div className="space-y-4 text-left">
                    
                    {/* Standard Complementary */}
                    <div 
                      onClick={() => setShippingMethod("standard")}
                      className={`p-6 border rounded-xs cursor-pointer flex justify-between items-start transition-all duration-300 ${
                        shippingMethod === "standard" 
                          ? "border-brand-primary bg-brand-bg-gray dark:bg-zinc-900/10 shadow-xs" 
                          : "border-brand-border hover:border-brand-primary/40"
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-sans text-xs tracking-wider font-semibold uppercase text-brand-heading">Atelier Express Air Delivery</h4>
                        <p className="text-xs text-brand-foreground/60 font-light max-w-md">3–5 business days. Monogram engraving preparation included. Fully insured.</p>
                      </div>
                      <span className="font-sans text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Complimentary</span>
                    </div>

                    {/* Priority Delivery */}
                    <div 
                      onClick={() => setShippingMethod("priority")}
                      className={`p-6 border rounded-xs cursor-pointer flex justify-between items-start transition-all duration-300 ${
                        shippingMethod === "priority" 
                          ? "border-brand-primary bg-brand-bg-gray dark:bg-zinc-900/10 shadow-xs" 
                          : "border-brand-border hover:border-brand-primary/40"
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-sans text-xs tracking-wider font-semibold uppercase text-brand-heading">Priority Monogram Hand-Delivery</h4>
                        <p className="text-xs text-brand-foreground/60 font-light max-w-md">1–2 business days. Moves your custom debossing order to the front of the atelier list.</p>
                      </div>
                      <span className="font-sans text-xs font-semibold">{convertAndFormatPrice(15, currency)}</span>
                    </div>

                  </div>

                  <div className="pt-6 border-t border-brand-border flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="btn-secondary py-3.5 px-8 text-[10px] flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> BACK
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="btn-primary py-3.5 px-8 text-[10px] flex items-center gap-1.5"
                    >
                      CONTINUE TO PAYMENT <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment Panel */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8"
                >
                  <div className="space-y-2 text-left">
                    <h2 className="font-serif text-2xl tracking-wide uppercase text-brand-heading">Payment Method</h2>
                    <p className="text-xs text-brand-foreground/60">Exclusive Cash on Delivery (COD) service for GCC destinations.</p>
                  </div>

                  {/* GCC Cash on Delivery (COD) Exclusive Card */}
                  <div className="p-8 border border-brand-primary bg-brand-bg-gray dark:bg-zinc-900/30 rounded-xs space-y-5 text-left">
                    <div className="flex items-center gap-3 text-brand-primary">
                      <ShieldCheck size={26} className="text-brand-primary flex-shrink-0" />
                      <h3 className="font-serif text-lg tracking-wider uppercase font-semibold text-brand-heading">
                        GCC Cash on Delivery (COD)
                      </h3>
                    </div>
                    <p className="text-xs text-brand-foreground/80 leading-relaxed font-light">
                      Cash on Delivery is enabled for all GCC destinations (United Arab Emirates, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman). 
                      Pay safely upon hand-delivery of your bespoke atelier box.
                    </p>
                    <div className="flex items-center gap-2 pt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-widest uppercase">
                      <CheckCircle2 size={15} /> COMPLIMENTARY INSURED HAND-DELIVERY & ENGRAVING INCLUDED
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-border flex justify-between">
                    <button
                      type="button"
                      disabled={paymentStatus === "processing"}
                      onClick={handlePrevStep}
                      className="btn-secondary py-3.5 px-8 text-[10px] flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <ArrowLeft size={14} /> BACK
                    </button>
                    <button
                      type="button"
                      disabled={paymentStatus === "processing"}
                      onClick={handleSubmit(processPayment, onInvalid)}
                      className="btn-primary py-3.5 px-10 text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {paymentStatus === "processing" ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          CONFIRMING ORDER...
                        </>
                      ) : (
                        `CONFIRM COD ORDER (${convertAndFormatPrice(totalUSD, currency)})`
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success Receipt */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs p-8 md:p-12 shadow-xs flex flex-col items-center"
                >
                  <CheckCircle2 size={52} className="text-emerald-600 animate-pulse mb-2" />
                  
                  <div className="space-y-3">
                    <span className="font-sans text-[9px] tracking-[0.25em] font-semibold text-brand-foreground/50 uppercase">TRANSACTION SECURED</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-brand-heading uppercase">Thank You for Your Order</h2>
                    <p className="text-xs text-brand-foreground/70 max-w-md mx-auto leading-relaxed">
                      Your payment has been successfully authorized. Our Athens studio has received your monogram details and is prepping your custom leather hide.
                    </p>
                  </div>

                  {/* Summary Details */}
                  <div className="w-full max-w-md border-t border-b border-brand-border py-6 my-6 text-left space-y-4 text-xs font-light">
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/55">Order Reference</span>
                      <span className="font-semibold text-brand-heading tracking-wider font-mono">{orderRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/55">Customer Name</span>
                      <span className="font-semibold uppercase text-brand-heading">{watchedFirstName} {watchedLastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/55">Shipping Destination</span>
                      <span className="font-semibold text-right max-w-[240px] truncate text-brand-heading">{watchedAddress}, {watchedCity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-foreground/55">Total Paid</span>
                      <span className="font-bold text-brand-primary">{convertAndFormatPrice(totalUSD, currency)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      clearCart();
                      router.push("/");
                    }}
                    className="btn-primary py-4 px-12 text-[10px]"
                  >
                    CONTINUE SHOPPING
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Order Summary Side Frame */}
          {step < 4 && (
            <div className="lg:col-span-5 bg-brand-bg-gray dark:bg-zinc-900/10 border border-brand-border rounded-xs p-6 space-y-6 lg:sticky lg:top-28">
              <h3 className="font-serif text-sm tracking-wider uppercase border-b border-brand-border pb-3 text-brand-heading text-left">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-16 bg-white dark:bg-[#0d0c0b] rounded-xs flex items-center justify-center border border-brand-border p-1 relative overflow-hidden flex-shrink-0">
                        {item.productId !== "balm-refill-trio" ? (
                          <PersonalizerPreview 
                            color={item.color} 
                            initials={item.initials} 
                            foilColor={item.foilColor}
                            size="sm" 
                            className="scale-90"
                          />
                        ) : (
                          <div className="w-6 h-10 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-xs" />
                        )}
                      </div>
                      <div className="space-y-0.5 text-left">
                        <h4 className="font-sans text-xs font-semibold uppercase text-brand-heading">{item.name}</h4>
                        <p className="text-[10px] text-brand-foreground/50">Qty: {item.quantity} • {item.color}</p>
                        {item.initials && <p className="text-[9px] text-brand-primary font-semibold tracking-widest uppercase">({item.initials} - {item.foilColor || "gold"})</p>}
                        {item.giftWrap && <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">+ PREMIUM GIFT WRAP (+$10 USD)</p>}
                      </div>
                    </div>
                    <span className="font-sans text-xs font-semibold text-brand-heading">
                      {convertAndFormatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Entry */}
              <div className="border-t border-brand-border pt-4 text-left space-y-2">
                <label className="font-serif text-[10px] tracking-widest font-semibold uppercase text-brand-primary">Atelier Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!appliedCoupon || validatingCoupon}
                    placeholder="ENTER CODE"
                    className="flex-grow bg-white dark:bg-[#0d0c0b] border border-brand-border text-xs px-3 py-2.5 uppercase tracking-wider rounded-xs focus:outline-hidden focus:border-brand-primary font-mono disabled:opacity-50"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                      }}
                      className="px-3.5 py-2 text-[9px] font-bold tracking-widest uppercase text-red-500 border border-red-500/30 hover:border-red-500 rounded-xs cursor-pointer bg-transparent"
                    >
                      REMOVE
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 py-2 text-[9px] font-bold tracking-widest uppercase bg-brand-primary text-white dark:bg-white dark:text-black rounded-xs cursor-pointer border border-brand-primary dark:border-white disabled:opacity-50"
                    >
                      APPLY
                    </button>
                  )}
                </div>
                {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                {appliedCoupon && <p className="text-[10px] text-emerald-600 font-semibold">Coupon applied successfully!</p>}
              </div>

              {/* Cost calculations */}
              <div className="border-t border-brand-border pt-4 space-y-2 text-xs text-left">
                <div className="flex justify-between text-brand-foreground/60">
                  <span>Subtotal</span>
                  <span>{convertAndFormatPrice(subtotalUSD, currency)}</span>
                </div>
                <div className="flex justify-between text-brand-foreground/60">
                  <span>Delivery method</span>
                  <span>{shippingMethod === "priority" ? convertAndFormatPrice(15, currency) : "Free"}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-red-500 font-semibold">
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                    <span>-{convertAndFormatPrice(discountUSD, currency)}</span>
                  </div>
                )}
                <div className="h-px bg-brand-border my-2" />
                <div className="flex justify-between text-sm font-semibold uppercase text-brand-heading">
                  <span>Total Due</span>
                  <span>{convertAndFormatPrice(totalUSD, currency)}</span>
                </div>
              </div>

              {/* Secure note */}
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900/20 border border-brand-border rounded-xs text-[9px] text-brand-foreground/50 leading-relaxed font-sans text-left">
                <ShieldCheck size={14} className="text-brand-primary flex-shrink-0" />
                <span>All transactions are encrypted and direct payment keys are handled in secure isolation.</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
