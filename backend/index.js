const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const app = express();
const { verifyAadhar } = require('./verify-aadhar.js')

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body

// Route to generate QR code with UPI ID and amount
app.post('/generate-qr', async (req, res) => {
  const { upiId, amount } = req.body; // Extract upiId and amount from request body
  try {
    // Ensure that upiId and amount are provided
    if (!upiId || !amount) {
      return res.status(400).json({ error: 'UPI ID and amount are required' });
    }

    // Format the UPI data with the amount
    const qrData = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;

    // Generate the QR code
    const qrCodeURL = await QRCode.toDataURL(qrData);

    // Send the QR code as JSON response
    res.json({ qrCodeURL });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Error generating QR code' });
  }
});

app.post('/verify-aadhar', async (req, res) => {
  const { aadharNumber } = req.body;

  try{
    if(aadharNumber){
      const isValid = verifyAadhar(aadharNumber)

      res.json({ isValid });
    }
  }catch(err){
    console.log("Error verifying aadhar number", err)
    res.status(500).json({ error: "Error verifying aadhar number"})
  }
}) 



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
