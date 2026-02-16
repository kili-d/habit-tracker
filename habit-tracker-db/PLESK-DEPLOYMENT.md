# Plesk Deployment Guide

Complete guide to deploy Daily Practice Habit Tracker on Plesk.

## 📋 Prerequisites

- Plesk Obsidian 18.0+ (or Onyx 17.8+)
- Node.js extension installed in Plesk
- PostgreSQL support enabled
- Domain name pointed to your server

## 🚀 Quick Overview

Deployment time: **15-20 minutes**

Steps:
1. Create PostgreSQL database
2. Create domain/subdomain
3. Setup Node.js application
4. Clone repository
5. Configure environment
6. Install dependencies & initialize database
7. Enable SSL
8. Start application

---

## 📖 Detailed Steps

### Step 1: Install Node.js Extension (If Not Installed)

1. Log into **Plesk** as administrator
2. Go to **Extensions** (in left sidebar)
3. Search for **"Node.js"**
4. Click **Get It Free** or **Install**
5. Wait for installation to complete

### Step 2: Create PostgreSQL Database

1. Go to **Databases** → **Add Database**

2. Fill in database details:
   ```
   Database name: habit_tracker
   Related site: (select your domain)
   ```

3. Click **OK**

4. **Create Database User:**
   - Click on the database you just created
   - Go to **Users** tab
   - Click **Add Database User**
   ```
   Username: habituser
   Password: [Create a strong password]
   ```
   - Check all privileges
   - Click **OK**

5. **Note down your credentials:**
   ```
   Database: habit_tracker
   Username: habituser
   Password: [your password]
   Host: localhost (usually)
   Port: 5432
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

5. Click **Enable** (don't start yet, we need to setup first)

### Step 5: Access File Manager & Clone Repository

**Option A: Using Git (Recommended)**

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

**Option B: Using File Manager**

1. Click **File Manager**
2. Navigate to `/httpdocs`
3. Delete any default files (index.html, etc.)
4. Click **Upload** or use **Git Clone** button
5. Upload all files from your repository

**Option C: Using SSH/SFTP**

```bash
# SSH into your server
ssh your-username@your-domain.com

# Navigate to web directory
cd /var/www/vhosts/your-domain.com/httpdocs

# Clone repository
git clone https://github.com/kili-d/habit-tracker.git .

# Set correct permissions
chown -R your-ftp-user:psaserv .
```

### Step 6: Configure Environment Variables

1. In **File Manager**, navigate to `/httpdocs/backend`

2. Create `.env` file:
   - Click **+ (Create File)**
   - Name: `.env`
   - Click **OK**

3. Edit the `.env` file (click on it, then **Edit in Code Editor**):

   ```env
   DB_USER=habituser
   DB_HOST=localhost
   DB_NAME=habit_tracker
   DB_PASSWORD=your_database_password_here
   DB_PORT=5432
   PORT=3000
   NODE_ENV=production
   ```

4. **Save** the file

5. **Set correct permissions:**
   - Right-click `.env`
   - Click **Change Permissions**
   - Set to: `600` (owner read/write only)

### Step 7: Install Dependencies

**Option A: Using Plesk Terminal (if available)**

1. Go to **Websites & Domains** → Your domain
2. Click **Web Terminal** or **SSH Terminal**
3. Run:
   ```bash
   cd httpdocs/backend
   npm install --production
   ```

**Option B: Using Scheduled Task**

1. Go to **Scheduled Tasks**
2. Click **Add Task**
3. Configure:
   ```
   Task type: Run a command
   Command: cd /var/www/vhosts/your-domain.com/httpdocs/backend && npm install --production
   Run: Once
   Date/Time: Now (or soon)
   ```
4. Click **OK**
5. Wait for task to complete (check Task History)

**Option C: Using SSH**

```bash
ssh your-username@your-domain.com
cd /var/www/vhosts/your-domain.com/httpdocs/backend
npm install --production
```

### Step 8: Initialize Database

Using one of the methods above, run:

```bash
cd /var/www/vhosts/your-domain.com/httpdocs/backend
npm run init-db
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database schema initialized successfully
✅ Database initialization complete!
```

### Step 9: Configure Node.js Application Startup

1. Go back to **Node.js** settings for your domain

2. Update settings if needed:
   ```
   Application root: /httpdocs
   Application startup file: backend/server.js
   ```

3. Click **Enable Node.js** (if not already enabled)

4. Click **Restart App**

### Step 10: Enable SSL Certificate

1. Go to **Websites & Domains** → Your domain

2. Click **SSL/TLS Certificates**

3. Choose one of:

   **Option A: Let's Encrypt (Free)**
   - Click **Install** under "Let's Encrypt"
   - Enter email address
   - Check "Secure the domain and www subdomain"
   - Click **Get It Free**
   - Wait for installation

   **Option B: Use Existing Certificate**
   - Upload your SSL certificate
   - Follow the wizard

4. After SSL is installed:
   - Go to **Hosting Settings**
   - Check **Permanent SEO-safe 301 redirect from HTTP to HTTPS**
   - Click **OK**

### Step 11: Configure Reverse Proxy (Important!)

By default, Plesk serves static files. We need it to proxy to our Node.js app.

1. Go to **Apache & nginx Settings**

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

### Step 12: Test Your Application

1. Visit your domain: `https://habits.yourdomain.com`

2. You should see the Daily Practice Habit Tracker!

3. If not working:
   - Check **Node.js** status (should be "Running")
   - Check **Logs** (in Node.js settings)
   - Verify database connection

---

## 🔄 Updating Your Application

### Method 1: Using Git (if setup with Git)

1. Go to **Git** in Plesk
2. Click **Pull Updates**
3. Go to **Node.js** → Click **Restart App**

