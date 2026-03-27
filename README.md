# Task_Manager

- 🔐 JWT Authentication
- 📝 CRUD Operations for Tasks
- 🔍 Filter tasks by status and priority
- ✅ Input Validation with Zod
- 📊 Structured Logging with Pino
- 🗄️ PostgreSQL with Prisma ORM
- 🐳 Docker Support
- 🚀 Deployed on Railway

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Update DATABASE_URL in .env

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start development server
npm run dev
