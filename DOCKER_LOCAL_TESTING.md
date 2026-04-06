# Local Docker Development Guide

This guide helps you test the complete application stack locally with Docker before deploying to Render.

## 📋 Prerequisites

- Docker installed and running
- Docker Compose installed
- Git installed

## 🚀 Quick Start

### 1. Clone Both Repositories

```bash
# Ensure both cafe-backend and cafe-frontend are in the same directory
git clone https://github.com/YOUR_USERNAME/cafe-backend.git
git clone https://github.com/YOUR_USERNAME/cafe-frontend.git
```

Your directory structure should look like:
```
cafe/
├── cafe-backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/
│   └── ...
├── cafe-frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── src/
│   └── ...
└── docker-compose.yml
```

### 2. Start All Services

```bash
# From the parent directory (where docker-compose.yml is)
docker-compose up --build
```

This will:
- Create PostgreSQL database
- Build and start backend (Java Spring Boot)
- Build and start frontend (React)
- Expose services on:
  - Backend: `http://localhost:8080`
  - Frontend: `http://localhost:3000`
  - PostgreSQL: `localhost:5432`

### 3. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 🛑 Stop Services

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## 🔄 Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

## 📊 View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🛠️ Individual Commands

### Build Only
```bash
docker-compose build

# Specific service
docker-compose build backend
```

### Run Services
```bash
# Detached (background)
docker-compose up -d

# Foreground (attached)
docker-compose up
```

### Access Service Shell

```bash
# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access database
docker-compose exec postgres psql -U postgres -d cafe_db
```

## 🗄️ Database Management

### Connect to Database

```bash
# Using psql
docker-compose exec postgres psql -U postgres -d cafe_db

# Common psql commands inside the container:
# \dt                 - List tables
# \d table_name      - Describe table
# SELECT * FROM table_name;  - Query table
```

### Create Database Backup

```bash
docker-compose exec postgres pg_dump -U postgres cafe_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres cafe_db < backup.sql
```

## 🔍 Troubleshooting

### Issue: Port already in use
**Solution**: Change port in docker-compose.yml
```yaml
ports:
  - "8080:8080"  # Change first port to something else
  - "3000:3000"  # Change first port to something else
```

### Issue: Container failed to start
**Solution**: Check logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Issue: Cannot connect to database
**Solution**: Ensure postgres service is running and healthy
```bash
docker-compose ps

# Should show postgres as "Up"
```

### Issue: Frontend cannot connect to backend
**Solution**: Check backend is accessible
```bash
# From frontend container
docker-compose exec frontend curl http://backend:8080/api/menu
```

### Issue: npm or maven build fails
**Solution**: Rebuild without cache
```bash
docker-compose build --no-cache
```

## 📦 Build Backend Image Only

```bash
cd cafe-backend
docker build -t cafe-backend:latest .

# Run the image
docker run -it \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/cafe_db \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -p 8080:8080 \
  cafe-backend:latest
```

## 📦 Build Frontend Image Only

```bash
cd cafe-frontend
docker build -t cafe-frontend:latest .

# Run the image
docker run -it \
  -p 3000:3000 \
  cafe-frontend:latest
```

## 🔐 Accessing Logs

### Real-time logs
```bash
docker-compose logs -f

# Follow backend only
docker-compose logs -f backend
```

### View logs with timestamp
```bash
docker-compose logs --timestamps
```

## 💾 Volume Management

View volumes:
```bash
docker volume ls
```

Remove unused volumes:
```bash
docker volume prune
```

## 🌍 Network Testing

Test connectivity between containers:

```bash
# From frontend container, test backend
docker-compose exec frontend curl http://backend:8080/api/menu

# From backend, test database
docker-compose exec backend sh
curl http://localhost:8080/actuator/health
```

## 🚀 Performance Tips

1. **Use `--build` flag on first run only**:
   ```bash
   docker-compose up --build  # First time
   docker-compose up          # Subsequent times
   ```

2. **Remove dangling images**:
   ```bash
   docker image prune
   ```

3. **Limit container resources** (in docker-compose.yml):
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

## 🔄 Development Workflow

### Making Code Changes

1. Edit code in your local editor
2. Changes are automatically reflected (for frontend with hot-reload)
3. Backend requires rebuild:
   ```bash
   docker-compose restart backend
   # or
   docker-compose up --build backend
   ```

### Frontend Hot Reload

Frontend supports hot-reload. Changes to `src/` files are automatically reflected without restart.

### Backend Changes

Backend requires container restart:
```bash
# Make changes to code
# Rebuild backend
docker-compose build backend && docker-compose up -d backend

# Check if started successfully
docker-compose logs -f backend
```

## 📝 Common Tasks

### Reset Everything
```bash
docker-compose down -v
docker-compose up --build
```

### Update Dependencies
```bash
# Frontend
docker-compose exec frontend npm install

# Backend (rebuild required)
docker-compose build backend && docker-compose up -d backend
```

### Test API Endpoints
```bash
# From your host machine
curl http://localhost:8080/api/menu

# With data
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🎯 Next Steps

After successful local testing:

1. ✅ Verify all features work locally
2. ✅ Check logs for errors
3. ✅ Test database connectivity
4. ✅ Push code to GitHub
5. ✅ Deploy to Render using DEPLOYMENT_GUIDE.md

## 📚 Additional Resources

- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Spring Boot Docker: https://spring.io/guides/gs/spring-boot-docker/
- React Docker: https://create-react-app.dev/deployment/#docker

---

Happy local testing! 🚀
