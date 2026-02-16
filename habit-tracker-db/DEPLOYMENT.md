# VPS Deployment Guide

Complete step-by-step guide to deploy your habit tracker to a VPS.

## 📋 Prerequisites

- GitHub account
- VPS (DigitalOcean, Linode, Vultr, AWS, etc.)
- Domain name (optional but recommended)
- SSH access to your VPS

## 🚀 Part 1: Push to GitHub

### Step 1: Initialize Git Repository

```bash
cd habit-tracker-db

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Daily Practice Habit Tracker with PostgreSQL"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `daily-practice-habit-tracker` (or your choice)
3. Description: "Full-stack habit tracker with PostgreSQL backend"
4. Choose: **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

## 🌐 Part 2: Deploy to VPS

### Step 1: Get a VPS

**Recommended Providers:**
- **DigitalOcean** - $6/month Droplet (easiest)
- **Linode** - $5/month Nanode
- **Vultr** - $6/month instance
- **Hetzner** - €4.51/month (Europe)

**Minimum Requirements:**
- 1 GB RAM
- 1 CPU
- 25 GB SSD
- Ubuntu 22.04 LTS

### Step 2: Initial VPS Setup

```bash
# SSH into your VPS (provided by your VPS provider)
ssh root@your-vps-ip

# Create a non-root user
adduser habittracker
usermod -aG sudo habittracker

# Switch to new user
su - habittracker
```

### Step 3: Clone Your Repository

```bash
# Install git (if not installed)
sudo apt update
sudo apt install -y git

# Clone your repository
git clone https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git

# Enter directory
cd daily-practice-habit-tracker
```

### Step 4: Run Automated Setup

```bash
# Make script executable
chmod +x scripts/vps-setup.sh

# Run setup script
./scripts/vps-setup.sh
```

The script will:
- ✅ Install PostgreSQL
- ✅ Install Node.js
- ✅ Install PM2 (process manager)
- ✅ Install Nginx (web server)
- ✅ Create database
- ✅ Configure application
- ✅ Start application
- ✅ Configure SSL (optional)

**Follow the prompts:**
- Database name: `habit_tracker` (or your choice)
- Database user: `habituser` (or your choice)
- Database password: (create a strong password)
- Domain name: `habits.example.com` (your domain)

### Step 5: Point Your Domain

If you have a domain, point it to your VPS:

**DNS Settings (at your domain registrar):**
```
Type: A
Name: habits (or @)
Value: YOUR_VPS_IP
TTL: 300
```

Wait 5-15 minutes for DNS propagation.

### Step 6: Access Your Application

Open your browser:
- With domain: `https://habits.example.com`
- Without domain: `http://YOUR_VPS_IP:3000`

## 🔧 Manual Deployment (Alternative)

If you prefer manual setup:

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE habit_tracker;
CREATE USER habituser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE habit_tracker TO habituser;
\q
```

### 2. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. Setup Application

```bash
cd daily-practice-habit-tracker/backend

# Install dependencies
npm install --production

# Create .env file
cat > .env << EOF
DB_USER=habituser
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=your_secure_password
DB_PORT=5432
PORT=3000
NODE_ENV=production
EOF

# Initialize database
npm run init-db
```

### 4. Install & Configure PM2

```bash
# Install PM2
sudo npm install -g pm2

# Start application
pm2 start server.js --name habit-tracker

# Save PM2 configuration
pm2 save

# Setup auto-start
pm2 startup
# Copy and run the command it outputs
```

### 5. Install & Configure Nginx

```bash
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/habit-tracker
```

**Paste this configuration:**
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/habit-tracker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. Install SSL Certificate (Optional but Recommended)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔄 Updating Your Application

When you make changes and want to deploy:

### On Your Local Machine:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

### On Your VPS:
```bash
cd ~/daily-practice-habit-tracker

# Pull latest changes
git pull origin main

# Install any new dependencies
cd backend && npm install --production

# Restart application
pm2 restart habit-tracker
```

## 🛠️ Useful Commands

### PM2 (Process Management)
```bash
pm2 status              # Check app status
pm2 logs habit-tracker  # View logs
pm2 restart habit-tracker # Restart app
pm2 stop habit-tracker  # Stop app
pm2 start habit-tracker # Start app
pm2 delete habit-tracker # Remove from PM2
```

### PostgreSQL
```bash
# Connect to database
psql -U habituser -d habit_tracker

# Backup database
pg_dump -U habituser habit_tracker > backup.sql

# Restore database
psql -U habituser habit_tracker < backup.sql
```

### Nginx
```bash
sudo nginx -t                    # Test configuration
sudo systemctl restart nginx     # Restart Nginx
sudo systemctl status nginx      # Check status
sudo tail -f /var/log/nginx/error.log  # View errors
```

### System
```bash
df -h               # Check disk space
free -m             # Check memory
top                 # Check CPU/memory usage
sudo reboot         # Restart VPS
```

## 🔒 Security Best Practices

1. **Firewall (UFW)**
```bash
sudo ufw allow 22        # SSH
sudo ufw allow 80        # HTTP
sudo ufw allow 443       # HTTPS
sudo ufw enable
```

2. **Disable Root SSH**
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

3. **Regular Updates**
```bash
sudo apt update && sudo apt upgrade -y
```

4. **Database Backups**
```bash
# Add to crontab
crontab -e

# Add this line (daily backup at 2 AM)
0 2 * * * pg_dump -U habituser habit_tracker > ~/backups/habit_$(date +\%Y\%m\%d).sql
```

## 🐛 Troubleshooting

### Application not starting
```bash
# Check PM2 logs
pm2 logs habit-tracker

# Check database connection
psql -U habituser -d habit_tracker
```

### Can't access from browser
```bash
# Check if app is running
pm2 status

# Check if Nginx is running
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

### Database connection failed
```bash
# Test connection
psql -U habituser -h localhost -d habit_tracker

# Check PostgreSQL is running
sudo systemctl status postgresql
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## 💰 Cost Estimate

**Monthly Costs:**
- VPS: $5-10/month
- Domain: $10-15/year
- SSL: FREE (Let's Encrypt)

**Total: ~$6-11/month**

## 📊 Monitoring (Optional)

### Setup Status Page
```bash
# Install Uptime Kuma
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

Access at: `http://your-vps-ip:3001`

## 🎉 You're Done!

Your habit tracker is now:
- ✅ Running on a VPS
- ✅ Using PostgreSQL database
- ✅ Accessible via your domain
- ✅ Secured with SSL
- ✅ Auto-restarts on crashes
- ✅ Starts automatically on server reboot

## 📞 Need Help?

- Check logs: `pm2 logs habit-tracker`
- Check status: `pm2 status`
- Restart: `pm2 restart habit-tracker`

Happy habit tracking! 🎯
