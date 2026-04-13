# 🌐 DEPLOYMENT & ADVANCED SETUP GUIDE

## Environment Setup for Different Scenarios

### Development Environment (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/docedit

# JWT
JWT_SECRET=your_development_secret_key_12345

# Server
PORT=5000
NODE_ENV=development
```

### Production Environment (.env)

```env
# Database (use MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docedit

# JWT (use strong random key)
JWT_SECRET=generate_strong_random_key_with_32_characters_min

# Server
PORT=5000
NODE_ENV=production

# Logging
LOG_LEVEL=info
```

### Staging Environment (.env)

```env
# Database
MONGODB_URI=mongodb+srv://staging_user:password@cluster.mongodb.net/docedit_staging

# JWT
JWT_SECRET=your_staging_secret_key

# Server
PORT=5000
NODE_ENV=staging
```

---

## 🚀 Deployment Options

### Option 1: Heroku Deployment (Backend)

#### Step 1: Prepare Backend

```bash
cd backend

# Create Procfile
echo "web: npm start" > Procfile

# Add start script to package.json (if not present)
# "start": "node server.js"
```

#### Step 2: Create Heroku App

```bash
# Install Heroku CLI from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new app
heroku create your-docedit-backend

# Or use existing app
heroku apps:create
```

#### Step 3: Set Environment Variables

```bash
# Set all env variables
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/docedit
heroku config:set JWT_SECRET=your_production_jwt_secret_key
heroku config:set NODE_ENV=production
heroku config:set PORT=5000

# Verify
heroku config
```

#### Step 4: Deploy

```bash
# Deploy to Heroku
git push heroku main

# View logs
heroku logs --tail

# Visit your app
heroku open
```

#### Backend URL after deployment:
```
https://your-app-name.herokuapp.com
```

---

### Option 2: Railway Deployment (Backend)

#### Step 1: Create Account

- Go to: https://railway.app
- Sign up with GitHub
- Grant permissions

#### Step 2: Create New Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Select: Create new project
# Enter project name: docedit-backend
```

#### Step 3: Add MongoDB

```bash
# In Railway dashboard:
# 1. Go to your project
# 2. Click "Add" → "MongoDB"
# 3. Railway creates MONGODB_URI automatically
```

#### Step 4: Set Environment Variables

```bash
railway variables:set JWT_SECRET=your_jwt_secret
railway variables:set NODE_ENV=production
```

#### Step 5: Deploy

```bash
# Deploy
railway up

# View logs
railway logs
```

---

### Option 3: Vercel Deployment (Frontend)

#### Step 1: Prepare Frontend

```bash
cd frontend

# Build the project
npm run build

# Test build locally
npm run preview
```

#### Step 2: Create Vercel Account

- Go to: https://vercel.com
- Sign up with GitHub
- Grant permissions

#### Step 3: Import Project

```bash
# In Vercel dashboard:
# 1. Click "New Project"
# 2. Import your GitHub repository
# 3. Select root directory: frontend
```

#### Step 4: Add Environment Variables

```
VITE_API_URL=https://your-backend-url.herokuapp.com
VITE_SOCKET_URL=https://your-backend-url.herokuapp.com
```

#### Step 5: Deploy

```
# Click "Deploy"
# Vercel handles the build and deployment automatically
```

---

### Option 4: AWS Deployment

#### Backend on EC2 + RDS

```bash
# 1. Create EC2 instance (Ubuntu 20.04)
# 2. SSH into instance
# 3. Install Node.js

sudo apt update
sudo apt install nodejs npm

# 4. Clone repository
git clone your-repo-url
cd backend

# 5. Install dependencies
npm install

# 6. Set environment variables
export MONGODB_URI=your_rds_connection_string
export JWT_SECRET=your_jwt_secret
export NODE_ENV=production

# 7. Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js --name "docedit"

# 8. Setup reverse proxy with Nginx
sudo apt install nginx
# Configure Nginx to proxy to Node.js
```

#### Frontend on S3 + CloudFront

