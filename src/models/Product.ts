import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // in USD
    description: { type: String, required: true },
    benefits: { type: [String], default: [] },
    faqs: [
      {
        q: { type: String, required: true },
        a: { type: String, required: true }
      }
    ],
    isCustomizable: { type: Boolean, default: true },
    defaultColor: { type: String, default: "" },
    colorHex: { type: String, default: "" },
    defaultInitials: { type: String, default: "" },
    category: { type: String, required: true, default: "Lip Balm" },
    textPosition: { type: String, enum: ["top", "center", "bottom", "custom"], default: "center" },
    textPositionY: { type: Number, default: 48 }, // Percentage from top (e.g. 26 for top lipliner case, 48 for balm center)
    textPositionX: { type: String, enum: ["left", "center", "right"], default: "center" },
    stock: { type: Number, required: true, default: 100 },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["active", "draft"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
