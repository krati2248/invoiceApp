const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const InvoiceLine = require('../models/InvoiceLine');

class InvoiceController
{
  static createInvoice = async (requ, resp) =>
  {
    try {
      console.log("hello");
    const {
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,lineItems,total,amountPaid,balanceDue,status
    } = requ.body;
    if (amountPaid > total) {
  return resp.status(400).json({ message: "Overpayment not allowed" });
}
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
      status,
      total,
      amountPaid,
      balanceDue,
      isArchived: false
    });
     const invoiceLines = await InvoiceLine.insertMany(
      lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        invoiceId: invoice.id    
      }))
    );
    return resp.status(201).json({
      message: "Invoice created successfully",
      invoice,
      lineItems: invoiceLines
    });
    } catch (error) {
      console.log(error);
    return resp.status(500).json({ message: error.message });
  }
  }
    static getInvoiceList = async (requ,resp) =>
    {
         try { 
    const invoice = await Invoice.find();
    if (!invoice) {
      return resp.status(404).json({ message: "Invoice not found" });
    }
 
    resp.json({
      invoice
    });

  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
  }
  static getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    const invoiceLine = await InvoiceLine.find({ invoiceId: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ invoice, invoiceLine });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
    static addPayment = async (requ, resp) =>
    {
      try {
        console.log("Hello");
        const { id } = requ.params;
        console.log(id);
    const { amount, paymentDate } = requ.body;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return resp.status(404).json({ message: "Invoice not found" });
    }
   if (invoice.amountPaid + amount > invoice.total) {
      return resp.status(400).json({ message: "Overpayment not allowed" });
    }

    // Save payment
    const payment = await Payment.create({
      invoiceId: id,
      amount,
      paymentDate,
      
    });

    // Update invoice
    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;
    invoice.status = invoice.balanceDue === 0 ? "PAID" : "DRAFT";
    await invoice.save();

    resp.json({ message: "Payment added", payment, invoice });

      } catch (error) {
        console.log(error);
    resp.status(500).json({ message: error.message });
  }
    }
    static archiveInvoice= async (requ, resp) =>
    {
       
         try {
    await Invoice.findByIdAndUpdate(requ.params.id, { isArchived: true });
    resp.json({ message: "Invoice archived successfully" });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
  }
  
    static restoreInvoice = async (requ, resp) =>
    {
        try {
     await Invoice.findByIdAndUpdate(requ.params.id, { isArchived: false });
    resp.json({ message: "Invoice restored successfully" });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
  }
  static  getInvoiceList = async (req, res) => {
  try {
     
    const { archived } = req.query;

    
    const filter = archived === "true" ? { isArchived: true } : { isArchived: false };

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });

    res.json({ invoice: invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  static addInvoiceLine = async (requ, resp) => {
  try {
    const { id } = requ.params;
    const { description, quantity, unitPrice } = requ.body;

    if (!description || quantity <= 0 || unitPrice <= 0) {
      return resp.status(400).json({
        message: "Invalid line item data"
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return resp.status(404).json({ message: "Invoice not found" });
    }

    const lineTotal = quantity * unitPrice;

    const lineItem = await InvoiceLine.create({
      invoiceId: id,
      description,
      quantity,
      unitPrice,
      lineTotal
    });

    // Update invoice totals
    invoice.total += lineTotal;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    await invoice.save();

    return resp.status(201).json({
      message: "Invoice line added",
      lineItem,
      updatedInvoice: invoice
    });

  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
};
}
module.exports = InvoiceController;