# 📌 Important Configuration for Your Project

## Your Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│          🌍 FRONTEND (Vercel)                          │
│     React + Vite + Tailwind CSS                        │
│  https://your-app.vercel.app                           │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS Requests (REST API)
                 │
┌────────────────▼────────────────────────────────────────┐
│          🔌 BACKEND (Render)                           │
│     Node.js + Express                                  │
│  https://your-service.onrender.com                     │
│                                                         │
│  ┌──────────────────────────────────┐                 │
│  │ 📁 File Storage                  │                 │
│  │ - Resumes (uploads/)             │                 │
│  │ - Payment Screenshots (uploads/) │                 │
│  │ - Excel Database (database/)     │                 │
│  └──────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Configuration Points

### 1. **Environment Variables - Frontend (Vercel Dashboard)**

Add this in Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-render-service.onrender.com
```

This tells your React app where to send API requests.

---

### 2. **Environment Variables - Backend (Render Dashboard)**

Add these in Render service settings → Environment:

```
PORT=5000
CLIENT_URL=https://your-app.vercel.app
CASHFREE_APP_ID=TEST10344483bfff18ba6a319cf83fd338444301
CASHFREE_SECRET_KEY=cfsk_ma_test_048f07fcf81ec4ba725832bbadabec39_12ed44fb
CASHFREE_ENV=SANDBOX
```

---

### 3. **Auto-Deployment Setup**

Both Render and Vercel automatically deploy when you push to GitHub:

```bash
# Just push your code
git add .
git commit -m "Update: fix bug or add feature"
git push origin main

# ✅ Vercel auto-deploys (30 seconds)
# ✅ Render auto-deploys (1-2 minutes)
```

---

## 🚨 Important: Excel Database on Render

Your project uses Excel as a database:

```
server/database/applications.xlsx ← Stores all applications
```

### Considerations:

- ✅ **Works for**: Small projects, learning, testing
- ❌ **Problem**: File data is **ephemeral** on Render (deleted when instance restarts)
- 💾 **Solution for Production**:
  - Use MongoDB Atlas (free tier available)
  - Use Supabase PostgreSQL (free tier available)
  - Use Firebase (free tier available)

---

## 🔐 API Endpoints

Your backend provides these endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/apply` | Submit application |
| POST | `/api/payment/create-order` | Create payment order |
| POST | `/api/payment/verify` | Verify payment |
| GET | `/uploads/:filename` | Get uploaded files |

---

## 🔄 How It Works After Deployment

### User Flow:
1. User visits your Vercel URL
2. Clicks "Apply"
3. Fills form + uploads resume
4. Clicks "Pay Now"
5. Payment gateway (Cashfree) handles payment
6. Your backend receives payment confirmation
7. Application saved to `applications.xlsx`
8. User sees "Success" page

### Behind the Scenes:
```
Vercel (Frontend)
    ↓ (sends POST request)
Render (Backend)
    ↓ (processes & saves to file)
applications.xlsx
    ↓ (you can download & view)
Google Sheets (optional - you can import)
```

---

## 📊 Monitoring & Logs

### Check Backend Logs (Render):
1. Go to https://render.com
2. Select your service
3. Click "Logs" tab
4. See real-time activity

### Check Frontend Logs (Vercel):
1. Go to https://vercel.com
2. Select your project
3. Click "Deployments" tab
4. Click latest deployment for details

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Can navigate through pages
- [ ] Can view internship domains
- [ ] Can click "Apply" for a domain
- [ ] Form loads correctly
- [ ] File upload works
- [ ] Payment flow starts
- [ ] After payment, success page shows
- [ ] Data appears in `applications.xlsx`

---

## 🛠 Updating Your Code

To update your code:

```bash
# Make changes locally
# Test thoroughly

# Commit and push
git add .
git commit -m "Describe your changes"
git push origin main

# Wait for auto-deployment
# Vercel: ~30 seconds
# Render: ~1-2 minutes

# Test the live site
```

---

## 💡 Pro Tips

1. **Always test locally first**:
   ```bash
   cd server && npm start
   # In another terminal
   cd client && npm run dev
   ```

2. **Check environment variables are set** before deployment

3. **Use Render logs to debug** any issues

4. **Free tier Render spins down after 15 mins** - upgrade to Starter ($7/mo) for always-on

5. **Download your Excel file regularly** as backup:
   - Go to `https://your-render-url.onrender.com/uploads/applications.xlsx`

---

## 🎯 Next Steps

1. Create Render + Vercel accounts
2. Follow **QUICK_DEPLOY.md** guide
3. Push your code
4. Deploy both services
5. Test end-to-end
6. Share your live URL! 🎉

---

## ❓ FAQ

**Q: How do I update my code?**
A: Push to GitHub, both platforms auto-deploy.

**Q: How do I download the Excel file?**
A: Access: `https://your-render-url.onrender.com/uploads/applications.xlsx`

**Q: Will I lose data if Render restarts?**
A: Yes, on free tier. Consider migrating to a database for production.

**Q: Can I use a custom domain?**
A: Yes, both Render and Vercel support custom domains (paid feature).

**Q: How much does it cost?**
A: Free to start! Upgrade Render ($7/mo) for better uptime.
