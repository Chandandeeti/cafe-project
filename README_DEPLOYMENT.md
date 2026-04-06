# Café Management System - Complete Deployment Guide

This repository contains the complete Café Management System with both backend and frontend configured for Docker deployment on Render with PostgreSQL.

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Local Development Setup](#local-development-setup)
4. [Docker Deployment](#docker-deployment)
5. [Render Deployment](#render-deployment)
6. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

A full-stack café management application with:

- **Frontend**: React + Vite with responsive UI
- **Backend**: Spring Boot Java REST API
- **Database**: PostgreSQL
- **Authentication**: JWT-based security
- **Features**: Menu management, shopping cart, order tracking, admin panel

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   RENDER PLATFORM                    │
├──────────────────┬──────────────────┬──────────────┤
│                  │                  │              │
│   Frontend       │  Backend         │ PostgreSQL   │
│ (Node.js)        │ (Java/Spring)    │  Database    │
│ Port: 3000       │  Port: 8080      │ Port: 5432   │
│                  │                  │              │
└──────────────────┴──────────────────┴──────────────┘
        │                    │                │
        └────────────────────┴────────────────┘
              Internal Network
```

## 🚀 Local Development Setup

### Prerequisites

- Docker & Docker Compose
- Git
- Node.js 18+ (for frontend development)
- Java 17+ (for backend development)
- PostgreSQL (for direct development)

### Quick Start

#### Option 1: Using Docker Compose (Recommended)

```bash
# Clone repositories
git clone <YOUR_BACKEND_REPO>
git clone <YOUR_FRONTEND_REPO>

# Navigate to project root
cd cafe

# Start all services
docker-compose up --build

# Access
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: localhost:5432
```

#### Option 2: Local Development

**Backend:**
```bash
cd cafe-backend

# Set up PostgreSQL
# Update src/main/resources/application.properties with your DB connection

# Run
mvn spring-boot:run
```

**Frontend:**
```bash
cd cafe-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

See [DOCKER_LOCAL_TESTING.md](DOCKER_LOCAL_TESTING.md) for detailed local setup instructions.

## 🐳 Docker Deployment

### Build Commands

```bash
# Build frontend image
cd cafe-frontend
docker build -t cafe-frontend:latest .

# Build backend image
cd cafe-backend
docker build -t cafe-backend:latest .

# Run with docker-compose
cd ..
docker-compose up
```

### Image Details

**Frontend Image**
- Base: `node:18-alpine`
- Port: 3000
- Tech: React + Vite + Serve
- Size: ~100MB

**Backend Image**
- Base: `eclipse-temurin:17-jre-jammy`
- Port: 8080
- Tech: Java 17 + Spring Boot
- Size: ~500MB

**Database**
- Image: `postgres:15-alpine`
- Port: 5432
- Default DB: `cafe_db`

### Docker Compose Services

```yaml
services:
  postgres:       # PostgreSQL Database
  backend:        # Java Spring Boot Backend
  frontend:       # React Frontend with Serve
```

## 🌐 Render Deployment

### Step 1: Prepare GitHub

```bash
# Ensure both repos are pushed to GitHub
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git push -u origin main
```

### Step 2: Deploy PostgreSQL

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Create database with:
   - **Name**: `cafe-db`
   - **Database**: `cafe_db`
   - **User**: `postgres`
4. Copy connection details

### Step 3: Deploy Backend

1. **New +** → **Web Service**
2. Connect `cafe-backend` GitHub repo
3. Configure:
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `./cafe-backend`
4. Add Environment Variables:
   ```
   DATABASE_URL = jdbc:postgresql://[host]:[port]/cafe_db
   DB_USER = postgres
   DB_PASSWORD = [password]
   SPRING_PROFILES_ACTIVE = prod
   JWT_SECRET = [generate_secure_key]
   ALLOWED_ORIGINS = https://cafe-frontend.onrender.com
   ```

### Step 4: Deploy Frontend

1. **New +** → **Web Service**
2. Connect `cafe-frontend` GitHub repo
3. Configure:
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `./cafe-frontend`
4. Add Environment Variables:
   ```
   VITE_API_URL = https://cafe-backend.onrender.com/api
   ```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📝 Configuration Files

### Backend Configuration

**Development** (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cafe_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Production** (`application-prod.properties`)
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

### Frontend Configuration

**Development** (`.env.development`)
```
VITE_API_URL=http://localhost:8080/api
```

**Production** (`.env.production`)
```
VITE_API_URL=https://cafe-backend.onrender.com/api
```

## 🔐 Environment Variables

### Backend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://host:5432/cafe_db` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `SPRING_PROFILES_ACTIVE` | Active profile | `prod` |
| `JWT_SECRET` | JWT signing key | `your_secret_key` |
| `ALLOWED_ORIGINS` | CORS origins | `https://cafe-frontend.onrender.com` |

### Frontend Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://cafe-backend.onrender.com/api` |

## 📊 Database Schema

The application automatically creates the following tables:

- `users` - User accounts with roles
- `categories` - Menu categories
- `menu_items` - Food/drink items with prices
- `inventory_items` - Stock tracking
- `carts` - Shopping carts
- `cart_items` - Items in carts
- `orders` - Customer orders
- `order_items` - Items in orders

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get available items
- `GET /api/menu/{id}` - Get item details
- `GET /api/menu/category/{categoryId}` - Filter by category
- `GET /api/menu/search?keyword=...` - Search items

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/{itemId}` - Update quantity
- `DELETE /api/cart/items/{itemId}` - Remove from cart

### Orders
- `POST /api/order` - Create order
- `GET /api/order` - Get user's orders
- `GET /api/order/{id}` - Get order details

### Admin
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/{id}` - Update menu item
- `DELETE /api/admin/menu/{id}` - Delete menu item

## ✅ Verification Checklist

- [ ] Backend health check: `curl https://your-backend.onrender.com/actuator/health`
- [ ] Frontend loads without errors
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can view menu items
- [ ] Can add items to cart
- [ ] Can place orders
- [ ] Can view order history
- [ ] Admin panel accessible to admin users

## 🐛 Troubleshooting

### Backend Issues

**Service won't start**
```
Check: DATABASE_URL format, DB credentials, network connectivity
```

**CORS errors in browser**
```
Update ALLOWED_ORIGINS to include your frontend URL
```

**Database connection failed**
```
Verify DATABASE_URL is correct, use Internal URL for Render services
```

### Frontend Issues

**Cannot connect to backend**
```
Check VITE_API_URL, ensure backend is running, check browser console
```

**Blank page or build errors**
```
Check build logs, verify node version, clear browser cache
```

### Database Issues

**Cannot connect to database**
```
Verify PostgreSQL is running, check credentials, ensure port is open
```

**Migrations not running**
```
Check Hibernate ddl-auto setting, verify schema permissions
```

## 📈 Monitoring

### View Logs

**Render Framework**
- Backend logs: Render Dashboard → Log
- Frontend logs: Render Dashboard → Log
- Database logs: Render Dashboard → Log

**Docker Local**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Checks

```bash
# Backend health
curl https://your-backend.onrender.com/actuator/health

# Frontend status
curl https://your-frontend.onrender.com
```

## 🔄 Continuous Deployment

Services auto-deploy when you push to `main` branch:

```bash
git add .
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

## 📚 Documentation

- [Local Testing Guide](DOCKER_LOCAL_TESTING.md) - Docker development setup
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Render deployment instructions
- [Backend README](cafe-backend/README.md) - Backend documentation
- [Frontend Setup](cafe-frontend/FRONTEND_SETUP.md) - Frontend documentation

## 🚨 Important Notes

1. **Keep secrets secure** - Use environment variables, never commit secrets
2. **Database backups** - Render provides automated backups
3. **Monitor costs** - Check Render dashboard for resource usage
4. **Scale as needed** - Upgrade plan for production traffic
5. **Health checks** - Both services have health endpoints configured

## 💡 Best Practices

1. ✅ Use environment variables for configuration
2. ✅ Keep Dockerfiles optimized and minimal
3. ✅ Use health checks for monitoring
4. ✅ Implement proper error handling
5. ✅ Log important events
6. ✅ Use secure JWT secrets
7. ✅ Enable HTTPS (automatic on Render)
8. ✅ Regular database backups

## 📞 Support & Resources

- [Render Documentation](https://render.com/docs)
- [Spring Boot Docs](https://docs.spring.io/spring-boot/)
- [React Docs](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🎯 Quick Command Reference

```bash
# Local development with Docker
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Access database
docker-compose exec postgres psql -U postgres -d cafe_db

# Reset everything
docker-compose down -v && docker-compose up --build
```

## 📜 License

This project is part of the Café Management System.

---

**Ready to deploy?** 🚀

1. Start with [DOCKER_LOCAL_TESTING.md](DOCKER_LOCAL_TESTING.md) for local development
2. Then follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for Render deployment

Happy coding! 💻☕
