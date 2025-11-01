import React from "react";

export default function SaleRecords({ sales }) {
  if (!sales || sales.length === 0) return <p>No sales loaded yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Date/Time</th>
          <th>Items</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {sales.map(s => (
          <tr key={s._id}>
            <td>{new Date(s.createdAt).toLocaleString()}</td>
            <td>
              {s.items.map(i => (
                <div key={i._id}>{i.name} × {i.quantity} @ ₹{i.price}</div>
              ))}
            </td>
            <td>₹{s.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
