const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT kwh_balance FROM balances WHERE user_id = $1', [req.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Balance not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching balance', error: err.message });
    }
});

module.exports = router;
