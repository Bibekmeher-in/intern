# 🚀 Quick Deployment Guide - Render & Vercel

## 📋 Prerequisites
- [ ] GitHub account with your code pushed
- [ ] Render account (free at render.com)
- [ ] Vercel account (free at vercel.com)

---

## **STEP 1: Deploy Backend to Render (5 minutes)**

### 1.1 Create Render Account
1. Go to https://render.com
2. Click "Sign Up"
3. Connect your GitHub account

### 1.2 Deploy Your Server
1. Click **New** → **Web Service**
2. Select your `intern` GitHub repository
3. Fill in the form:
   - **Name**: `intern-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free (or Starter for always-on)
   - **Root Directory**: `server`

### 1.3 Add Environment Variables
1. Go to **Environment** tab in Render dashboard
2. Add these variables:
   ```
   PORT=5000
   CLIENT_URL=https://your-app.vercel.app  (update after deploying frontend)
   CASHFREE_APP_ID=TEST10344483bfff18ba6a319cf83fd338444301
   CASHFREE_SECRET_KEY=cfsk_ma_test_048f07fcf81ec4ba725832bbadabec39_12ed44fb
   CASHFREE_ENV=SANDBOX
   ```

### 1.4 Deploy
1. Click **Create Web Service**
2. Wait 2-3 minutes for deployment
3. Copy your URL: **`https://your-service-name.onrender.com`** ⭐ Save this!

---

## **STEP 2: Deploy Frontend to Vercel (5 minutes)**

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "Continue with GitHub"

### 2.2 Deploy Your Client
1. Click **Add New** → **Project**
2. Import your `intern` repository
3. Fill in the form:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Add Environment Variables
1. Before deploying, go to **Environment Variables**
2. Add this variable:
   ```
   VITE_API_URL=https://your-render-url.onrender.com
   ```
   (Replace with your actual Render URL from Step 1.4)

### 2.4 Deploy
1. Click **Deploy**
2. Wait 1-2 minutes
3. Your site is live at **`https://your-app.vercel.app`** ✅

---

## **STEP 3: Connect Frontend to Backend**

### 3.1 Update Render (IMPORTANT!)
1. Go back to Render dashboard
2. Go to your `intern-server` service
3. Go to **Environment** tab
4. Update `CLIENT_URL` with your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
5. Render auto-redeploys (watch the status)

### 3.2 Test the Connection
1. Open your Vercel URL
2. Try submitting a test application
3. Check if it works! 🎉

---

## **Testing Checklist**

- [ ] Backend is running on Render
- [ ] Frontend loads from Vercel
- [ ] Can click "Apply" on frontend
- [ ] Can fill out the application form
- [ ] Payment flow works
- [ ] Excel file updates in backend
- [ ] Application is created successfully

---

## **Troubleshooting**

### ❌ "Failed to fetch" Error
**Problem**: Frontend can't connect to backend
**Solution**: 
- Check `VITE_API_URL` is set in Vercel env vars
- Redeploy Vercel after changing env vars
- Verify Render URL is correct

### ❌ CORS Error
**Problem**: "Access to XMLHttpRequest blocked by CORS"
**Solution**:
- Update `CLIENT_URL` in Render with your Vercel domain
- Redeploy Render
- Wait 30 seconds for restart

### ❌ 502 Bad Gateway
**Problem**: Render returning 502 error
**Solution**:
- Check Render logs for errors
- Make sure all env vars are set
- Restart the service manually

### ❌ Vercel Build Failed
**Problem**: Deployment fails in Vercel
**Solution**:
- Check build logs in Vercel dashboard
- Make sure `npm run build` works locally
- Check for TypeScript/syntax errors

---

## **Environment Variables Reference**

### **Server (.env on Render)**
```
PORT=5000
CLIENT_URL=https://your-app.vercel.app
CASHFREE_APP_ID=your_key
CASHFREE_SECRET_KEY=your_secret
CASHFREE_ENV=SANDBOX
```

### **Client (Vercel Dashboard)**
```
VITE_API_URL=https://your-service.onrender.com
```

---

## **Local Testing Before Deployment**

Test locally to make sure everything works:

```bash
# Terminal 1: Backend
cd server
npm install
npm start

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

Visit `http://localhost:5173` and test the full flow.

---

## **Free Tier Limitations**

| Platform | Free Tier Details |
|----------|------------------|
| **Render** | Spins down after 15 mins of inactivity (adds 30s startup) |
| **Vercel** | Unlimited free tier, 100GB bandwidth/month |
| **Upgrade** | Render Starter: $7/month (always-on) |

---

## **After Deployment**

1. ✅ Share your live URL with others
2. 📊 Monitor logs in Render & Vercel dashboards
3. 🔄 To redeploy, just push to GitHub
4. 🚀 Both platforms auto-deploy on git push

---

## **Need Help?**

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Check logs in dashboard → Logs/Build tab

Enjoy your live website! 🎉
