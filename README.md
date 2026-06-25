# 🏠 Payday eOselia Telegram Bot

A lightweight Telegram bot designed to manage and track єОселя mortgage payments with automated reminders and payment calculations.

## 📋 Features

- **Mortgage Payment Tracking** - Track your monthly mortgage payments for the єОселя program
- **Automated Reminders** - Receive scheduled reminders for upcoming payments via cron jobs
- **Payment Calculations** - Automatically calculate monthly payments including:
  - Principal payment
  - Interest based on remaining balance and payment period
  - Fixed monthly commission
  - Annual collateral insurance (November payments)
- **Multi-tone Notifications** - Get reminders with different tones (standard, urgent, delayed)
- **Session Management** - Persistent storage of user data and payment history
- **Payment Status** - Check current payment status and history
- **User-friendly Commands** - Easy-to-use Telegram commands for all operations

## 🚀 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- PM2 (for production deployment)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payday-eoselia-tg-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
# Create .env.development
touch .env.development

# Create .env.production
touch .env.production
```

4. Configure your environment variables (see Configuration section below)

## ⚙️ Configuration

Create `.env.development` and `.env.production` files with the following variables:

```env
NODE_ENV=development # or production
TELEGRAM_TOKEN=your_telegram_bot_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment mode (development/production) | Yes |
| `TELEGRAM_TOKEN` | Your Telegram bot token from BotFather | Yes |
| `TELEGRAM_BOT_USERNAME` | Your bot's username | Yes |

> **Note:** The bot uses Europe/Kyiv timezone by default

## 🎮 Usage

### Available Commands

- `/start` - Initialize the bot and set up your mortgage tracking
- `/list` - View your payment history
- `/status` - Check your current payment status
- `/stop` - Stop receiving notifications

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the project
npm run build

# Start with Node.js
npm start

# Or start with PM2 (recommended)
pm2 start ecosystem.config.js
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint and Prettier checks
npm run fix          # Fix linting issues automatically
npm run type-check   # Run TypeScript type checking
```

### Linting and Formatting

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## 🚢 Deployment

### Using PM2

The project includes a PM2 configuration file (`ecosystem.config.js`) for production deployment:

```bash
# Start the application
pm2 start ecosystem.config.js

# Monitor the application
pm2 monit

# View logs
pm2 logs payday-eoselia-tg-bot

# Restart the application
pm2 restart payday-eoselia-tg-bot

# Stop the application
pm2 stop payday-eoselia-tg-bot
```

### PM2 Configuration

- **Instances:** 1 (cluster mode)
- **Auto-restart:** Enabled
- **Max memory:** 1GB (restarts if exceeded)
- **Logs:** Located in `./logs/` directory

## 🔧 Technologies Used

- **[Grammy](https://grammy.dev/)** - Modern Telegram bot framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[node-cron](https://www.npmjs.com/package/node-cron)** - Task scheduling
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[PM2](https://pm2.keymetrics.io/)** - Production process manager
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code quality tools

### Grammy Plugins

- `@grammyjs/emoji` - Emoji support
- `@grammyjs/menu` - Interactive menus
- `@grammyjs/runner` - Concurrent update handling
- `@grammyjs/storage-free` - Free cloud storage for sessions
- `@grammyjs/transformer-throttler` - Request throttling

## 📊 Mortgage Calculation Details

The bot calculates payments based on:

- **Principal:** 2,709,000 UAH
- **Fixed Principal Payment:** 11,288 UAH/month
- **Interest Rate (First 10 years):** 7% annual
- **Interest Rate (After 10 years):** 10% annual
- **Monthly Commission:** 55 UAH (first 10 years) / 75 UAH (after)
- **Collateral Insurance:** 8,708.5 UAH (annual, paid in November)
- **Loan Start Date:** November 19, 2025
- **First Payment Date:** December 25, 2025
- **Payment Day:** 25th of each month

## 📄 License

ISC

## 👤 Author

Please contact the repository owner for any questions or contributions.
