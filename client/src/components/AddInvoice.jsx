import { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import './AddInvoice.css';
import generatePDF from 'react-to-pdf';

const AddInvoice = () => {
  const pdfRef = useRef();

  const initialInvoice = {
    invoiceNumber: "",
    customerName: "",
    issueDate: "",
    dueDate: "",
    status: "UNPAID",
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
    lineItems: [
      { description: "", quantity: "", unitPrice: 0, lineTotal: 0 }
    ]
  };

  const [invoice, setInvoice] = useState(initialInvoice);

  useEffect(() => {
  const round2 = (num) => Math.round(num * 100) / 100;

  let updated = false;

  const newLineItems = invoice.lineItems.map(item => {
    const q = item.quantity === "" ? 0 : Number(item.quantity);
    const p = item.unitPrice === "" ? 0 : Number(item.unitPrice);

    const lineTotal = round2(q * p);

    if (lineTotal !== item.lineTotal) updated = true;

    return { 
      ...item, 
      quantity: q,
      unitPrice: p,
      lineTotal 
    };
  });

  const total = round2(
    newLineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  );

  let amountPaid = invoice.amountPaid === "" ? 0 : Number(invoice.amountPaid);

   
  if (amountPaid > total) {
    amountPaid = total;
    updated = true;
  }

  const balanceDue = round2(total - amountPaid);
  const status = total > 0 && balanceDue === 0 ? "PAID" : "UNPAID";

  if (
    updated ||
    invoice.total !== total ||
    invoice.balanceDue !== balanceDue ||
    invoice.amountPaid !== amountPaid ||
    invoice.status !== status
  ) {
    setInvoice(prev => ({
      ...prev,
      lineItems: newLineItems,
      total,
      amountPaid,
      balanceDue,
      status
    }));
  }
}, [invoice.lineItems, invoice.amountPaid]);

  const handlLineItemChange = (index, field, value) => {
  const newItems = [...invoice.lineItems];
  newItems[index][field] =
    field === "quantity" || field === "unitPrice"
      ? value === "" ? "" : Number(value)  // allow empty string
      : value;

  setInvoice({ ...invoice, lineItems: newItems });
};

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      lineItems: [
        ...invoice.lineItems,
        { description: "", quantity: 1, unitPrice: 0, lineTotal: 0 }
      ]
    });
  };

  const handlSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/invoices/", invoice);
      alert("Invoice added!");
      setInvoice(initialInvoice);
    } catch (err) {
      console.error(err);
      alert("Error adding invoice");
    }
  };
  const generateInvoiceNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);

  return `INV-${y}${m}${d}-${rand}`;
};

useEffect(() => {
  setInvoice(prev => ({
    ...prev,
    invoiceNumber: generateInvoiceNumber()
  }));
}, []);
  return (
     <div style={{ margin: "18px", background: "white" }}>
  <h3 style={{ marginTop: "18px", marginBottom: "8px" }}>New Invoice</h3>
  <div className="line-display"></div>

  <div className="invoice-layout">
    {/* LEFT FORM */}
    <div className="left-form">
      <form onSubmit={handlSubmit} className="invoice-card">

        {/* Header */}
        <div className="invoice-title-row">
          <h3>Invoice Detail</h3>
          <button type="submit" className="save-btn">Save Invoice</button>
        </div>

        <div className="line-display"></div>
        <br />

        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="field">
            <label>Invoice Number</label>
            <input
              className="header-input"
              placeholder="Enter invoice number"
              value={invoice.invoiceNumber}
              onChange={e => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Customer Name</label>
            <input
              className="header-input"
              placeholder="Enter customer name"
              value={invoice.customerName}
              onChange={e => setInvoice({ ...invoice, customerName: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Issue Date</label>
            <input
              className="header-input"
              type="date"
              value={invoice.issueDate}
              onChange={e => setInvoice({ ...invoice, issueDate: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label>Due Date</label>
            <input
              className="header-input"
              type="date"
              value={invoice.dueDate}
              onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Line Items */}
        <h3>Line Items</h3>

        <div className="line-items-wrapper">
          <table className="line-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      value={item.description}
                      onChange={e => handlLineItemChange(index, "description", e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min={0}
                      onChange={e => handlLineItemChange(index, "quantity", e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unitPrice}
                      min={0}
                      step="any"
                      onChange={e => handlLineItemChange(index, "unitPrice", e.target.value)}
                      required
                    />
                  </td>
                  <td>₹{Math.round((item.quantity * item.unitPrice) * 100) / 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" className="add-btn" onClick={addLineItem}>
          + Add Line Item
        </button>

        {/* Totals */}
        <div className="totals-card">
          <div>
            <label>Total</label>
            <input type="number" value={invoice.total} readOnly />
          </div>

          <div>
            <label>Amount Paid</label>
            <input
              type="number"
              value={invoice.amountPaid}
              min="0"
              placeholder="Enter amount paid"
              onChange={e => {
                const total = invoice.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
                let value = e.target.value;

                if (value === "") {
                  setInvoice({ ...invoice, amountPaid: "" });
                  return;
                }

                value = Number(value);
                if (value < 0) value = 0;
                if (value > total) value = total;

                setInvoice({ ...invoice, amountPaid: value });
              }}
            />
          </div>

          <div>
            <label>Balance Due</label>
            <input type="number" value={invoice.balanceDue} readOnly />
          </div>
        </div>
      </form>
    </div>

    {/* RIGHT PREVIEW */}
    <div className="right-preview">
      <div className="preview-card" ref={pdfRef}>
        <div className="invoice-title-row">
          <h3>Preview</h3>
          <button onClick={() => generatePDF(pdfRef, { filename: "invoice.pdf" })}>
            Download PDF
          </button>
        </div>

        <div className="linne-display"></div>
        <br />

        <div className="preview-header">
          <div>
            <p><b>Invoice Number:</b> {invoice.invoiceNumber || "—"}</p>
            <p><b>Customer:</b> {invoice.customerName || "—"}</p>
          </div>
          <span className={`badge ${invoice.status}`}>{invoice.status}</span>
        </div>

        <p><b>Issue:</b> {invoice.issueDate || "—"}</p>
        <p><b>Due:</b> {invoice.dueDate || "—"}</p>

        <div className="line-items-wrapper">
          <table className="preview-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.description || "—"}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice}</td>
                  <td>₹{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="preview-totals">
          <p>Total: ₹{invoice.total}</p>
          <p>Amount Paid: ₹{invoice.amountPaid}</p>
          <p><b>Balance Due:</b> ₹{invoice.balanceDue}</p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default AddInvoice;