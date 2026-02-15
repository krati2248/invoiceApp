import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <h2 className="logo">InvoiceApp</h2>

      <div className="nav-right">
    <button className="menu-btn" onClick={() => setOpen(!open)}>
      ☰
    </button>

    <div className={`links ${open ? "open" : ""}`}>
      <Link to="/" className="link" onClick={() => setOpen(false)}>Create Invoice</Link>
      <Link to="/invoicelist" className="link" onClick={() => setOpen(false)}>Invoice List</Link>
    </div>
  </div>
    </nav>
  );
}

export default Navbar;
 