# Render Deployment Guide - Café Application

This guide explains how to deploy the Café Backend and Frontend to Render with PostgreSQL.

## 📋 Prerequisites

- GitHub account with both repos pushed
- Render account (https://render.com)
- Docker installed locally (for testing)
- Git configured on your machine

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    RENDER PLATFORM                   │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  Frontend    │  │   Backend    │  │ PostgreSQL │ │
│  │  (Node.js)   │  │ (Java/Spring)│  │ Database   │ │
│  │  Port: 3000  │  │  Port: 8080  │  │ Port: 5432 │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 🚀 Deployment Steps

### Step 1: Prepare GitHub Repositories

1. **Create GitHub repositories** for both backend and frontend:
   - `cafe-backend`
   - `cafe-frontend`

2. **Push code to GitHub**:
   ```bash
   # For backend
   cd cafe-backend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cafe-backend.git
   git push -u origin main

   # For frontend
   cd ../cafe-frontend
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cafe-frontend.git
   git push -u origin main
   ```

### Step 2: Deploy PostgreSQL on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `cafe-db`
   - **Database**: `cafe_db`
   - **User**: `postgres`
   - **Region**: Oregon (or your preferred region)
   - **Plan**: Starter (for development) or suitable plan
4. Click **Create Database**
5. Wait for database to be created
6. Copy the **Internal Database URL** (starts with `postgres://`) for later

### Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your **cafe-backend** GitHub repository
4. Configure:
   - **Name**: `cafe-backend`
   - **Runtime**: `Docker`
   - **Region**: Same as database (Oregon)
   - **Branch**: `main`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `./cafe-backend`
5. Under **Environment**:
   - Click **Add Environment Variable**
   - Add the following variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `jdbc:postgresql://[pg-host]:[pg-port]/cafe_db` |
   | `DB_USER` | `postgres` |
   | `DB_PASSWORD` | `[Your DB Password from Render]` |
   | `SPRING_PROFILES_ACTIVE` | `prod` |
   | `JWT_SECRET` | `YourSecureJWTSecretKey2024!` |
   | `ALLOWED_ORIGINS` | `https://cafe-frontend.onrender.com` |

   > **Note**: Replace `[pg-host]` and `[pg-port]` with details from your PostgreSQL connection string

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Copy the backend URL (e.g., `https://cafe-backend.onrender.com`)

### Step 4: Deploy Frontend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your **cafe-frontend** GitHub repository
4. Configure:
   - **Name**: `cafe-frontend`
   - **Runtime**: `Docker`
   - **Region**: Same as backend (Oregon)
   - **Branch**: `main`
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `./cafe-frontend`
5. Under **Environment**:
   - Click **Add Environment Variable**
   - Add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://cafe-backend.onrender.com/api` |

   > Replace with actual backend URL from Step 3

6. Click **Create Web Service**
7. Wait for deployment (3-5 minutes)

## 🔧 Getting Database Connection Details

After creating PostgreSQL on Render:

1. Go to your database in Render Dashboard
2. Click on the database name
3. In **Connections** section, you'll see:
   - **Internal Database URL** (for services within Render)
   - **External Database URL** (for external connections)
   - **Host**, **Port**, **Database**, **User**, **Password**

### Converting PostgreSQL URL to JDBC Format

If Render gives you a connection string like:
```
postgresql://postgres:password@pg-service.onrender.com:5432/cafe_db
```

Convert it to JDBC format:
```
jdbc:postgresql://pg-service.onrender.com:5432/cafe_db
```

## 📝 Environment Variables Reference

### Backend Environment Variables
```
DATABASE_URL=jdbc:postgresql://host:port/cafe_db    # Required
DB_USER=postgres                                      # Required
DB_PASSWORD=your_password                            # Required
SPRING_PROFILES_ACTIVE=prod                          # Required
JWT_SECRET=YourSecureKey!                            # Optional (generates if not set)
ALLOWED_ORIGINS=https://cafe-frontend.onrender.com  # Optional
PORT=8080                                            # Optional
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend.onrender.com/api  # Required for production build
```

## ✅ Verification

### Check Backend Status
```bash
curl https://cafe-backend.onrender.com/actuator/health
# Expected response: {"status":"UP"}
```

### Check Frontend Status
```bash
curl https://cafe-frontend.onrender.com
# Should return HTML content
```

### Test API Connection
1. Open `https://cafe-frontend.onrender.com` in browser
2. Try to register or login
3. Check browser console for any errors

## 🐛 Troubleshooting

### Backend Not Starting
1. Check logs in Render Dashboard
2. Verify database connection string is correct
3. Ensure all required environment variables are set
4. Check that PostgreSQL service is running

### Frontend Not Connecting to Backend
1. Verify `VITE_API_URL` is correct
2. Check browser console Network tab for failed requests
3. Ensure backend `ALLOWED_ORIGINS` includes frontend URL
4. Check CORS settings in backend

### Database Connection Issues
```
Error: "cannot connect to database"
Solution: 
- Verify DATABASE_URL format is correct
- Check DB_USER and DB_PASSWORD match
- Ensure PostgreSQL service is running
- Wait a few minutes after creating database
```

### Port Issues
```
Error: "Port 8080 is already in use"
Solution:
- Change PORT environment variable in backend
- Restart the service in Render
```

## 🔄 Continuous Deployment

Both services are set to auto-deploy when you push to the main branch.

### To update:
1. Make changes to code
2. Commit: `git commit -m "Your message"`
3. Push: `git push origin main`
4. Services will auto-deploy (watch Render dashboard for build status)

## 💾 Database Backups

Render provides automated backups. To access:

1. Go to PostgreSQL database in Render
2. Click on **Backups** tab
3. View available backups and restore options

## 🔒 Security Best Practices

1. **Use strong JWT secret**:
   ```
   Generate: openssl rand -base64 32
   ```

2. **Use environment variables for secrets** - Never hardcode in code

3. **Set proper CORS origins** - Only allow your frontend URL

4. **Rotate passwords regularly**

5. **Monitor logs** for suspicious activity

## 📊 Monitoring

### View Logs
1. Click on service in Render Dashboard
2. Click **Logs** tab
3. Search for errors or issues

### Check Resource Usage
1. Click on service
2. Click **Metrics** tab
3. Monitor CPU, Memory, Disk

## 🚨 Common Issues & Solutions

### Issue: "Build failed"
**Solution**: Check build logs, ensure Dockerfile is correct

### Issue: "Application crashed"
**Solution**: Check logs, verify environment variables

### Issue: "502 Bad Gateway"
**Solution**: Backend is down, check backend logs

### Issue: "CORS error"
**Solution**: Update `ALLOWED_ORIGINS` in backend environment

### Issue: "Cannot read database"
**Solution**: Verify database is running and connection string is correct

## 📞 Support Resources

- Render Docs: https://render.com/docs
- Spring Boot Docs: https://docs.spring.io/spring-boot/
- React Docs: https://react.dev/
- Docker Docs: https://docs.docker.com/

## 🎯 Next Steps

1. ✅ Deploy PostgreSQL
2. ✅ Deploy Backend Service
3. ✅ Deploy Frontend Service
4. ✅ Test application
5. ✅ Monitor logs and metrics
6. ✅ Set up custom domain (optional)
7. ✅ Configure SSL certificates (automatic on Render)

## 📝 Deployment Checklist

- [ ] GitHub repositories created and code pushed
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed with correct environment variables
- [ ] Frontend deployed with correct API URL
- [ ] Database connection verified
- [ ] API endpoints tested
- [ ] Frontend loads without errors
- [ ] Can register and login
- [ ] Can view menu items
- [ ] Can place orders
- [ ] Admin panel accessible

## 💡 Tips

1. **Use custom domains**: Add your own domain in Render for better UX
2. **Enable auto-deploy**: Each push to main branch will auto-deploy
3. **Monitor costs**: Starter plan is free but has limitations
4. **Scale up**: Upgrade plan as traffic increases
5. **Use render.yaml**: One-click deployment after initial setup

---

For more help, contact support or check Render documentation.
