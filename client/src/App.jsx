import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/AddInvoice';
import InvoiceList from './components/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail';
import Navbar from './components/Navbar';

function App()
{ 
  return (
    <Router> 
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="/invoicelist" element={<InvoiceList />} />
        <Route path="/invoice/:id" element={<InvoiceDetail/>}/>
      </Routes>
    </Router>
  )
}

export default App
