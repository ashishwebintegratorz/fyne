import * as z from "zod";

// Product Validation Schema
export const ProductSchema = z.object({
  productId: z.string().min(2, "Product ID must be at least 2 characters").trim().toLowerCase(),
  name: z.string().min(2, "Product name must be at least 2 characters").trim(),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  description: z.string().min(5, "Description must be at least 5 characters").trim(),
  benefits: z.array(z.string()).default([]),
  faqs: z.array(
    z.object({
      q: z.string().min(2, "Question must be at least 2 characters").trim(),
      a: z.string().min(2, "Answer must be at least 2 characters").trim(),
    })
  ).default([]),
  category: z.string().trim().default("Lip Balm"),
  defaultColor: z.string().optional().default(""),
  colorHex: z.string().optional().default(""),
  textPosition: z.enum(["top", "center", "bottom", "custom"]).default("center"),
  textPositionY: z.number().min(0).max(100).default(48),
  textPositionX: z.enum(["left", "center", "right"]).default("center"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(100),
  images: z.array(z.string().min(1, "Invalid image path")).default([]),
  status: z.enum(["active", "draft"]).default("active"),
});

// Customizer Color Casing Schema
export const CasingSchema = z.object({
  name: z.string().min(2, "Casing name must be at least 2 characters").trim(),
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid Hex color code format").trim(),
  image: z.string().min(1, "Image path is required").trim(),
  desc: z.string().optional().default(""),
});

// Checkout Order Schema
export const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product SKU ID is required").trim(),
      name: z.string().min(1, "Product name is required").trim(),
      price: z.number().min(0, "Price must be positive"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
      color: z.string().optional().default(""),
      initials: z.string().max(6, "Initials cannot exceed 4 characters").optional().default(""),
      foilColor: z.enum(["gold", "silver"]).optional().default("gold"),
      giftWrap: z.boolean().default(false),
      image: z.string().optional().default(""),
    })
  ).nonempty("Order must contain at least one item"),
  customerInfo: z.object({
    name: z.string().min(2, "Customer name is required").trim(),
    email: z.string().email("Invalid email address format").trim().toLowerCase(),
    phone: z.string().min(6, "Phone number is required").trim(),
    address: z.string().min(5, "Address must be at least 5 characters").trim(),
    city: z.string().min(2, "City name is required").trim(),
    country: z.string().min(2, "Country name is required").trim(),
    zipCode: z.string().min(1, "Zip code is required").default("00000"),
  }),
  paymentProvider: z.enum(["mock", "stripe", "razorpay", "cod"]).default("cod"),
  shippingMethod: z.enum(["standard", "priority"]).default("standard"),
  couponCode: z.string().nullable().optional(),
});

// Coupon Validation Schema
export const CouponSchema = z.object({
  code: z.string().min(2, "Coupon code must be at least 2 characters").trim().toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0, "Coupon value must be greater than or equal to 0"),
  expirationDate: z.string().optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  active: z.boolean().default(true),
});

// Admin Login Schema
export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// Order Update Schema
export const OrderUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
  trackingNumber: z.string().optional(),
});

// Shipping Zone Validation Schema
export const ShippingZoneSchema = z.object({
  zoneName: z.string().min(2, "Zone name must be at least 2 characters").trim(),
  countries: z.array(z.string().min(1)).nonempty("At least one country must be added"),
  baseRate: z.number().min(0, "Base rate must be non-negative").default(0),
  priorityRate: z.number().min(0, "Priority rate must be non-negative").default(15),
  minFreeShippingSubtotal: z.number().min(0, "Minimum subtotal must be non-negative").nullable().optional().default(100),
});




