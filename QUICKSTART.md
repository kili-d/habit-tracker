# Quick Start Guide

Get your habit tracker running in 5 minutes!

## ✅ You Have PostgreSQL Installed
Version: PostgreSQL 14.19 (Homebrew)

## 🚀 Steps to Run

### 1. Create Database
```bash
psql postgres -c "CREATE DATABASE habit_tracker;"
```

### 2. Setup Backend
```bash
cd habit-tracker-db/backend
npm install
cp .env.example .env
```

### 3. Edit Configuration (Optional)
The default settings should work. If you have a custom PostgreSQL setup, edit `backend/.env`:
```bash
nano .env
```

Default credentials:
- User: `postgres`
- Password: `postgres` (or empty on macOS Homebrew install)
- Host: `localhost`
- Port: `5432`
- Database: `habit_tracker`

### 4. Initialize Database
```bash
npm run init-db
```

You should see:
```
✅ Connected to PostgreSQL database
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

Your habit tracker is now running with PostgreSQL backend!

All your data is stored in the database and will persist across server restarts.

## ⚠️ Troubleshooting

### Can't connect to database?

**If using Homebrew PostgreSQL, try:**
```bash
# Start PostgreSQL service
brew services start postgresql@14

# Or check if it's running
brew services list
```

**If you get "password authentication failed":**
Edit `backend/.env` and set:
```
DB_PASSWORD=
```
(empty password for Homebrew installations)

### Port 3000 already in use?

Change the port in `backend/.env`:
```
PORT=3001
```

## 🔄 Migrate Data from Old Version

If you have data in the localStorage version:

1. Open the old version (index.html) in your browser
2. Open Developer Console (F12)
3. Run this code:
```javascript
const data = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('ht-')) {
    data[key] = localStorage.getItem(key);
  }
}
console.log(JSON.stringify(data, null, 2));
```
4. Copy the output
5. Open the new version (http://localhost:3000)
6. Open Developer Console and run:
```javascript
const oldData = { /* paste your data here */ };
for (const [key, value] of Object.entries(oldData)) {
  await window.storage.set(key, value);
}
location.reload();
```

## 📚 More Information

See `README.md` for:
- VPS deployment instructions
- Docker deployment
- Security considerations
- Full API documentation
