import React from "react";

export default function InventoryList({ products, onAddToCart }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Tags</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p._id} className={p.stock <= (p.alertAt ?? 5) ? "low-stock" : ""}>
            <td>{p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{width:40, height:40, objectFit:"cover", borderRadius:6}} /> : "—"}</td>
            <td>{p.name}</td>
            <td>₹{p.price}</td>
            <td>{p.stock}</td>
            <td>{(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</td>
            <td><button className="btn btn-primary" onClick={() => onAddToCart(p)}>Add to Cart</button></td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr><td colSpan="6" style={{textAlign:"center"}}>No products found.</td></tr>
        )}
      </tbody>
    </table>
  );
}
