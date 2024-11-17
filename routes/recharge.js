const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

router.post('/recharge', authMiddleware, async (req, res) => {
    const { amount, payment_method } = req.body;

    if (!amount || !payment_method) {
        return res.status(400).json({ message: 'Amount and payment method are required.' });
    }
    
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number greater than 0.' });
    }
    
    if (!allowedPaymentMethods.includes(payment_method)) {
        return res.status(400).json({ message: `Invalid payment method. Allowed methods are: ${allowedPaymentMethods.join(', ')}` });
    }
    

    const kwh = (amount / 2000) * 35;

    const client = await pool.connect();
    try {
        console.log('Starting transaction');
        await client.query('BEGIN');

        console.log('Inserting transaction...');
        await client.query(
            'INSERT INTO transactions (user_id, amount, kwh, payment_method) VALUES ($1, $2, $3, $4)',
            [req.userId, amount, kwh, payment_method]
        );

        console.log('Updating balance...');
        await client.query(
            'UPDATE balances SET kwh_balance = kwh_balance + $1 WHERE user_id = $2',
            [kwh, req.userId]
        );

        console.log('Committing transaction...');
        await client.query('COMMIT');

        console.log('Recharge successful');
        res.status(200).json({ message: 'Recharge successful', kwh });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error processing recharge:", err.message);
        res.status(500).json({
            message: 'An error occurred while processing recharge',
            error: err.message,
        });
    } finally {
        client.release();
    }
});

module.exports = router;





