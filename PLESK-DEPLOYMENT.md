# Plesk Deployment Guide

Complete guide to deploy Daily Practice Habit Tracker on Plesk with MariaDB.

## 📋 Prerequisites

- Plesk Obsidian 18.0+ (or Onyx 17.8+)
- Node.js extension installed in Plesk
- MariaDB/MySQL (usually pre-installed)
- Domain name pointed to your server

## 🚀 Quick Overview

**Deployment time:** 15-20 minutes

**Database:** MariaDB/MySQL

**Steps:**
1. Create MariaDB database
2. Create domain/subdomain
3. Setup Node.js application
4. Clone repository
5. Configure environment variables
6. Install dependencies & initialize database
7. Configure reverse proxy
8. Enable SSL
9. Start application

---

## 📖 Detailed Steps

### Step 1: Install Node.js Extension (If Not Installed)

1. Log into **Plesk** as administrator
2. Go to **Extensions** (in left sidebar)
3. Search for **"Node.js"**
4. Click **Get It Free** or **Install**
5. Wait for installation to complete

### Step 2: Create MariaDB Database

MariaDB is usually available as "MySQL" in Plesk.

1. Go to **Databases** → **Add Database**

2. Fill in database details:
   ```
   Database name: habit_tracker
   Database type: MySQL
   Related site: (select your domain)
   ```

3. Click **OK**

4. **Create Database User:**
   - The database creation wizard will prompt you
   - Or click on the database → **Users** tab → **Add Database User**
   ```
   Username: habituser
   Password: [Create a strong password]
   ```
   - Grant **ALL PRIVILEGES**
   - Click **OK**

5. **Note down your credentials:**
   ```
   Database: habit_tracker
   Username: habituser (or root)
   Password: [your password]
   Host: localhost
   Port: 3306
   Database Type: MySQL/MariaDB
   ```

### Step 3: Create Domain or Subdomain

**Option A: New Subdomain (Recommended)**

1. Go to **Domains** → Select your main domain
2. Click **Subdomains** → **Add Subdomain**
3. Enter subdomain name:
   ```
   Subdomain: habits
   (Creates: habits.yourdomain.com)
   ```
4. Click **OK**

**Option B: Use Existing Domain**

Skip this step if using an existing domain.

### Step 4: Setup Node.js Application

1. Go to **Websites & Domains** → Select your domain/subdomain

2. Click **Node.js** (in the sidebar under "Advanced")

3. Click **Enable Node.js**

4. Configure Node.js:
   ```
   Node.js version: 18.x or higher
   Application mode: production
   Application root: /httpdocs
   Application URL: /
   Application startup file: backend/server.js
   ```

