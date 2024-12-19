const { Pool } = require('pg');
const config = require('../config/config'); // Load configuration

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: config.postgresUrl, // Load connection string from config
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', err => {
  console.error('PostgreSQL connection error:', err.message);
});

module.exports = pool;
