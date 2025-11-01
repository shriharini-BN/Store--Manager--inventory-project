import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: "" },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  tags: [{ type: String }],
  alertAt: { type: Number, default: 5 }
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
