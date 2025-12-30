#  Quick Deployment Steps

## Deploy in 3 Easy Steps!

### Step 1: Deploy Frontend to Vercel (5 minutes)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub
2. Click **"Add New Project"**
3. Import **"AlHanif-Collection"** repository
4. Configure:
   - Root Directory: **Frontend**
   - Framework: **Vite**
   - Environment Variable: **VITE_API_URL** = (leave empty for now)
5. Click **"Deploy"**
6. Copy your Vercel URL (e.g., `https://alhaneef-collection.vercel.app`)

### Step 2: Setup Database on Aiven (10 minutes)

1. Go to **[aiven.io](https://aiven.io)** and create free account
2. Create new **MySQL** service (Free plan)
3. Wait 5-10 minutes for database to initialize
4. Copy these credentials:
   - Host
   - Port  
   - User
   - Password
   - Database name

### Step 3: Deploy Backend to Render (10 minutes)

1. Go to **[render.com](https://render.com)** and sign in with GitHub
2. Click **"New+"**  **"Web Service"**
3. Connect **"AlHanif-Collection"** repository
4. Configure:
   - Root Directory: **Backend**
   - Build Command: **npm install**
   - Start Command: **node index.js**
5. Add Environment Variables (from Step 2):
   `
   PORT=9001
   DB_HOST=[from Aiven]
   DB_USER=[from Aiven]
   DB_PASSWORD=[from Aiven]
   DB_NAME=alhaneef_collection
   JWT_SECRET=my-super-secret-jwt-key-should-be-32-characters
   NODE_ENV=production
   FRONTEND_URL=[Your Vercel URL from Step 1]
   `
6. Click **"Create Web Service"**
7. After deployment, go to **Shell** tab and run:
   `
   node utils/seedData.js
   `
8. Copy your Render URL (e.g., `https://alhaneef-backend.onrender.com`)

### Step 4: Connect Frontend to Backend

1. Go back to **Vercel Dashboard**
2. Go to your project  **Settings**  **Environment Variables**
3. Update **VITE_API_URL**:
   `
   https://alhaneef-backend.onrender.com/api
   `
4. Go to **Deployments**  Click **"Redeploy"**

##  Done! Your App is Live!

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

###  Test Your Deployment

1. Visit your frontend URL
2. Go to Shop page - should see products
3. Try to Sign Up / Sign In
4. Test Admin Login:
   - Email: `admin@alhaneef.com`
   - Password: `admin123`

---

**Need Help?** Check the full **DEPLOYMENT.md** guide for detailed instructions and troubleshooting!

**Deployment Time**: ~25-30 minutes total
**Cost**:  (100% Free!)
