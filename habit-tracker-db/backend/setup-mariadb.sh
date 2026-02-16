#!/bin/bash

echo "🔧 Configuring for MariaDB/MySQL..."
echo ""

# Backup existing files if they exist
if [ -f "package.json" ]; then
    echo "📦 Backing up existing package.json..."
    cp package.json package-postgresql.json.bak
fi

if [ -f "database.js" ]; then
    echo "📦 Backing up existing database.js..."
    cp database.js database-postgresql.js.bak
fi

if [ -f ".env.example" ]; then
    echo "📦 Backing up existing .env.example..."
    cp .env.example .env-postgresql.example.bak
fi

# Copy MariaDB versions
echo "📝 Installing MariaDB versions..."
cp package-mariadb.json package.json
cp database-mariadb.js database.js
cp .env-mariadb.example .env.example

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your MariaDB credentials"
fi

echo ""
echo "✅ Configuration complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your MariaDB credentials"
echo "  2. Run: npm install"
echo "  3. Create database: mysql -u root -p -e 'CREATE DATABASE habit_tracker;'"
echo "  4. Run: npm run init-db"
echo "  5. Run: npm run dev"
echo ""
