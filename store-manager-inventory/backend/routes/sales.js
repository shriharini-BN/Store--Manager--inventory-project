import express from "express";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";

const router = express.Router();

// GET /api/sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sales  body: { items: [{ productId, quantity }] }
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required" });
    }

    // Fetch products and validate stock
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [String(p._id), p]));

    let saleItems = [];
    let total = 0;

    for (const item of items) {
      const p = productMap.get(String(item.productId));
      if (!p) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      const qty = Number(item.quantity);
      if (qty <= 0) return res.status(400).json({ error: "Quantity must be > 0" });
      if (p.stock < qty) return res.status(400).json({ error: `Insufficient stock for ${p.name}` });

      // accumulate
      saleItems.push({ product: p._id, name: p.name, quantity: qty, price: p.price });
      total += qty * p.price;
    }

    // Deduct stock
    for (const s of saleItems) {
      await Product.findByIdAndUpdate(s.product, { $inc: { stock: -s.quantity } });
    }

    // Save sale
    const sale = await Sale.create({ items: saleItems, total });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
