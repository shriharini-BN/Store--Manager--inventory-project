import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products (optional ?q= search)
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (create new product)
router.post("/", async (req, res) => {
  try {
    const { name, imageUrl, price, stock, tags, alertAt } = req.body;
    if (!name || price == null || stock == null) {
      return res.status(400).json({ error: "name, price, and stock are required" });
    }
    const product = await Product.create({
      name,
      imageUrl: imageUrl || "",
      price: Number(price),
      stock: Number(stock),
      tags: Array.isArray(tags) ? tags : (typeof tags === "string" && tags ? tags.split(",").map(t => t.trim()) : []),
      alertAt: alertAt != null ? Number(alertAt) : 5
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (update details or stock)
router.put("/:id", async (req, res) => {
  try {
    const update = req.body || {};
    if (update.price != null) update.price = Number(update.price);
    if (update.stock != null) update.stock = Number(update.stock);
    if (update.alertAt != null) update.alertAt = Number(update.alertAt);
    if (update.tags && typeof update.tags === "string") {
      update.tags = update.tags.split(",").map(t => t.trim());
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/lowstock?threshold=5
router.get("/lowstock", async (req, res) => {
  try {
    const threshold = Number(req.query.threshold ?? 5);
    const products = await Product.find({ stock: { $lte: threshold } }).sort({ stock: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
