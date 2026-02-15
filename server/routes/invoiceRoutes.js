const express = require('express');
const router = express.Router(); 
const InvoiceController = require('../controllers/InvoiceController');

router.post("/", InvoiceController.createInvoice);
router.get("/invoicelist", InvoiceController.getInvoiceList); 
router.get("/:id", InvoiceController.getInvoice);
router.post("/payment/:id", InvoiceController.addPayment);
router.post("/archive/:id", InvoiceController.archiveInvoice);
router.post("/restore/:id", InvoiceController.restoreInvoice);


module.exports = router;