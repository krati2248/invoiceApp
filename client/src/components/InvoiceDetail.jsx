import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./InvoiceDetail.css";
import generatePDF from 'react-to-pdf';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [lines, setLines] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [payment, setPayment] = useState({
    amount: "",
    paymentDate: "",
  });
  const pdfRef = useRef();


  useEffect(() => {
    axios.get(`http://localhost:3000/api/invoices/${id}`)
      .then(res => {
        console.log(res.data);
        setLines(res.data.invoiceLine);
        setInvoice(res.data.invoice)
      })
      .catch(err => console.log(err));
  }, [id]);
  const handlePaymentChange = (field, value) => {
    setPayment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSubmit = async () => {
    try {
      console.log(payment);
      await axios.post(`http://localhost:3000/api/invoices/payment/${id}`, payment);

      alert("Payment added successfully");

      // reset form
      setPayment({
        amount: "",
        paymentDate: ""
      });

      setShowModal(false);

      // optionally refetch invoice details here

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };
  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="invoice-detail-page">
      <div className="invoice-card" ref={pdfRef}>

        <div className="invoice-header">
          <h2>Invoice Number: {invoice.invoiceNumber}</h2>
          <span className={`status ${invoice.status.toLowerCase()}`}>
            {invoice.status}
          </span>
        </div>
        <br />
        <div className="invoice-meta">

          <p><b>Customer:</b> {invoice.customerName}</p>

          <p><b>Issue Date:</b> {new Date(invoice.issueDate).toLocaleDateString()}</p>

          <p><b>Due Date:</b> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          <br />
        </div>
        <br />
        <h3>Line items</h3>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₹{item.unitPrice}</td>
                <td>₹{item.lineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-summary">
          <p><b>Total:</b> ₹{invoice.total}</p>
          <p><b>Amount Paid:</b> ₹{invoice.amountPaid}</p>
          <p><b>Balance Due:</b> ₹{invoice.balanceDue}</p>
        </div>

        <button className="pay-btn" onClick={() => setShowModal(true)}>
          Add Payment
        </button>
        <button className="pay-btn" onClick={() => generatePDF(pdfRef, { filename: `invoice-${invoice.invoiceNumber}.pdf` })}>
          Download pdf
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Payment</h3>

            <label>Amount</label>
            <input
              type="number"
              value={payment.amount}
              min="0"
              placeholder="Enter amount"
              onChange={e => {
                const val = e.target.value;
                setPayment(prev => ({
                  ...prev,
                  amount: val === "" ? "" : Number(val)
                }));
              }}
            />


            <label>Payment Date</label>
            <input
              type="date"
              value={payment.paymentDate}
              onChange={e => handlePaymentChange("paymentDate", e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handlePaymentSubmit}>Submit</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetail;
