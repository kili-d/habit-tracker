const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const {
  initializeDatabase,
  getData,
  setData,
  getAllData,
  deleteData
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get data by key
app.get('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await getData(key);

    if (value === null) {
      return res.status(404).json({ error: 'Key not found' });
    }

    res.json({ value });
  } catch (error) {
    console.error(`[ERROR] GET /api/data/${req.params.key}:`, error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Set data by key
app.post('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    await setData(key, value);
    res.json({ success: true, key });
  } catch (error) {
    console.error(`[ERROR] POST /api/data/${req.params.key}:`, error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Get all data
app.get('/api/data', async (req, res) => {
  try {
    const data = await getAllData();
    res.json(data);
  } catch (error) {
    console.error('Error getting all data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete data by key
app.delete('/api/data/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await deleteData(key);
    res.json({ success: true, key });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
