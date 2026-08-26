import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    addresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String },
        isDefault: { type: Boolean, default: false }
      }
    ],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    activity: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    totalSpend: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
