import mongoose, { Schema } from "mongoose";

const ShippingZoneSchema = new Schema(
  {
    zoneName: { type: String, required: true, unique: true },
    countries: { type: [String], default: [], index: true }, // List of country names (e.g., "United Arab Emirates")
    baseRate: { type: Number, required: true, default: 0 }, // in USD
    priorityRate: { type: Number, required: true, default: 15 }, // in USD
    minFreeShippingSubtotal: { type: Number, default: 100 } // Free base rate above this subtotal
  },
  { timestamps: true }
);

export default mongoose.models.ShippingZone || mongoose.model("ShippingZone", ShippingZoneSchema);
