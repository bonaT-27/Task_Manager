FROM node:18-alpine AS builder

WORKDIR /app

# Install OpenSSL 3.0
RUN apk add --no-cache openssl3

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client with the correct binary target
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 3.0 and curl for healthcheck
RUN apk add --no-cache openssl3 curl

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port
EXPOSE 3000

# Health check with longer timeout
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
  CMD curl -f http://localhost:3000/health || exit 1

# Migrations, then start the API (Railway / Compose)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]