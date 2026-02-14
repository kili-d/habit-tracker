const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'habit_tracker',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Initialize database schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table (for future multi-user support)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create habit_data table (key-value store for flexible data)
    await client.query(`
      CREATE TABLE IF NOT EXISTS habit_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER DEFAULT 1 REFERENCES users(id),
        data_key VARCHAR(255) NOT NULL,
        data_value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, data_key)
      )
    `);

    // Create index for faster lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_habit_data_user_key
      ON habit_data(user_id, data_key)
    `);

    // Insert default user if doesn't exist
    await client.query(`
      INSERT INTO users (id, email)
      VALUES (1, 'default@local')
      ON CONFLICT (id) DO NOTHING
    `);

    await client.query('COMMIT');
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Get data by key
async function getData(key, userId = 1) {
  try {
    const result = await pool.query(
      'SELECT data_value FROM habit_data WHERE user_id = $1 AND data_key = $2',
      [userId, key]
    );
    return result.rows[0] ? result.rows[0].data_value : null;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}

// Set data by key
async function setData(key, value, userId = 1) {
  try {
    const result = await pool.query(
      `INSERT INTO habit_data (user_id, data_key, data_value, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, data_key)
       DO UPDATE SET data_value = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, key, JSON.stringify(value)]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error setting data:', error);
    throw error;
  }
}

// Get all data for a user
async function getAllData(userId = 1) {
  try {
    const result = await pool.query(
      'SELECT data_key, data_value FROM habit_data WHERE user_id = $1',
      [userId]
    );
    const data = {};
    result.rows.forEach(row => {
      data[row.data_key] = row.data_value;
    });
    return data;
  } catch (error) {
    console.error('Error getting all data:', error);
    throw error;
  }
}

// Delete data by key
async function deleteData(key, userId = 1) {
  try {
    await pool.query(
      'DELETE FROM habit_data WHERE user_id = $1 AND data_key = $2',
      [userId, key]
    );
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  getData,
  setData,
  getAllData,
  deleteData
};
