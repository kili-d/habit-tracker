#!/bin/bash

echo "🚀 Daily Practice Habit Tracker - Setup Script"
echo "=============================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@15"
    echo "  Linux: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed ($(node --version))"
echo ""

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your PostgreSQL credentials"
    echo ""
fi

echo "=============================================="
echo "Setup complete! Next steps:"
echo ""
echo "1. Edit backend/.env with your database credentials"
echo "2. Create the database: psql postgres -c 'CREATE DATABASE habit_tracker;'"
echo "3. Initialize database: cd backend && npm run init-db"
echo "4. Start server: npm run dev"
echo "5. Open browser: http://localhost:3000"
echo ""
echo "See README.md for detailed instructions."
