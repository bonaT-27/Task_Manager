#!/bin/sh
set -e

echo "========================================="
echo "Starting Task Management API"
echo "========================================="
echo "Node version: $(node --version)"
echo "Working directory: $(pwd)"
echo "========================================="

echo "Checking files..."
if [ -f dist/server.js ]; then
    echo "✅ dist/server.js exists"
    ls -la dist/server.js
else
    echo "❌ dist/server.js not found!"
    ls -la dist/
    exit 1
fi

echo "Checking environment variables..."
echo "DATABASE_URL: $([ -n "$DATABASE_URL" ] && echo "✅ Set" || echo "❌ NOT SET")"
echo "JWT_SECRET: $([ -n "$JWT_SECRET" ] && echo "✅ Set" || echo "❌ NOT SET")"
echo "PORT: ${PORT:-3000}"

echo "Running database migrations..."
if [ -n "$DATABASE_URL" ]; then
    npx prisma migrate deploy
    if [ $? -eq 0 ]; then
        echo "✅ Migrations completed"
    else
        echo "❌ Migrations failed"
        exit 1
    fi
else
    echo "⚠️  DATABASE_URL not set, skipping migrations"
fi

echo "Starting server..."
exec node dist/server.js
