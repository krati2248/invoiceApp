const express = require('express');
const cors = require('cors');
const app = express();

// Import router and DB connection
const router = require('./routes/invoiceRoutes');
const dbConnect = require('./database/dbConnect');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));            
app.use(express.json());      

// Connect to Database
dbConnect();

// router for invoices
app.use('/api/invoices', router);

// Start server
 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
