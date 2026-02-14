#!/bin/bash

echo "🚀 VPS Setup Script for Daily Practice Habit Tracker"
echo "======================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo -e "${RED}❌ Please don't run as root${NC}"
   exit 1
fi

echo "📋 This script will:"
echo "  1. Update system packages"
echo "  2. Install PostgreSQL"
echo "  3. Install Node.js"
echo "  4. Install PM2 process manager"
echo "  5. Install Nginx"
echo "  6. Setup database"
echo "  7. Configure application"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo ""
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

echo ""
echo "📦 Installing Node.js (via NodeSource)..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo ""
echo "📦 Installing PM2..."
sudo npm install -g pm2

echo ""
echo "📦 Installing Nginx..."
sudo apt install -y nginx

echo ""
echo "🔧 Configuring PostgreSQL..."
read -p "Enter database name [habit_tracker]: " DB_NAME
DB_NAME=${DB_NAME:-habit_tracker}

read -p "Enter database user [habituser]: " DB_USER
DB_USER=${DB_USER:-habituser}

read -sp "Enter database password: " DB_PASSWORD
echo ""

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database configured successfully${NC}"
else
    echo -e "${RED}❌ Database configuration failed${NC}"
    exit 1
fi

echo ""
echo "📝 Creating .env file..."
cat > backend/.env << EOF
DB_USER=$DB_USER
DB_HOST=localhost
DB_NAME=$DB_NAME
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432
PORT=3000
NODE_ENV=production
EOF

echo -e "${GREEN}✅ .env file created${NC}"

echo ""
echo "📦 Installing application dependencies..."
cd backend && npm install --production

echo ""
echo "🗄️ Initializing database..."
npm run init-db

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database initialized${NC}"
else
    echo -e "${RED}❌ Database initialization failed${NC}"
    exit 1
fi

echo ""
echo "🚀 Starting application with PM2..."
pm2 start server.js --name habit-tracker
pm2 save
pm2 startup

echo ""
echo "🔧 Configuring Nginx..."
read -p "Enter your domain name (e.g., habits.example.com): " DOMAIN

sudo tee /etc/nginx/sites-available/habit-tracker << EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/habit-tracker /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Nginx configured${NC}"

echo ""
echo "🔒 Installing SSL certificate..."
read -p "Install Let's Encrypt SSL? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN
fi

echo ""
echo "======================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================================"
echo ""
echo "📊 Your application is now running at:"
echo "   http://$DOMAIN"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 status          - Check app status"
echo "   pm2 logs            - View logs"
echo "   pm2 restart all     - Restart app"
echo "   pm2 stop all        - Stop app"
echo ""
echo "📝 Configuration:"
echo "   App: ~/$(basename $(pwd))"
echo "   Logs: ~/.pm2/logs/"
echo "   Nginx: /etc/nginx/sites-available/habit-tracker"
echo ""
