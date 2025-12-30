#  Deployment Guide - AlHaneef Collection

This guide will help you deploy both the Frontend and Backend of the AlHaneef Collection e-commerce platform.

##  Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment)
2. [Backend Deployment (Render)](#backend-deployment)
3. [Database Setup (Aiven MySQL)](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Alternative Deployment Options](#alternatives)

---

##  Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository: `AlHanif-Collection`
   - Select the `Frontend` folder as the root directory

3. **Configure Build Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   `
   VITE_API_URL=https://your-backend-url.onrender.com/api
   `

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment
   - Get your live URL: `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

`ash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to Frontend folder
cd Frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
`

---

##  Backend Deployment (Render)

### Step 1: Setup Free MySQL Database (Aiven)

1. **Create Aiven Account**
   - Go to [aiven.io](https://aiven.io)
   - Sign up for free (no credit card required)

2. **Create MySQL Service**
   - Click "Create Service"
   - Select "MySQL"
   - Choose "Free" plan
   - Select a region close to you
   - Click "Create Service"

3. **Get Database Credentials**
   - Wait 5-10 minutes for database to be ready
   - Copy:
     - Host
     - Port
     - User
     - Password
     - Database Name

### Step 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +"  "Web Service"
   - Connect your GitHub repository: `AlHanif-Collection`
   - Select the `Backend` folder

3. **Configure Service**
   - **Name**: `alhaneef-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

4. **Add Environment Variables** (in Render Dashboard)
   `
   PORT=9001
   DB_HOST=your-aiven-mysql-host
   DB_USER=your-aiven-mysql-user
   DB_PASSWORD=your-aiven-mysql-password
   DB_NAME=alhaneef_collection
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   `

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Get your backend URL: `https://alhaneef-backend.onrender.com`

6. **Seed Database** (Run once after deployment)
   - In Render Dashboard, go to "Shell"
   - Run: `node utils/seedData.js`

### Step 3: Update Frontend Environment Variable

1. Go back to Vercel Dashboard
2. Update `VITE_API_URL` with your Render backend URL:
   `
   VITE_API_URL=https://alhaneef-backend.onrender.com/api
   `
3. Redeploy frontend (automatic or manual trigger)

---

##  Database Setup

### Aiven MySQL (Free - Recommended)
- **Pros**: Free forever, 1GB storage, automatic backups
- **Cons**: Limited to 1 database
- **URL**: [aiven.io](https://aiven.io)

### Alternative: Planetscale (MySQL)
- **Pros**: Free tier with 5GB storage
- **Cons**: Requires credit card
- **URL**: [planetscale.com](https://planetscale.com)

### Alternative: Railway
- **Pros**: Easy setup,  free credit
- **Cons**: Credit required after free tier
- **URL**: [railway.app](https://railway.app)

---

##  Environment Variables Reference

### Frontend (.env)
`env
VITE_API_URL=https://your-backend-url.onrender.com/api
`

### Backend (.env)
`env
# Server
PORT=9001
NODE_ENV=production

# Database (from Aiven)
DB_HOST=mysql-xxxxx.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your-secure-password
DB_NAME=alhaneef_collection

# JWT
JWT_SECRET=your-super-secret-jwt-key-should-be-at-least-32-characters-long
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app
`

---

##  Alternative Deployment Options

### Frontend Alternatives

**Netlify** (Alternative to Vercel)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

**GitHub Pages** (Not Recommended - API issues)
- Only supports static sites
- Cannot handle dynamic routing properly
- Backend API calls may have CORS issues

### Backend Alternatives

**Railway** (Alternative to Render)
1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add MySQL database (built-in)
4. Set environment variables
5. Deploy

**Vercel Serverless** (For simple APIs)
- Good for serverless functions
- May have cold start issues
- Database connections can be tricky

**Heroku** (Paid only now)
- No longer offers free tier
- Requires credit card

---

##  Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] MySQL database created on Aiven
- [ ] Database seeded with sample data
- [ ] Environment variables configured
- [ ] Frontend connected to backend API
- [ ] Test user registration
- [ ] Test admin login (admin@alhaneef.com / admin123)
- [ ] Test product listing on shop page
- [ ] Test add to cart functionality
- [ ] Test checkout process

---

##  Troubleshooting

### Frontend shows "API Error"
- Check if backend URL is correct in VITE_API_URL
- Ensure backend is running (check Render dashboard)
- Check browser console for CORS errors

### Backend "Cannot connect to database"
- Verify database credentials in Render environment variables
- Check if Aiven MySQL service is running
- Ensure database name is correct

### Products not showing on Shop page
- Run seed script: `node utils/seedData.js` in Render Shell
- Check if database has products (use Aiven console)

### CORS Errors
- Add your frontend URL to CORS whitelist in backend
- Check FRONTEND_URL environment variable in Render

---

##  Support

If you encounter any issues:
1. Check Render logs (Backend issues)
2. Check Vercel logs (Frontend issues)
3. Verify all environment variables are set correctly
4. Ensure database connection is working

---

##  Success!

Once deployed, your app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`

Share your deployed site with the world! 

---

**Made with  by Ali Haider**
