import React from "react";

export default function Navbar({ onSearch }) {
  return (
    <nav className="nav">
      <div><strong>Store Manager</strong></div>
      <ul>
        <li>Dashboard</li>
        <li>Inventory</li>
        <li>Sales</li>
        <li>Settings</li>
      </ul>
    </nav>
  );
}
