import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || ""; // use proxy

export default function AddProduct({ onCreated }) {
  const [form, setForm] = useState({ name:"", imageUrl:"", price:"", stock:"", tags:"", alertAt:5 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          imageUrl: form.imageUrl,
          price: Number(form.price),
          stock: Number(form.stock),
          tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
          alertAt: Number(form.alertAt)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setForm({ name:"", imageUrl:"", price:"", stock:"", tags:"", alertAt:5 });
      onCreated && onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="row">
        <input className="search grow" name="name" placeholder="Product name" value={form.name} onChange={onChange} required />
        <input className="search grow" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={onChange} />
      </div>
      <div className="row" style={{marginTop:8}}>
        <input className="search" style={{width:140}} type="number" name="price" placeholder="Price" value={form.price} onChange={onChange} required />
        <input className="search" style={{width:140}} type="number" name="stock" placeholder="Stock" value={form.stock} onChange={onChange} required />
        <input className="search grow" name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={onChange} />
        <input className="search" style={{width:160}} type="number" name="alertAt" placeholder="Alert when stock ≤" value={form.alertAt} onChange={onChange} />
        <button className="btn btn-primary" disabled={saving} style={{minWidth:120}}>{saving ? "Saving..." : "Add"}</button>
      </div>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}
