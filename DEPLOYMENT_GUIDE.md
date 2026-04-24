# Deployment Guide: Render + Vercel

## Project Architecture
- **Frontend**: React + Vite (Vercel)
- **Backend**: Node.js + Express (Render)
- **Database**: Excel file (stored on Render)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Server for Deployment

Update `server/package.json`:
```json
{
  "name": "intern-server",
  "version": "1.0.0",
  "description": "Backend for CS Internship Application Platform",
  "main": "index.js",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "cashfree-pg": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5"
  }
}
```

### Step 2: Update CORS in `server/index.js`
Ensure CORS is configured to accept requests from your Vercel domain:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://your-app.vercel.app', // Your Vercel domain (update this!)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### Step 3: Create Render Account & Deploy

1. **Go to** https://render.com and sign up
2. **Connect GitHub** - Link your GitHub account
3. **Create New Service**:
   - Click "New" → "Web Service"
   - Select your GitHub repository
   - Choose the `server` directory as the root directory
   
4. **Configure Service**:
   - **Name**: `intern-server` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free (good to start)

5. **Add Environment Variables**:
   - Click "Environment" tab
   - Add from your `.env` file:
     ```
     PORT=5000
     CASHFREE_APP_ID=your_app_id_here
     CASHFREE_SECRET_KEY=your_secret_key_here
     CASHFREE_ENV=SANDBOX
     ```

6. **Deploy** - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy your Render URL: `https://your-service-name.onrender.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Client for Deployment

Update `client/vite.config.js` to use environment variables:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

### Step 2: Create `client/.env.production`

```
VITE_API_URL=https://your-render-service.onrender.com
```

### Step 3: Update API Calls in Your Components

Use environment variable in your API calls:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example API call
fetch(`${API_URL}/api/submit-application`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

### Step 4: Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to https://vercel.com and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Configure**:
   - Framework: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables**:
   - `VITE_API_URL` = `https://your-render-service.onrender.com`
6. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts and it will generate your URL
```

---

## Step 3: Connect Frontend to Backend

### In `client/src/` (wherever you make API calls):

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Example: Upload resume & payment proof
async function submitApplication(formData) {
  const response = await fetch(`${API_BASE_URL}/api/submit-application`, {
    method: 'POST',
    body: formData, // multipart/form-data
  });
  return response.json();
}
```

---

## Step 4: Verify Deployments

1. **Frontend URL**: `https://your-app.vercel.app`
2. **Backend URL**: `https://your-service.onrender.com`
3. **Test API**: Visit `https://your-service.onrender.com/api/health` (if you have a health check endpoint)

---

## Troubleshooting

### CORS Issues
If you get CORS errors:
- Update `server/index.js` with your Vercel domain
- Redeploy server: Push to GitHub and Render auto-deploys

### Database File on Render
- The `applications.xlsx` will be created in `server/database/` on first run
- File is stored in Render's ephemeral storage (resets on redeploy)
- **Solution**: Use MongoDB Atlas or a cloud database instead

### Environment Variables Not Working
- Make sure names match exactly in Vercel/Render
- Restart deployment after adding env vars

### 502 Bad Gateway
- Check server logs on Render dashboard
- Verify `PORT` environment variable is set

---

## Free Tier Limits

**Vercel Free**:
- Unlimited projects
- 100GB bandwidth/month
- Great for React apps

**Render Free**:
- 1 free web service
- Auto-sleeps after 15 min of inactivity
- Wakes up on requests (adds 30-60s startup time)
- Upgrade to Starter ($7/month) for always-on service

---

## Summary Checklist

- [ ] Create Render account & connect GitHub
- [ ] Deploy server to Render
- [ ] Add environment variables to Render
- [ ] Get Render URL
- [ ] Create Vercel account & connect GitHub
- [ ] Deploy client to Vercel
- [ ] Update `VITE_API_URL` in Vercel
- [ ] Update CORS in server code with Vercel domain
- [ ] Test frontend connecting to backend
- [ ] Share your deployed URLs!
