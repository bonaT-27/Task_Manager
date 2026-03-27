# 📝 Task Management API

A **production-ready** Task Management API built with modern technologies, following best practices and clean architecture principles.

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with refresh token support
- Password hashing with bcryptjs
- Protected routes with middleware
- User registration and login

### 📋 **Task Management**
- Full CRUD operations (Create, Read, Update, Delete)
- Filter tasks by status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Filter tasks by priority (LOW, MEDIUM, HIGH, URGENT)
- Pagination support
- Task due dates

### 🛡️ **Security**
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation with Zod
- SQL injection prevention with Prisma
- XSS protection

### 📊 **Monitoring & Logging**
- Structured logging with Pino
- Request/response logging
- Error tracking with Sentry (optional)
- Performance monitoring

### 🧪 **Testing**
- Unit tests with Vitest
- Integration tests for API endpoints
- Test coverage reporting (71% coverage)
- 22 passing tests

### 🐳 **DevOps**
- Docker containerization
- Docker Compose for local development
- GitHub Actions CI/CD pipeline
- Health check endpoint
- Graceful shutdown

## 🏗️ **Architecture**

This project follows a clean, layered architecture:
