# Docker Setup Guide for Vendora

Complete guide for building, running, and managing the Vendora application using Docker and Docker Compose.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Build Commands](#build-commands)
- [Run Commands](#run-commands)
- [Image Information](#image-information)
- [Troubleshooting](#troubleshooting)
- [Performance Tips](#performance-tips)
- [Security](docker-security.md) (Separate guide)

## Prerequisites

### Required
- Docker Engine 20.10+ ([Install Docker](https://docs.docker.com/engine/install/))
- Docker Compose 2.0+ (included with Docker Desktop)
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

### Verify Installation
```bash
docker --version
docker compose version
```

## Quick Start

### 1. Development Environment

```bash
# Clone repository
git clone https://github.com/semmozhiyan-dev/Vendora.git
cd Vendora

# Start all services
docker compose --env-file .env.development up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

**Access Points:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- MongoDB: localhost:27017 (internal only)

### 2. Production Environment

```bash
# Build production images
docker compose build

# Start with production env
docker compose --env-file .env.production up -d

# View running services
docker compose ps
```

## Environment Setup

### Development Environment (.env.development)

This file contains development settings with local MongoDB and test API keys.

```bash
# Backend
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://admin:admin123@mongodb:27017/vendora?authSource=admin

# Security (development values only - use real secrets in production)
JWT_SECRET=dev_secret_key_change_in_production

# Razorpay (Test keys from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_test_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=your_email@gmail.com

# Frontend
VITE_API_URL=http://localhost:5000
```

**Note:** 
- Get Gmail app-specific password from [Google Account Security](https://myaccount.google.com/apppasswords)
- Use `.env.example` files as template (never commit real credentials)

### Production Environment (.env.production)

Production settings with MongoDB Atlas and live API keys.

**IMPORTANT: Never commit .env.production with real credentials!**

```bash
# Backend
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vendora?retryWrites=true&w=majority

# Security - MUST be changed!
JWT_SECRET=<generate-strong-random-secret-with-openssl-rand-hex-32>

# Razorpay (Live keys from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email (Use production email service: SendGrid, AWS SES, etc.)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=<sendgrid-api-key>
EMAIL_FROM=noreply@yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

**Storage Methods for Production Secrets:**
- Docker Secrets (for Swarm mode)
- Environment variables from orchestrator
- Dedicated secrets management (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault)
- Do NOT store in repository or .env files

## Build Commands

### Build All Images

```bash
# Standard build (uses cache)
docker compose build

# Fresh build (no cache)
docker compose build --no-cache

# Build specific service
docker compose build backend
docker compose build frontend
```

### Build with Custom Tags

```bash
# Tag images for registry
docker build -t myregistry.azurecr.io/vendora-backend:v1.0 ./backend
docker build -t myregistry.azurecr.io/vendora-frontend:v1.0 ./frontend

# Push to registry
docker push myregistry.azurecr.io/vendora-backend:v1.0
docker push myregistry.azurecr.io/vendora-frontend:v1.0
```

### Check Build Results

```bash
# List images
docker images | grep vendora

# Inspect image
docker inspect vendora-backend:latest

# Check image size
docker images vendora-backend --format "{{.Repository}}:{{.Tag}}\t{{.Size}}"
```

## Run Commands

### Using Docker Compose (Recommended)

```bash
# Start all services in background
docker compose --env-file .env.development up -d

# Start with specific environment
docker compose --env-file .env.production up -d

# Start and view logs
docker compose up

# Stop services
docker compose down

# Stop and remove volumes (careful - deletes data!)
docker compose down -v

# Restart services
docker compose restart

# View service status
docker compose ps

# View logs
docker compose logs backend          # Backend logs
docker compose logs frontend         # Frontend logs
docker compose logs mongodb          # MongoDB logs
docker compose logs -f backend       # Follow backend logs
```

### Individual Container Commands

```bash
# Run backend container
docker run -d \
  --name vendora-backend \
  -p 5000:5000 \
  --env-file .env.development \
  vendora-backend:latest

# Run frontend container
docker run -d \
  --name vendora-frontend \
  -p 80:80 \
  vendora-frontend:latest

# Access container shell
docker exec -it vendora-backend /bin/sh
docker exec -it vendora-frontend /bin/sh

# Run command in container
docker exec vendora-backend npm start
```

### Container Cleanup

```bash
# Stop all containers
docker compose down

# Remove unused images
docker image prune

# Remove all unused resources
docker system prune

# Remove specific container
docker rm vendora-backend

# Remove specific image
docker rmi vendora-backend:latest
```

## Image Information

### Backend Image (vendora-backend)

**Base:** `node:20-slim`  
**Size:** ~349MB (virtual) / ~81MB (compressed)

**Components:**
- Node.js 20 runtime
- dumb-init (signal handling)
- Express.js API server
- MongoDB Mongoose driver
- Nodemailer for email
- Razorpay payment integration

**Health Check:** HTTP GET on port 5000 every 30 seconds

```bash
# Build backend
cd backend && docker build -t vendora-backend:latest .

# Test backend
curl http://localhost:5000/api
```

### Frontend Image (vendora-frontend)

**Build Stage:** `node:20-slim`  
**Runtime Stage:** `nginx:1.27-alpine`  
**Size:** ~141MB (virtual) / ~54MB (compressed)

**Components:**
- React 19.2 SPA
- Vite build tool
- Nginx web server
- Gzip compression
- Smart caching headers

**Features:**
- SPA routing (try_files)
- Immutable asset caching (1 year)
- HTML no-cache headers
- Gzip compression

```bash
# Build frontend
cd frontend && docker build -t vendora-frontend:latest .

# Test frontend
curl http://localhost
```

### MongoDB Image

**Base:** `mongo:latest`  
**Size:** ~640MB

**Configuration:**
- Authentication enabled (admin/admin123)
- Database: vendora
- Persistent volume: mongodb_data
- Health check enabled

## Image Information

### Backend Image (vendora-backend)

#### Problem: "Cannot find module 'nodemailer'"
```
Error: Cannot find module 'nodemailer'
```

**Solution:**
```bash
# Rebuild backend image
docker compose build --no-cache backend

# Or install locally and commit
cd backend && npm install
```

#### Problem: "EACCES: permission denied, mkdir '/app/logs'"
```
Error: EACCES: permission denied, mkdir '/app/logs'
```

**Solution:**
- Ensure Dockerfile includes: `RUN mkdir -p /app/logs && chown -R node:node /app/logs`
- Rebuild image: `docker compose build --no-cache backend`
- Restart: `docker compose up -d`

#### Problem: "MongoDB connected but no data"
```
Solution:
1. Check connection string in .env
2. Verify MongoDB is healthy: docker compose ps
3. Check logs: docker compose logs mongodb
4. Reset database: docker compose down -v && docker compose up -d
```

### Frontend Issues

#### Problem: "Cannot GET /"
```
Solution:
1. Check if frontend container is running: docker compose ps
2. View frontend logs: docker compose logs frontend
3. Verify port 80 is available: lsof -i :80
4. Restart frontend: docker compose restart frontend
```

#### Problem: "API requests failing"
```
Solution:
1. Check backend is running: docker compose logs backend
2. Verify VITE_API_URL in frontend env
3. Check backend health: curl http://localhost:5000
4. Verify internal DNS: docker exec vendora-frontend ping backend
```

### General Issues

#### Problem: "Port already in use"
```
Error: bind: address already in use
```

**Solution:**
```bash
# Find process using port
lsof -i :5000        # Backend
lsof -i :80          # Frontend
lsof -i :27017       # MongoDB

# Kill process
kill -9 <PID>

# Or use different ports
docker run -p 5001:5000 vendora-backend:latest
```

#### Problem: "Docker daemon not running"
```
Error: Cannot connect to Docker daemon
```

**Solution (Linux):**
```bash
# Start Docker service
sudo systemctl start docker

# Enable on boot
sudo systemctl enable docker
```

**Solution (macOS/Windows):**
- Open Docker Desktop application
- Wait for daemon to start

#### Problem: "Out of disk space"
```
Solution:
docker system prune -a  # Remove all unused images
docker volume prune     # Remove unused volumes
```

#### Problem: "Container keeps restarting"
```
Solution:
1. Check logs: docker compose logs <service>
2. View detailed logs: docker compose logs --follow <service>
3. Inspect container: docker inspect <container>
4. Check health: docker compose ps
```

### Network Issues

#### Problem: "Containers can't communicate"
```
Solution:
# Verify network exists
docker network ls | grep vendora

# Inspect network
docker network inspect vendora_vendora-network

# Rebuild network
docker compose down && docker compose up -d
```

#### Problem: "Can't connect to MongoDB from backend"
```
Solution:
# Check MongoDB is running
docker compose exec mongodb mongosh

# Verify connection string
# Should be: mongodb://admin:admin123@mongodb:27017/vendora?authSource=admin
```

## Performance Tips

### Memory & CPU Optimization

```bash
# Set resource limits
docker run -m 512m --cpus="0.5" vendora-backend:latest

# Check resource usage
docker stats

# Monitor performance
docker compose stats
```

### Caching Strategies

1. **Layer Caching**
   - COPY package*.json first (changes infrequently)
   - Install dependencies
   - COPY source code (changes frequently)

2. **Image Caching**
   - Use specific base image versions (not `latest`)
   - Leverage multi-stage builds
   - Remove unnecessary files in later stages

3. **Build Context**
   - Use .dockerignore to exclude files
   - Reduces build context size
   - Speeds up build process

### Build Performance

```bash
# Show build time per layer
docker compose build --progress=plain 2>&1 | grep -E '(DONE|RUN)'

# Compare old vs new build
time docker compose build --no-cache

# Clean and rebuild
docker system prune -a && docker compose build
```

### Runtime Performance

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Use compose build cache
docker compose build --progress=plain

# Parallel build
docker compose build --parallel
```

## Deployment Checklist

Before deploying to production:

- [ ] Set strong JWT_SECRET
- [ ] Use production MongoDB Atlas
- [ ] Configure production email service
- [ ] Update API keys (Razorpay, etc.)
- [ ] Set NODE_ENV=production
- [ ] Enable health checks
- [ ] Configure log aggregation
- [ ] Set up monitoring
- [ ] Test failover scenarios
- [ ] Backup database before deployment
- [ ] Document environment variables
- [ ] Set up automated backups

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Spec](https://github.com/compose-spec/compose-spec)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
- [MongoDB in Docker](https://hub.docker.com/_/mongo)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Docker logs: `docker compose logs`
3. Check GitHub Issues: [Vendora Issues](https://github.com/semmozhiyan-dev/Vendora/issues)
4. Contact team on Slack

---

**Last Updated:** May 6, 2026  
**Version:** 1.0  
**Docker Version:** 20.10+  
**Docker Compose Version:** 2.0+