### Method 2: Manual Upload

1. Upload new files via **File Manager** or SFTP
2. If `package.json` changed, run `npm install` again
3. Go to **Node.js** → Click **Restart App**

### Method 3: Using SSH

```bash
ssh your-username@your-domain.com
cd /var/www/vhosts/your-domain.com/httpdocs
git pull origin main
cd backend && npm install --production
# Restart via Plesk GUI or:
plesk bin site --update-nodejs your-domain.com -restart
```

---

## 🛠️ Managing Your Application

### Start/Stop/Restart Application

1. Go to **Websites & Domains** → Your domain
2. Click **Node.js**
3. Use **Restart App** button

### View Logs

1. In **Node.js** settings
2. Click **Log Files** tab
3. View:
   - `stderr.log` - Error messages
   - `stdout.log` - Application output

### Monitor Resources

1. Go to **Statistics**
2. View CPU, Memory, and Traffic usage

### Backup Database

**Method 1: Plesk Backup**

1. Go to **Backup Manager**
2. Click **Back Up**
3. Select database and files
4. Click **OK**

**Method 2: Manual Backup**

1. Go to **Databases** → Your database
2. Click **Export Dump**
3. Choose format and download

**Method 3: Scheduled Backup**

1. Go to **Scheduled Tasks**
2. Create task:
   ```bash
   PGPASSWORD='your_password' pg_dump -U habituser habit_tracker > /var/www/vhosts/your-domain.com/backup_$(date +\%Y\%m\%d).sql
   ```
3. Schedule daily/weekly

---

## 🐛 Troubleshooting

### Application Not Starting

**Check Node.js Status:**
1. Go to **Node.js** settings
2. Check status and logs

**Check .env file:**
1. Verify database credentials
2. Ensure PORT is 3000
3. Check file permissions (600)

**Test Database Connection:**
```bash
psql -U habituser -h localhost -d habit_tracker
# Enter password when prompted
```

### 502 Bad Gateway

**Possible causes:**
1. Node.js app not running
2. Wrong port in reverse proxy configuration
3. App crashed - check logs

**Solutions:**
1. Restart Node.js app
2. Verify nginx configuration has `proxy_pass http://localhost:3000`
3. Check error logs in Node.js settings

### 404 Not Found

**Cause:** Nginx serving static files instead of proxying

**Solution:**
1. Verify **Apache & nginx Settings** has reverse proxy config
2. Make sure Application URL is `/` in Node.js settings
3. Restart nginx: **Tools & Settings** → **Services** → Restart nginx

### Can't Connect to Database

**Check:**
1. PostgreSQL service is running
2. Database name, user, and password are correct in `.env`
3. Database user has proper privileges

**Test connection:**
```bash
psql -U habituser -h localhost -d habit_tracker
```

### Application Crashes After Starting

**Check Logs:**
1. Go to **Node.js** → **Log Files**
2. View `stderr.log` for errors

**Common Issues:**
- Missing dependencies: Run `npm install` again
- Database not initialized: Run `npm run init-db`
- Port already in use: Check if another app uses port 3000

---

## 🔒 Security Checklist

After deployment:

- [ ] SSL certificate installed and forced HTTPS
- [ ] `.env` file has permissions `600`
- [ ] Database password is strong
- [ ] Plesk firewall is enabled
- [ ] Regular backups scheduled
- [ ] Fail2Ban configured (optional)
- [ ] ModSecurity enabled (optional)

---

## 📊 Performance Optimization

### Enable Caching

1. Go to **Apache & nginx Settings**
2. Enable nginx caching
3. Set cache duration for static files

### Enable Gzip Compression

Already enabled by default in Plesk.

### Monitor Performance

1. Use **Statistics** to monitor resources
2. Upgrade plan if needed
3. Consider CDN for static assets (optional)

---

## 💰 Plesk Hosting Costs

**Typical Costs:**
- **Web hosting with Plesk**: $5-20/month
- **VPS with Plesk**: $10-30/month
- **Domain**: $10-15/year
- **SSL**: FREE (Let's Encrypt via Plesk)

---

## 🎯 Quick Reference

### Important Paths
```
Web root: /var/www/vhosts/your-domain.com/httpdocs
Backend: /var/www/vhosts/your-domain.com/httpdocs/backend
Logs: /var/www/vhosts/your-domain.com/logs
```

### Important Commands (SSH)
```bash
# Navigate to app
cd /var/www/vhosts/your-domain.com/httpdocs

# Pull updates
git pull origin main

# Install dependencies
cd backend && npm install --production

# Initialize database
npm run init-db

# View logs
tail -f /var/www/vhosts/your-domain.com/logs/error_log
```

### Plesk CLI Commands
```bash
# Restart Node.js app
plesk bin site --update-nodejs your-domain.com -restart

# List Node.js apps
plesk bin site --list-nodejs

# View status
plesk bin site --status-nodejs your-domain.com
```

---

## 🆘 Getting Help

1. **Check Logs:** Node.js → Log Files
2. **Plesk Support:** https://support.plesk.com
3. **GitHub Issues:** https://github.com/kili-d/habit-tracker/issues
4. **Documentation:** Review DEPLOYMENT.md and QUICKSTART.md

---

## 🎉 You're Done!

Your Daily Practice Habit Tracker is now running on Plesk!

**Access your app:**
- URL: `https://habits.yourdomain.com`
- Plesk Panel: `https://your-domain.com:8443`

**Next Steps:**
- [ ] Test all features
- [ ] Set up automated backups
- [ ] Configure monitoring/alerts
- [ ] Share with users!

---

**Happy tracking! 🎯**

*Vince te ipsum* - Conquer yourself
