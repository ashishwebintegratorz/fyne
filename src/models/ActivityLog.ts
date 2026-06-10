import mongoose, { Schema } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    adminEmail: { type: String, required: true, index: true },
    action: { type: String, required: true }, // e.g., "LOGIN", "PRODUCT_CREATE", "COUPON_DELETE"
    details: { type: String }, // e.g., "Created product: Cocoa Brown Crocodile Set"
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