5. Click **Enable** (don't start yet)

### Step 5: Clone Repository

**Option A: Using Git in Plesk (Recommended)**

1. Click **Git** (in the sidebar)
2. Click **Add Repository**
3. Fill in:
   ```
   Repository URL: https://github.com/kili-d/habit-tracker.git
   Repository name: habit-tracker
   Deployment path: /httpdocs
   ```
4. Click **OK**
5. Click **Deploy** to pull the code

**Option B: Using SSH**

```bash
ssh your-username@your-domain.com
cd /var/www/vhosts/your-domain.com/httpdocs
git clone https://github.com/kili-d/habit-tracker.git .
```

### Step 6: Configure Environment Variables

1. In **File Manager**, navigate to `/httpdocs/backend`

2. Edit the `.env` file:

   ```env
   # MariaDB Configuration
   DB_USER=habituser
   DB_HOST=localhost
   DB_NAME=habit_tracker
   DB_PASSWORD=your_database_password_here
   DB_PORT=3306

   # Server Configuration
   PORT=3000
   NODE_ENV=production
   ```

3. **Important:** Make sure `DB_PORT=3306` (MariaDB port, not 5432)

4. **Save** and set permissions to `600`

### Step 7: Install Dependencies

**Using Plesk SSH Terminal or your SSH client:**

```bash
cd /var/www/vhosts/your-domain.com/httpdocs/backend

# Install MariaDB dependencies
npm install
```

This will install `mysql2` package instead of `pg` (PostgreSQL).

**Alternative - Using Scheduled Task:**

1. Go to **Scheduled Tasks** → **Add Task**
2. Command:
   ```bash
   cd /var/www/vhosts/your-domain.com/httpdocs/backend && npm install
   ```
3. Run: **Once, Now**

### Step 8: Initialize Database

```bash
cd /var/www/vhosts/your-domain.com/httpdocs/backend
npm run init-db
```

You should see:
```
✅ Connected to MariaDB database
✅ Database schema initialized successfully
✅ Database initialization complete!
```

**If you get errors:**
- Check database credentials in `.env`
- Verify database exists: `mysql -u habituser -p habit_tracker`
- Check MariaDB is running: Plesk → **Services**

### Step 9: Configure Reverse Proxy (Critical)

This is the most important step. By default, Plesk routes all traffic through Apache. Your Node.js backend runs on port 3000, but Nginx doesn't know about it. Without this configuration, your frontend will load but all API calls will return 500 errors.

1. Go to **Apache & nginx Settings** for your domain

2. In **Additional nginx directives**, add:
```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:3000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
```

3. Click **OK**

**What this does:** Nginx serves the static frontend files directly (fast), but forwards any `/api/` requests to the Node.js backend on port 3000. Without this, the browser receives 500 errors on every API call because Apache has no knowledge of the Node.js process.

**How to verify:**
```bash
curl -s https://your-domain.com/api/health
```
You should see: `{"status":"ok","timestamp":"..."}`

### Step 10: Start Application

1. Go to **Node.js** settings for your domain
2. Click **Restart App** or **Enable Node.js**
3. Status should show **Running**

### Step 11: Enable SSL Certificate

1. Go to **SSL/TLS Certificates**

2. **Let's Encrypt (Free):**
   - Click **Install** under "Let's Encrypt"
   - Enter email address
   - Check "Secure the domain and www subdomain"
   - Click **Get It Free**

3. **Force HTTPS:**
   - Go to **Hosting Settings**
   - Check **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
   - Click **OK**

### Step 12: Test Your Application

Visit: `https://habits.yourdomain.com`

You should see the Daily Practice Habit Tracker! 🎉

---

---

## 🛠️ Managing Your Application

### View Application Status

1. **Node.js** → View status (Running/Stopped)
2. Check **Log Files** tab for errors

### Restart Application

1. **Node.js** → **Restart App**

### View Logs

1. **Node.js** → **Log Files**
2. View `stderr.log` and `stdout.log`

### Database Management

**Using Plesk phpMyAdmin:**

1. Go to **Databases** → Click your database
2. Click **phpMyAdmin** button
3. View tables, run queries, export data

**Using Command Line:**

```bash
# Connect to database
mysql -u habituser -p habit_tracker

# Show tables
SHOW TABLES;

# View data
SELECT * FROM users;
SELECT * FROM habit_data;

# Backup database
mysqldump -u habituser -p habit_tracker > backup.sql

# Restore database
mysql -u habituser -p habit_tracker < backup.sql
```

---

## 🔄 Updating Your Application

### Pull Updates from GitHub

1. **Git** in Plesk → **Pull Updates**
2. **Node.js** → **Restart App**

### Using SSH

```bash
cd /var/www/vhosts/your-domain.com/httpdocs
git pull origin main
cd backend && npm install
# Restart via Plesk Node.js panel
```

---

## 🐛 Troubleshooting

### Common Deployment Issues (Lessons Learned)

The following issues were encountered during real-world deployment and are documented here to save time.

#### 1. API returns 500 errors but frontend loads fine

**Symptom:** The app UI loads correctly, but checking habits doesn't persist. Browser console shows `HTTP error! status: 500` on all `/api/` calls.

**Cause:** Plesk's Nginx proxies all traffic to Apache (typically port 7081 or 8880), which serves static files but has no knowledge of the Node.js backend on port 3000.

**Fix:** Add the `/api/` proxy directive in Plesk → Apache & nginx Settings → Additional nginx directives (see Step 9).

**How to diagnose:**
```bash
# If this works, the backend is fine — the problem is Nginx routing
curl -s http://localhost:3000/api/health

# If this returns 500, Nginx isn't forwarding to Node.js
curl -s https://your-domain.com/api/health
```

#### 2. Cannot find module 'node:buffer' or similar node: errors

**Symptom:** Node.js crashes on startup with errors about missing `node:buffer`, `node:events`, or other `node:` prefixed modules.

**Cause:** The server is running Node.js v12 or v14. The `mysql2` package requires Node.js 16+.

**Fix:**
```bash
node -v

# Upgrade to Node.js 18 or higher
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# If you get package conflicts with libnode-dev:
apt-get remove -y libnode-dev
apt-get install -y nodejs
```

After upgrading, reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

#### 3. Cannot find module 'express'

**Symptom:** Node.js crashes with MODULE_NOT_FOUND for express, mysql2, or other packages.

**Cause:** Dependencies were not installed after cloning or pulling updates.

**Fix:**
```bash
cd backend && npm install
```

#### 4. Access denied for user 'root'@'localhost'

**Symptom:** Node.js starts but crashes with a database access denied error.

**Cause:** The `.env` file has incorrect credentials (e.g., default `root` with no password).

**Fix:** Update `.env` with the correct database user and password.

#### 5. Node.js process dies when SSH session closes

**Symptom:** App works while connected via SSH, stops when you disconnect.

**Cause:** Running `node server.js` directly ties the process to your terminal session.

**Fix:** Use PM2:
```bash
npm install -g pm2
pm2 start server.js --name habit-tracker
pm2 save
pm2 startup
```

#### 6. Data doesn't persist across browsers

**Symptom:** Habits checked in one browser don't appear in another. Database table is empty.

**Diagnosis checklist:**
```bash
# 1. Is the Node.js process running?
ps aux | grep node

# 2. Is the API reachable externally?
curl -s https://your-domain.com/api/health

# 3. Can the API write to the database?
curl -s -X POST http://localhost:3000/api/data/test \
  -H "Content-Type: application/json" \
  -d '{"value":{"test":true}}'

# 4. Is data in the database?
mysql -u habituser -p habit_tracker -e "SELECT * FROM habit_data;"
```

If step 2 fails but step 3 works → Nginx proxy issue (see #1 above).

### Common Mistakes:

- ❌ Missing Nginx `/api/` proxy directive (most common cause of 500 errors)
- ❌ Node.js version too old (need 18+)
- ❌ Wrong port in `.env` (should be 3306)
- ❌ Missing `npm install` after git pull
- ❌ Database user lacks privileges
- ❌ Forgot to run `npm run init-db`
- ❌ Running `node server.js` directly instead of using PM2