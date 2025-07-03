require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/laporan', require('./routes/laporan'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
