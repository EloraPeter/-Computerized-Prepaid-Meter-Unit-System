const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../config/db');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT first_name, last_name, email, address FROM users WHERE id = $1', [req.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { first_name, last_name, address } = req.body;
  try {
    await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, address = $3 WHERE id = $4',
      [first_name, last_name, address, req.userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
