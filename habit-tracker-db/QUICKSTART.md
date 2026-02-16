# Quick Start Guide

Get your habit tracker running in 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- MariaDB or MySQL installed locally

## 🚀 Steps to Run

### 1. Create Database
```bash
mysql -u root -p -e "CREATE DATABASE habit_tracker;"
```

### 2. Setup Backend
```bash
cd habit-tracker-db/backend
npm install
cp .env.example .env
```

### 3. Edit Configuration
Edit `backend/.env` with your MariaDB credentials:
```bash
nano .env
```

Configuration:
```env
DB_USER=root
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=your_password
DB_PORT=3306
PORT=3000
NODE_ENV=development
```

### 4. Initialize Database
```bash
npm run init-db
```

You should see:
```
✅ Connected to MariaDB database
✅ Database schema initialized successfully
✅ Database initialization complete!
```

### 5. Start Server
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 API endpoints available at http://localhost:3000/api
🏥 Health check: http://localhost:3000/api/health
```

### 6. Open App
Open your browser to: **http://localhost:3000**

## 🎉 That's It!

Your habit tracker is now running with MariaDB backend!

All your data is stored in the database and will persist across server restarts.

## ⚠️ Troubleshooting

### Can't connect to database?

**Check if MariaDB is running:**
```bash
# On macOS with Homebrew
brew services start mariadb

# On Linux
sudo systemctl start mariadb
```

**If you get "access denied":**
- Make sure your `.env` file has the correct password
- Try connecting manually: `mysql -u root -p`

### Port 3000 already in use?

Change the port in `backend/.env`:
```
PORT=3001
```

### Tables not being created?

Make sure you ran `npm run init-db` and saw the success messages.

To verify tables exist:
```bash
mysql -u root -p habit_tracker -e "SHOW TABLES;"
```

You should see:
```
+-------------------------+
| Tables_in_habit_tracker |
+-------------------------+
| habit_data              |
| users                   |
+-------------------------+
```

## 📚 More Information

See documentation for:
- **[PLESK-DEPLOYMENT.md]** - Deploy to Plesk hosting
- **[DEPLOYMENT.md]** - Manual VPS setup
- **[README.md]** - Full technical documentation
