import mongoose from "mongoose";

const SaleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 } // price at time of sale
});

const SaleSchema = new mongoose.Schema({
  items: [SaleItemSchema],
  total: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model("Sale", SaleSchema);
