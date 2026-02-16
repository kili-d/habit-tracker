const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL/MariaDB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'habit_tracker',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MariaDB database');
    connection.release();
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(-1);
  }
}

testConnection();

// Initialize database schema
async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Create users table (for future multi-user support)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create habit_data table (key-value store for flexible data)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS habit_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT 1,
        data_key VARCHAR(255) NOT NULL,
        data_value JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_key (user_id, data_key),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_habit_data_user_key (user_id, data_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insert default user if doesn't exist
    await connection.query(`
      INSERT IGNORE INTO users (id, email)
      VALUES (1, 'default@local')
    `);

    await connection.commit();
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Get data by key
async function getData(key, userId = 1) {
  try {
    const [rows] = await pool.query(
      'SELECT data_value FROM habit_data WHERE user_id = ? AND data_key = ?',
      [userId, key]
    );

    if (rows.length === 0) return null;

    const value = rows[0].data_value;
    // mysql2 may return JSON columns as strings or parsed objects depending on version/config
    // Ensure we always return a parsed object
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (error) {
    console.error(`Error getting data for key "${key}":`, error.message);
    throw error;
  }
}

// Set data by key
async function setData(key, value, userId = 1) {
  try {
    // Explicitly stringify for MySQL JSON column compatibility
    // mysql2 may not auto-stringify objects in all cases
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);

    await pool.query(
      `INSERT INTO habit_data (user_id, data_key, data_value, updated_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE data_value = ?, updated_at = NOW()`,
      [userId, key, jsonValue, jsonValue]
    );
    return { success: true };
  } catch (error) {
    console.error(`Error setting data for key "${key}":`, error.message);
    console.error('Value type:', typeof value);
    console.error('Value:', JSON.stringify(value).substring(0, 200));
    throw error;
  }
}

// Get all data for a user
async function getAllData(userId = 1) {
  try {
    const [rows] = await pool.query(
      'SELECT data_key, data_value FROM habit_data WHERE user_id = ?',
      [userId]
    );
    const data = {};
    rows.forEach(row => {
      const value = row.data_value;
      // Ensure consistent object return (handle both string and object from mysql2)
      data[row.data_key] = typeof value === 'string' ? JSON.parse(value) : value;
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
      'DELETE FROM habit_data WHERE user_id = ? AND data_key = ?',
      [userId, key]
    );
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
}

// Close pool
async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  initializeDatabase,
  getData,
  setData,
  getAllData,
  deleteData,
  closePool
};
