# Deployment Quickstart Guide

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Web Interface (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js and configure settings

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` with value of your backend URL
   - Example: `https://your-backend-app.railway.app/api/v1`

4. **Deploy**
   - Vercel will automatically build and deploy your project
   - Each git push to main will trigger a new deployment

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel
```

---

## Backend Deployment

### Option 1: Railway.app (Recommended - Free Tier Available)

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Environment Variables**
   Database Setup:
   - Railway will create PostgreSQL automatically
   - It will set `DATABASE_URL` environment variable

   Additional Variables:
   - `JWT_SECRET` - Set to a strong random string (use: `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN` - Set to `24h`
   - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Railway will auto-detect NestJS
   - Deploy with: `npm run build` and `node dist/main.js`

5. **Get Backend URL**
   - Railway provides public URL: `https://your-app.railway.app`
   - Use this for `NEXT_PUBLIC_API_URL` in Vercel

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set JWT_EXPIRES_IN="24h"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Option 3: AWS EC2

1. **SSH into EC2 instance**
   ```bash
   ssh -i key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js and PostgreSQL**
   ```bash
   sudo yum update -y
   sudo yum install -y nodejs postgresql
   ```

3. **Clone repository and install**
   ```bash
   git clone <your-repo>
   cd Crud/backend
   npm install
   ```

4. **Configure `.env`** with database details and JWT secret

5. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   npm run build
   pm2 start dist/main.js --name "product-api"
   pm2 startup
   pm2 save
   ```

### Option 4: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create Apps"
3. Connect GitHub repository
4. Set Build Command: `npm run build`
5. Set Run Command: `node dist/main.js`
6. Add PostgreSQL database
7. Deploy

---

## Environment Variables Summary

### Frontend (NEXT_PUBLIC_API_URL)
```
Development:  http://localhost:3001/api/v1
Production:   https://your-backend.railway.app/api/v1
```

### Backend
```
PORT=3001
DATABASE_URL=postgresql://user:pass@host/dbname
JWT_SECRET=use-strong-random-secret
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

---

## Verification Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Backend API responds at /api/v1/auth/login
- [ ] User registration works
- [ ] User login works
- [ ] Product creation works
- [ ] Product listing works with pagination
- [ ] Product update works
- [ ] Product deletion works
- [ ] Logout works
- [ ] Protected routes redirect to login when not authenticated

---

## Troubleshooting Deployment

### Vercel: CORS Error
**Solution:** Ensure `NEXT_PUBLIC_API_URL` is set to correct backend URL

### Railway: Database connection fails
**Solution:** Ensure `DATABASE_URL` is set automatically (check Railway dashboard)

### Backend: 502 Bad Gateway
**Solution:** Check application logs, ensure node_modules installed, verify environment variables

### Frontend: Token not persisting
**Solution:** Check browser privacy settings, ensure localStorage is enabled

---

## Production Checklist

Before going live:

- [ ] Update JWT_SECRET in production (not "replace-with-secret")
- [ ] Set NODE_ENV to "production"
- [ ] Update CORS origin to production frontend URL in backend code
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test error handling
- [ ] Monitor application logs
- [ ] Set up SSL/HTTPS
- [ ] Configure custom domain (optional)

---

## Scaling Considerations

For increased traffic:

1. **Database**: Upgrade PostgreSQL plan
2. **Backend**: Use load balancer (Railway handles automatically)
3. **Frontend**: Vercel CDN handles automatically
4. **Caching**: Consider Redis for session caching
5. **Monitoring**: Set up error tracking (Sentry)
