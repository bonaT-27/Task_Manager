#!/bin/sh
set -e

echo "🚀 Starting Task Management API..."
echo "Node version: $(node --version)"

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "🌟 Starting server on port ${PORT:-3000}..."
exec node dist/server.js
