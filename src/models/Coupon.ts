import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true }, // percentage (e.g. 20 for 20%) or fixed USD value (e.g. 15 for $15)
    expirationDate: { type: Date },
    usageLimit: { type: Number }, // max times it can be used overall (null for unlimited)
    usageCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
