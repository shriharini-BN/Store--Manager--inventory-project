import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/store_manager_inventory";

const sample = [
  { name: "Laptop", imageUrl: "", price: 60000, stock: 10, tags: ["electronics"], alertAt: 3 },
  { name: "Mobile Phone", imageUrl: "", price: 15000, stock: 25, tags: ["electronics"], alertAt: 5 },
  { name: "Headphones", imageUrl: "", price: 2000, stock: 40, tags: ["accessories"], alertAt: 5 },
  { name: "USB Cable", imageUrl: "", price: 200, stock: 100, tags: ["accessories"], alertAt: 10 }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(sample);
    console.log("✅ Seeded products");
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
