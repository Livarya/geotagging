require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const path = require('path');
const superadminRoutes = require('./routes/superadmin');
const { initWhatsApp } = require('./config/whatsapp');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inisialisasi WhatsApp client
console.log('Menginisialisasi WhatsApp client untuk notifikasi...');
initWhatsApp();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/superadmin', superadminRoutes);
app.use('/api/admin', require('./routes/admin'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Tambahkan error handler global
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR HANDLER:', err.stack || err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});
