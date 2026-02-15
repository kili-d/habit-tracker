# Plesk Deployment Guide (MariaDB)

Complete guide to deploy Daily Practice Habit Tracker on Plesk using MariaDB.

## 📋 Prerequisites

- Plesk Obsidian 18.0+ (or Onyx 17.8+)
- Node.js extension installed in Plesk
- MariaDB/MySQL (usually pre-installed)
- Domain name pointed to your server

## 🚀 Quick Overview

**Deployment time:** 15-20 minutes

**Database:** MariaDB/MySQL (instead of PostgreSQL)

**Steps:**
1. Create MariaDB database
2. Create domain/subdomain
3. Setup Node.js application
4. Clone repository & configure for MariaDB
5. Install dependencies & initialize database
6. Enable SSL
7. Start application

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

### Step 6: Configure for MariaDB

This is the **KEY STEP** - we need to switch from PostgreSQL to MariaDB.

**Option A: Using SSH (Easiest)**

```bash
# SSH into your server
ssh your-username@your-domain.com

# Navigate to backend directory
cd /var/www/vhosts/your-domain.com/httpdocs/backend

# Run MariaDB setup script
chmod +x setup-mariadb.sh
./setup-mariadb.sh
```

The script will:
- ✅ Switch to MariaDB configuration files
- ✅ Backup PostgreSQL versions
- ✅ Create .env template for MariaDB

**Option B: Using Plesk File Manager**

1. Go to **File Manager**
2. Navigate to `/httpdocs/backend`

3. **Replace package.json:**
   - Rename `package.json` to `package-postgresql.json` (backup)
   - Rename `package-mariadb.json` to `package.json`

4. **Replace database.js:**
   - Rename `database.js` to `database-postgresql.js` (backup)
   - Rename `database-mariadb.js` to `database.js`

5. **Create .env file from MariaDB template:**
   - Copy `.env-mariadb.example` to `.env`

### Step 7: Configure Environment Variables

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

### Step 8: Install Dependencies

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

### Step 9: Initialize Database

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

### Step 10: Configure Reverse Proxy

1. Go to **Apache & nginx Settings** for your domain

2. In **Additional nginx directives**, add:

   ```nginx
   location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }
   ```

3. Click **OK**

### Step 11: Start Application

1. Go to **Node.js** settings for your domain
2. Click **Restart App** or **Enable Node.js**
3. Status should show **Running**

### Step 12: Enable SSL Certificate

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

### Step 13: Test Your Application

Visit: `https://habits.yourdomain.com`

You should see the Daily Practice Habit Tracker! 🎉

---

## 🔄 Database Comparison: MariaDB vs PostgreSQL

| Feature | PostgreSQL | MariaDB |
|---------|-----------|---------|
| Port | 5432 | 3306 |
| Package | `pg` | `mysql2` |
| JSON Storage | `JSONB` | `JSON` |
| Auto Increment | `SERIAL` | `AUTO_INCREMENT` |
| ON CONFLICT | `ON CONFLICT` | `ON DUPLICATE KEY UPDATE` |

The app works identically with both databases!

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

### Application Won't Start

**Check database connection:**
```bash
mysql -u habituser -p habit_tracker
```

**Check .env file:**
- Verify `DB_PORT=3306` (not 5432!)
- Check database password
- Ensure using MariaDB files (not PostgreSQL)

**View logs:**
1. **Node.js** → **Log Files** → View `stderr.log`

### "Cannot find module 'mysql2'"

**Solution:** Run npm install again
```bash
cd /var/www/vhosts/your-domain.com/httpdocs/backend
npm install
```

### Database Connection Failed

**Check credentials:**
```bash
mysql -u habituser -p
# Enter password
USE habit_tracker;
SHOW TABLES;
```

**Grant permissions if needed:**
```bash
mysql -u root -p
GRANT ALL PRIVILEGES ON habit_tracker.* TO 'habituser'@'localhost';
FLUSH PRIVILEGES;
```

### 502 Bad Gateway

1. Check Node.js app is **Running**
2. Verify reverse proxy configuration in nginx
3. Check port 3000 in `.env`

### Wrong Database Type Error

**If you see PostgreSQL errors:** You're using the wrong files!

Run the setup script again:
```bash
cd /var/www/vhosts/your-domain.com/httpdocs/backend
./setup-mariadb.sh
npm install
npm run init-db
```

---

## 📊 Performance Tips

### Enable Query Caching

In phpMyAdmin, run:
```sql
SET GLOBAL query_cache_size = 1048576;
SET GLOBAL query_cache_type = ON;
```

### Optimize Tables

```sql
OPTIMIZE TABLE habit_data;
OPTIMIZE TABLE users;
```

### Monitor Performance

1. **Statistics** → View resource usage
2. **Database** → Check query performance
3. Use **New Relic** or **Monitoring** extension (optional)

---

## 🔒 Security Checklist

- [ ] Strong database password
- [ ] `.env` file has permissions `600`
- [ ] SSL certificate installed
- [ ] HTTPS forced
- [ ] Firewall enabled
- [ ] Regular backups scheduled
- [ ] Keep Plesk updated

---

## 📦 Backup Your Database

### Automatic Backups (Recommended)

1. Go to **Backup Manager**
2. Click **Settings**
3. Enable **Scheduled Backups**
4. Set frequency (Daily recommended)
5. Include databases

### Manual Backup

1. **Databases** → Click your database
2. Click **Export Dump**
3. Download SQL file

### Command Line Backup

```bash
# Create backup directory
mkdir -p ~/backups

# Add to crontab (daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * mysqldump -u habituser -pYOUR_PASSWORD habit_tracker > ~/backups/habit_$(date +\%Y\%m\%d).sql
```

---

## 🆘 Getting Help

### Check These First:

1. **Logs:** Node.js → Log Files
2. **Database Connection:** Test with mysql command
3. **Verify MariaDB Setup:** Ensure using correct files

### Still Having Issues?

1. Review troubleshooting section above
2. Check [GitHub Issues](https://github.com/kili-d/habit-tracker/issues)
3. Verify you ran `setup-mariadb.sh` script

### Common Mistakes:

- ❌ Using PostgreSQL files instead of MariaDB
- ❌ Wrong port (5432 instead of 3306)
- ❌ Missing `npm install` after setup
- ❌ Database user lacks privileges

---

## 🎯 Quick Reference

### Important Files (MariaDB Version)
```
backend/database-mariadb.js     → Rename to database.js
backend/package-mariadb.json    → Rename to package.json
backend/.env-mariadb.example    → Copy to .env
backend/setup-mariadb.sh        → Run this to configure!
```

### Database Ports
```
PostgreSQL: 5432
MariaDB/MySQL: 3306
```

### Verify Setup
```bash
# Check database type in use
grep -i "mysql2" backend/package.json   # Should show mysql2
grep -i "3306" backend/.env             # Should show port 3306

# Test database connection
mysql -u habituser -p habit_tracker
```

---

## 🎉 You're Done!

Your Daily Practice Habit Tracker is now running on Plesk with MariaDB!

**Access your app:** `https://habits.yourdomain.com`

**What's Different from PostgreSQL Version?**
- Using MariaDB/MySQL database (port 3306)
- Using `mysql2` Node.js package
- Different SQL syntax internally
- **Everything else works the same!** ✨

---

**Happy tracking! 🎯**

*Vince te ipsum* - Conquer yourself