```bash
cd frontend

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### Option 5: Docker Deployment

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: docedit

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/docedit
      JWT_SECRET: your_jwt_secret
      NODE_ENV: production
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

---

## 🔒 Production Security Checklist

### Environment & Secrets
- [ ] Change JWT_SECRET to strong random key
- [ ] Store secrets in environment variables (not in code)
- [ ] Use .env.example for templates (no actual secrets)
- [ ] Enable HTTPS on all URLs
- [ ] Rotate JWT secret regularly

### Database
- [ ] Enable MongoDB authentication
- [ ] Use strong database password
- [ ] Enable encryption at rest
- [ ] Setup regular backups
- [ ] Restrict database access by IP

### API Security
- [ ] Implement rate limiting (prevent DDoS)
- [ ] Add input validation on all endpoints
- [ ] Validate file uploads if added
- [ ] Use CORS safely (whitelist specific domains)
- [ ] Add API authentication tokens

### Monitoring & Logging
- [ ] Setup error tracking (Sentry)
- [ ] Monitor server performance
- [ ] Log all authentication attempts
- [ ] Alert on unusual activity
- [ ] Track API usage

### Deployment
- [ ] Test in staging before production
- [ ] Setup automated backups
- [ ] Use database snapshots
- [ ] Implement rollback plan
- [ ] Have disaster recovery plan

---

## 📊 Monitoring & Analytics

### Sentry (Error Tracking)

```bash
# Install Sentry
npm install @sentry/node

# Backend setup (server.js)
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Google Analytics (Frontend Tracking)

```bash
npm install react-ga

# App.jsx
import ReactGA from "react-ga";

ReactGA.initialize("G-YOUR_GA_ID");
```

### Uptime Monitoring

Use services like:
- Pingdom
- UptimeRobot
- Datadog
- New Relic

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install backend dependencies
      run: cd backend && npm install
    
    - name: Run backend tests
      run: cd backend && npm test
    
    - name: Install frontend dependencies
      run: cd frontend && npm install
    
    - name: Build frontend
      run: cd frontend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      run: |
        git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## 📈 Scaling Considerations

### Database Scaling
- Use MongoDB sharding for large datasets
- Implement read replicas
- Use connection pooling
- Optimize indexes

### Application Scaling
- Use load balancers
- Run multiple backend instances
- Use CDN for static assets
- Implement caching (Redis)

### Real-time Scaling
- Socket.IO adapter for horizontal scaling
- Redis pub/sub for message broadcasting
- Multiple Socket.IO servers with load balancer

---

## 💰 Cost Estimation (Monthly)

### Cloud Deployment
- **MongoDB Atlas Free Tier:** $0 (3GB)
- **MongoDB Atlas Paid (512MB - 10GB):** $9-57
- **Heroku Dyno (Backend):** $7-50
- **Vercel (Frontend):** $0-20
- **Total (Minimal):** ~$16/month

### Approximate Costs
- Small startup: $0-50/month
- Growing app: $50-200/month
- Large scale: $200+/month

---

## 🆙 Version Updates

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest

# Major version updates (breaking changes)
npm install package-name@major-version
```

### Node.js Version Updates

```bash
# Check current version
node -v

# Use nvm to manage versions
nvm install 20
nvm use 20

# Update for production
# Update one instance, test, then roll out to others
```

---

## 📚 Useful Resources

**Deployment:**
- Heroku: https://devcenter.heroku.com
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- AWS: https://docs.aws.amazon.com

**Monitoring:**
- Sentry: https://docs.sentry.io
- DataDog: https://docs.datadoghq.com
- New Relic: https://docs.newrelic.com

**Performance:**
- CloudFlare: https://developers.cloudflare.com
- BrightData: https://cdn.brightdata.com
- AWS CloudFront: https://aws.amazon.com/cloudfront

---

## 🎯 Next Steps

1. **Test Everything Locally**
   - Run both backend and frontend
   - Test all features
   - Verify real-time sync

2. **Choose Deployment Platform**
   - Heroku (simplest)
   - Railway (alternative)
   - AWS (most control)
   - Docker (portable)

3. **Setup Staging Environment**
   - Mirror production setup
   - Test changes before production
   - Run automated tests

4. **Deploy to Production**
   - Start with minimal resources
   - Monitor performance
   - Scale as needed

5. **Setup Monitoring**
   - Error tracking (Sentry)
   - Analytics (Google Analytics)
   - Uptime monitoring
   - Performance alerts

---

## ✅ Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS enabled
- [ ] Error tracking setup
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] Disaster recovery plan ready
- [ ] Team trained on deployment
- [ ] Documentation updated
- [ ] DNS configured
- [ ] Certificate renewed
- [ ] Rollback plan documented

---

**Ready to launch to production? This guide covers everything you need!**

