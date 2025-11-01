import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import InventoryList from "./components/InventoryList";
import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";
import SaleRecords from "./components/SaleRecords";

const API_BASE = process.env.REACT_APP_API_URL || ""; // proxy used if empty

export default function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API_BASE}/api/products${q}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sales`);
      const data = await res.json();
      setSales(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { if (search.length === 0) fetchProducts(); }, [search]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === product._id);
      if (existing) {
        return prev.map((p) => p.productId === product._id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) => prev.map((p) => p.productId === productId ? { ...p, quantity: qty } : p));
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(p => p.productId !== productId));
  const clearCart = () => setCart([]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch(`${API_BASE}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.map(c => ({ productId: c.productId, quantity: c.quantity })) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clearCart();
      await fetchProducts();
      await fetchSales();
      alert("Checkout successful!");
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = useMemo(() => {
    if (!search) return products;
    const s = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(s) || (p.tags || []).some(t => t.toLowerCase().includes(s)));
  }, [products, search]);

  return (
    <div>
      <Navbar onSearch={setSearch} />
      <div className="container">
        <div className="row">
          <div className="grow">
            <div className="card">
              <h2>Inventory</h2>
              <div className="row" style={{marginBottom: 10}}>
                <input className="search grow" placeholder="Search products by name or tag..." value={search} onChange={(e)=>setSearch(e.target.value)} />
                <button className="btn btn-ghost" onClick={fetchProducts}>Refresh</button>
              </div>
              {loading ? <p>Loading...</p> : error ? <p style={{color: "red"}}>{error}</p> :
                <InventoryList products={filtered} onAddToCart={addToCart} />
              }
            </div>

            <div className="card">
              <h2>Add New Product</h2>
              <AddProduct onCreated={fetchProducts} />
            </div>
          </div>

          <div className="grow">
            <div className="card">
              <h2>Cart</h2>
              <Cart cart={cart} onQtyChange={updateCartQty} onRemove={removeFromCart} onCheckout={handleCheckout} />
            </div>

            <div className="card">
              <h2>Sale Records</h2>
              <button className="btn btn-ghost" onClick={fetchSales}>Load Sales</button>
              <SaleRecords sales={sales} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
