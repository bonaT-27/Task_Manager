#!/bin/bash
set -e

echo "🚀 Starting Task Management API..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production=false
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "📦 Running database migrations..."
    npx prisma migrate deploy
fi

# Build TypeScript
echo "🏗️ Building TypeScript..."
npm run build

# Start the application
echo "🌟 Starting server on port ${PORT:-3000}..."
npm start
