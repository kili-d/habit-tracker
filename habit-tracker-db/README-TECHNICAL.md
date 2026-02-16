# Daily Practice Habit Tracker (PostgreSQL Version)

Full-stack habit tracker with PostgreSQL database backend, ready for VPS deployment.

## 📁 Project Structure

```
habit-tracker-db/
├── backend/
│   ├── server.js           # Express API server
│   ├── database.js         # PostgreSQL connection & queries
│   ├── init-db.js          # Database initialization script
│   ├── package.json        # Node.js dependencies
│   └── .env               # Environment variables (create from .env.example)
├── frontend/
│   └── index.html         # React app (served by backend)
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher)

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or download from:** https://www.postgresql.org/download/

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE habit_tracker;

# Exit psql
\q
```

### Step 3: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# nano .env  (or use any text editor)
```

**Update `.env` with your PostgreSQL credentials:**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=your_password_here
DB_PORT=5432
PORT=3000
```

### Step 4: Initialize Database

```bash
# Run database initialization
npm run init-db
```

### Step 5: Start Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### Step 6: Access Application

Open your browser to: **http://localhost:3000**

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/data/:key` | Get data by key |
| POST | `/api/data/:key` | Save data by key |
| GET | `/api/data` | Get all data |
| DELETE | `/api/data/:key` | Delete data by key |

## 🌐 VPS Deployment

### Option 1: Traditional VPS (DigitalOcean, Linode, etc.)

1. **Set up PostgreSQL on VPS:**
```bash
# SSH into your VPS
ssh user@your-vps-ip

# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE habit_tracker;
CREATE USER habituser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE habit_tracker TO habituser;
\q
```

2. **Clone your code to VPS:**
```bash
git clone your-repo-url
cd habit-tracker-db/backend
npm install --production
```

3. **Configure environment:**
```bash
# Create .env file with production settings
cat > .env << EOF
DB_USER=habituser
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=secure_password
DB_PORT=5432
PORT=3000
NODE_ENV=production
EOF
```

4. **Initialize database:**
```bash
npm run init-db
```

5. **Run with PM2 (process manager):**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name habit-tracker

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

6. **Configure Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable HTTPS with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

**Create `Dockerfile` in backend directory:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Create `docker-compose.yml` in root:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: habit_tracker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_USER: postgres
      DB_HOST: postgres
      DB_NAME: habit_tracker
      DB_PASSWORD: postgres
      DB_PORT: 5432
    depends_on:
      - postgres

volumes:
  pgdata:
```

**Deploy:**
```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | postgres |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_NAME` | Database name | habit_tracker |
| `DB_PASSWORD` | Database password | postgres |
| `DB_PORT` | PostgreSQL port | 5432 |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |

## 🗄️ Database Schema

### Tables

**users**
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `created_at` (TIMESTAMP)

**habit_data**
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER, FK to users)
- `data_key` (VARCHAR) - e.g., "ht-habits", "ht-logs"
- `data_value` (JSONB) - stored as JSON
- `updated_at` (TIMESTAMP)
- Unique constraint on (user_id, data_key)

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use environment variables** for sensitive data
3. **Enable SSL** for PostgreSQL connections in production
4. **Add authentication** for multi-user support
5. **Use HTTPS** with valid SSL certificates
6. **Configure CORS** appropriately for your domain

## 🐛 Troubleshooting

### PostgreSQL connection fails
```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Check connection
psql -U postgres -h localhost -d habit_tracker
```

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database initialization fails
```bash
# Drop and recreate database
psql postgres
DROP DATABASE habit_tracker;
CREATE DATABASE habit_tracker;
\q

# Run init again
npm run init-db
```

## 📊 Data Migration

### Export data from localStorage version
Open browser console on the old version:
```javascript
// Copy this to export all localStorage data
const data = {};
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('ht-')) {
    data[key] = localStorage.getItem(key);
  }
}
console.log(JSON.stringify(data, null, 2));
```

### Import to PostgreSQL version
Save the JSON and run:
```javascript
// In browser console on new version
const oldData = { /* paste exported data here */ };

for (const [key, value] of Object.entries(oldData)) {
  await window.storage.set(key, value);
}
console.log('Migration complete!');
```

## 📝 License

MIT
