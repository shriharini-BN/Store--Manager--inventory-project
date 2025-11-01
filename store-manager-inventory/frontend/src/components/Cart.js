import React from "react";

export default function Cart({ cart, onQtyChange, onRemove, onCheckout }) {
  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div>
      {cart.length === 0 ? <p>Cart empty.</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>
                  <input type="number" min="1" value={item.quantity} onChange={(e)=>onQtyChange(item.productId, Number(e.target.value))} style={{width: 80}} />
                </td>
                <td>₹{item.price * item.quantity}</td>
                <td>
                  <button className="btn btn-danger" onClick={()=>onRemove(item.productId)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{display:"flex", justifyContent:"space-between", marginTop: 10}}>
        <strong>Total: ₹{total}</strong>
        <button className="btn btn-primary" disabled={cart.length===0} onClick={onCheckout}>Checkout</button>
      </div>
    </div>
  );
}
