const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const rechargeRoutes = require('./routes/recharge');
const transactionRoutes = require('./routes/transaction');
const profileRoutes = require('./routes/profile');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/recharge', rechargeRoutes);
app.use('/transactions', transactionRoutes);
app.use('/profile', profileRoutes);

module.exports = app;
