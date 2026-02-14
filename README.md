# Daily Practice Habit Tracker

> *Vince te ipsum* - Conquer yourself

A beautiful, full-stack habit tracking application with PostgreSQL backend. Track your daily habits, view weekly progress, and maintain streaks with a clean, intuitive interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue)

## ✨ Features

- 📊 **Daily & Weekly Views** - Track habits by day or view your entire week at a glance
- 🎯 **Multiple Habit Types** - Toggle checkboxes, counters with targets, and checklists
- 📝 **Notes** - Add detailed notes to any habit completion
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 📱 **Responsive** - Mobile and desktop layouts
- 💾 **PostgreSQL Backend** - Production-ready database storage
- 🚀 **VPS Ready** - Easy deployment to any VPS
- 📈 **Progress Tracking** - Visual progress bars and statistics

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git
cd daily-practice-habit-tracker

# Create database
psql postgres -c "CREATE DATABASE habit_tracker;"

# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run init-db

# Start development server
npm run dev
```

Open http://localhost:3000

## 🌐 VPS Deployment

Deploy to your VPS in minutes with our automated script!

### One-Command Deploy

```bash
# On your VPS
git clone https://github.com/YOUR_USERNAME/daily-practice-habit-tracker.git
cd daily-practice-habit-tracker
chmod +x scripts/vps-setup.sh
./scripts/vps-setup.sh
```

The script automatically:
- ✅ Installs PostgreSQL, Node.js, PM2, and Nginx
- ✅ Creates and configures database
- ✅ Sets up the application
- ✅ Configures reverse proxy
- ✅ Installs SSL certificate (optional)

**Deployment guides:**
- [DEPLOYMENT.md](DEPLOYMENT.md) - Manual VPS setup (Ubuntu/Debian)
- [PLESK-DEPLOYMENT.md](PLESK-DEPLOYMENT.md) - Plesk control panel setup

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running locally in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete VPS deployment guide
- **[PLESK-DEPLOYMENT.md](PLESK-DEPLOYMENT.md)** - Plesk hosting deployment guide
- **[README.md](README.md)** - Full technical documentation

## 🏗️ Tech Stack

**Frontend:**
- React 18
- Vanilla CSS (inline styles)
- No build process required

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- RESTful API

**Deployment:**
- PM2 (process manager)
- Nginx (reverse proxy)
- Let's Encrypt (SSL)

## 📁 Project Structure

```
.
├── backend/
│   ├── server.js          # Express API server
│   ├── database.js        # PostgreSQL connection & queries
│   ├── init-db.js         # Database initialization
│   └── package.json       # Backend dependencies
├── frontend/
│   └── index.html         # React application
├── scripts/
│   └── vps-setup.sh       # Automated VPS setup
├── DEPLOYMENT.md          # Deployment guide
├── QUICKSTART.md          # Quick start guide
└── README.md              # Technical documentation
```

## 🎨 Screenshots

### Daily View (Light Mode)
Track individual habits with detailed controls and progress indicators.

### Weekly View (Dark Mode)
See your entire week at a glance with habit completion grid.

### Categories & Settings
Organize habits into categories and customize your experience.

## 🔒 Security

- Environment variables for sensitive data
- PostgreSQL with user authentication
- HTTPS/SSL support
- No sensitive data in repository
- Regular security updates recommended

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by minimalist habit tracking methodologies
- Built with focus on simplicity and effectiveness
- Designed for long-term daily practice

## 📧 Support

If you have any questions or run into issues:

1. Check the [QUICKSTART.md](QUICKSTART.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
2. Review the troubleshooting sections
3. Open an issue on GitHub

## 💰 Hosting Costs

Estimated monthly costs for VPS deployment:
- **VPS**: $5-10/month (DigitalOcean, Linode, etc.)
- **Domain**: $10-15/year
- **SSL**: FREE (Let's Encrypt)

**Total: ~$6-11/month**

## 🎯 Roadmap

- [ ] Multi-user support with authentication
- [ ] Data export/import
- [ ] Mobile apps (React Native)
- [ ] Habit streaks and achievements
- [ ] Data visualization and analytics
- [ ] Reminder notifications

---

**Built with ❤️ for daily practice and self-improvement**

*Vince te ipsum* - Conquer yourself
