const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cpmus',
  password: '032005',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
