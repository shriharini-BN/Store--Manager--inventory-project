import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import salesRouter from "./routes/sales.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/store_manager_inventory";
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => res.send({ status: "ok", message: "Store Manager Inventory API" }));

app.use("/api/products", productsRouter);
app.use("/api/sales", salesRouter);
