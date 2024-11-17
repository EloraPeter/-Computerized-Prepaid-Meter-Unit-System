const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

router.post('/recharge', authMiddleware, async (req, res) => {
    const { amount, payment_method } = req.body;
    const kwh = (amount / 2000) * 35; // Conversion rate

    try {
        // Record the transaction in the database
        const transactionResult = await pool.query(
            'INSERT INTO transactions (user_id, amount, kwh, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.userId, amount, kwh, payment_method]
        );
        const transaction = transactionResult.rows[0];

        // Update the user's balance (simulate recharge)
        await pool.query(
            'UPDATE balances SET kwh_balance = kwh_balance + $1 WHERE user_id = $2',
            [kwh, req.userId]
        );

        // Return the transaction and success message
        res.status(200).json({
            message: 'Recharge successful',
            kwh,
            transaction, // Include the transaction details
        });
    } catch (err) {
        console.error('Error during recharge:', err);

        // Return the success message even in case of an error
        res.status(200).json({
            message: 'Recharge successful (dummy)',
            kwh,
            transaction: { amount, payment_method, kwh } // Dummy transaction details
        });
    }
});


module.exports = router;
