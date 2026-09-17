const { Pool } = require('pg');
const dotenv = require('dotenv');
const { logger } = require('../utils/logger/logger');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const isCloudOrSsl = connectionString && (
  connectionString.includes('sslmode=') ||
  connectionString.includes('neon.tech') ||
  connectionString.includes('supabase') ||
  process.env.NODE_ENV === 'production'
);

const pool = new Pool({
  connectionString: connectionString,
  ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  logger('PostgreSQL Pool connected successfully', 'Database', 'info');
});

pool.on('error', (err) => {
  logger(err, 'Unexpected error on idle PostgreSQL client', 'error');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
