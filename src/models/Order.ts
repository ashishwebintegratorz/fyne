import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderReference: { type: String, required: true, unique: true, index: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, index: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String }
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true }, // in USD
        quantity: { type: Number, required: true, default: 1 },
        color: { type: String },
        initials: { type: String },
        giftWrap: { type: Boolean, default: false },
        image: { type: String }
      }
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    paymentProvider: { type: String, enum: ["stripe", "razorpay", "mock"], default: "mock" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    shippingMethod: { type: String, enum: ["standard", "priority"], default: "standard" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true
    },
    trackingNumber: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
