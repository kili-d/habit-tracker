# GitHub Setup & Deployment Checklist

Complete checklist to push your code to GitHub and deploy to VPS.

## ✅ Pre-Push Checklist

Before pushing to GitHub, verify:

- [ ] All sensitive data is in `.env` (not committed)
- [ ] `.gitignore` is properly configured
- [ ] `README-GITHUB.md` exists (will be renamed to README.md)
- [ ] All scripts are executable
- [ ] No personal information in code
- [ ] Database credentials are in `.env.example` as placeholders

## 📤 Step 1: Prepare for GitHub

### 1.1 Rename README for GitHub

```bash
cd habit-tracker-db

# Backup technical README
mv README.md README-TECHNICAL.md

# Use GitHub-friendly README
mv README-GITHUB.md README.md
```

### 1.2 Verify .gitignore

```bash
# Check that .env is ignored
cat .gitignore | grep .env

# Make sure .env exists (it won't be committed)
ls -la backend/.env
```

### 1.3 Test Locally (Optional)

```bash
# Make sure everything works
cd backend
npm install
npm run init-db
npm run dev
```

## 🚀 Step 2: Push to GitHub

### 2.1 Initialize Git

```bash
cd habit-tracker-db

# Initialize repository
git init

# Add all files
git add .

# Check what will be committed (make sure no .env files!)
git status

# Create first commit
git commit -m "Initial commit: Daily Practice Habit Tracker"
```

### 2.2 Create GitHub Repository

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name**: `daily-practice-habit-tracker`
   - **Description**: "Full-stack habit tracker with PostgreSQL backend"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** check "Initialize with README" (we have one)
3. Click "Create repository"

### 2.3 Push to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ **Your code is now on GitHub!**

View at: `https://github.com/YOUR_USERNAME/daily-practice-habit-tracker`

## 🌐 Step 3: Deploy to VPS

### 3.1 Choose VPS Provider

**Recommended Options:**

| Provider | Plan | Price | Location |
|----------|------|-------|----------|
| DigitalOcean | Basic Droplet | $6/mo | Multiple |
| Linode | Nanode 1GB | $5/mo | Multiple |
| Vultr | Cloud Compute | $6/mo | Multiple |
| Hetzner | CX11 | €4.51/mo | Europe |

**Required Specs:**
- 1 GB RAM minimum
- 1 CPU
- 25 GB Storage
- Ubuntu 22.04 LTS

### 3.2 Initial VPS Setup

```bash
# SSH into VPS (use credentials from provider)
ssh root@YOUR_VPS_IP

# Create non-root user
adduser habittracker
usermod -aG sudo habittracker

# Switch to new user
su - habittracker

# Update system
sudo apt update && sudo apt upgrade -y
```

### 3.3 Clone Repository on VPS

```bash
# Install git
sudo apt install -y git

# Clone your repository (use YOUR GitHub URL)
git clone https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git

# Enter directory
cd daily-practice-habit-tracker

# Make scripts executable
chmod +x scripts/vps-setup.sh
```

### 3.4 Run Automated Setup

```bash
# Run the setup script
./scripts/vps-setup.sh
```

**You'll be prompted for:**
1. Database name (default: habit_tracker)
2. Database user (default: habituser)
3. Database password (create a strong one!)
4. Domain name (e.g., habits.example.com)
5. SSL certificate (Yes/No)

**The script will:**
- ✅ Install PostgreSQL
- ✅ Install Node.js 18
- ✅ Install PM2 (process manager)
- ✅ Install Nginx (web server)
- ✅ Create database
- ✅ Install dependencies
- ✅ Initialize database schema
- ✅ Start application with PM2
- ✅ Configure Nginx
- ✅ Install SSL certificate (if selected)

### 3.5 Point Your Domain (If Using One)

**At your domain registrar (Namecheap, GoDaddy, etc.):**

Add an A Record:
```
Type: A
Name: habits (or @ for root domain)
Value: YOUR_VPS_IP
TTL: 300 (or automatic)
```

Wait 5-15 minutes for DNS propagation.

### 3.6 Access Your Application

**With domain:**
```
https://habits.example.com
```

**Without domain:**
```
http://YOUR_VPS_IP:3000
```

## 🎉 You're Done!

Your habit tracker is now:
- ✅ On GitHub (version controlled)
- ✅ Running on VPS (production)
- ✅ Using PostgreSQL (persistent storage)
- ✅ Secured with SSL (if configured)
- ✅ Auto-restarts on crashes (PM2)
- ✅ Starts on server reboot (PM2)

## 🔄 Making Updates

### On Your Local Machine:

```bash
# Make your changes
# ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### On Your VPS:

```bash
cd ~/daily-practice-habit-tracker

# Pull latest changes
git pull origin main

# Restart application
pm2 restart habit-tracker

# If dependencies changed
cd backend && npm install --production
pm2 restart habit-tracker
```

## 🛠️ Useful Commands

### Check Application Status
```bash
pm2 status
pm2 logs habit-tracker
pm2 monit
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Check Database
```bash
psql -U habituser -d habit_tracker
```

### Restart Everything
```bash
pm2 restart habit-tracker
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

## 🔒 Security Checklist

After deployment:

- [ ] Firewall is enabled (`sudo ufw enable`)
- [ ] Only ports 22, 80, 443 are open
- [ ] Root SSH login is disabled
- [ ] Strong database password is set
- [ ] SSL certificate is installed
- [ ] Regular backups are scheduled

## 📊 Monitoring

### Check Logs
```bash
pm2 logs habit-tracker --lines 50
```

### Check System Resources
```bash
htop  # or: top
df -h  # disk space
free -m  # memory
```

### Setup Automated Backups
```bash
# Create backup directory
mkdir -p ~/backups

# Add to crontab (daily backup at 2 AM)
crontab -e

# Add this line:
0 2 * * * pg_dump -U habituser habit_tracker > ~/backups/habit_$(date +\%Y\%m\%d).sql
```

## 🐛 Troubleshooting

### Can't access application
```bash
# Check if app is running
pm2 status

# Check if port is listening
sudo netstat -tulpn | grep 3000

# Check firewall
sudo ufw status
```

### Database connection failed
```bash
# Test database connection
psql -U habituser -h localhost -d habit_tracker

# Check PostgreSQL status
sudo systemctl status postgresql
```

### SSL certificate issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

## 📞 Need Help?

1. Check logs: `pm2 logs habit-tracker`
2. Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. Check troubleshooting sections
4. Open GitHub issue

## 🎯 What's Next?

- [ ] Set up automated backups
- [ ] Configure monitoring/alerting
- [ ] Add custom domain
- [ ] Setup staging environment
- [ ] Document your workflow
- [ ] Invite users to test

---

**Happy deploying! 🚀**
