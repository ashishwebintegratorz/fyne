import mongoose, { Schema } from "mongoose";

const CustomizerColorSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    hex: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    desc: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.models.CustomizerColor || mongoose.model("CustomizerColor", CustomizerColorSchema);
