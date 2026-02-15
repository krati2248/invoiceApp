import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './InvoiceList.css';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    const navigate = useNavigate();
    const fetchInvoices = async () => {
        const res = await axios.get(
            `http://localhost:3000/api/invoices/invoicelist?archived=${showArchived}`
        );
        setInvoices(res.data.invoice);
    };

    useEffect(() => {
        fetchInvoices();
    }, [showArchived]);

    const archiveInvoice = async (id) => {
        await axios.post(`http://localhost:3000/api/invoices/archive/${id}`, showArchived);
        fetchInvoices();
    };

    const restoreInvoice = async (id) => {
        await axios.post(`http://localhost:3000/api/invoices/restore/${id}`, showArchived);
        fetchInvoices();
    };

    return (
        <div className="invoice-list-container">
            <h2 className="page-title">Invoice List</h2>
            <div className="line-display"></div>
            <br/>
            <button className="restore-btn" style={{ "marginRight": "8px" }} onClick={() => setShowArchived(false)}>Active Invoice List</button>
            <button className="archive-btn" onClick={() => setShowArchived(true)}>Archived Invoice List</button>
            <br />
            <br />
            <div className="table-card">
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Invoice Number</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Amount Paid</th>
                            <th>Balance Due</th>
                            <th>Invoice Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv._id}>
                                <td>{inv.invoiceNumber}</td>
                                <td>{inv.customerName}</td>
                                <td>
                                    <span className={`status-badge ${inv.status.toLowerCase()}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td>₹{inv.total}</td>
                                <td>₹{inv.amountPaid}</td>
                                <td>₹{inv.balanceDue}</td>
                                <td style={{ display: "flex", gap: "6px" }}>

                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/invoice/${inv._id}`)}
                                    >
                                        View
                                    </button>
                                    {!showArchived ? (
                                        <button onClick={() => archiveInvoice(inv._id)} className="archive-btn">
                                            Archive
                                        </button>
                                    ) : (
                                        <button onClick={() => restoreInvoice(inv._id)} className="restore-btn">
                                            Restore
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvoiceList;