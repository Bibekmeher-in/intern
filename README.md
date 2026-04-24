# TechBridge - Internship Application Platform

A full-stack internship application platform for Computer Science students. Students can apply for internships without authentication, pay via UPI, and track their application status.

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js
- **Database**: Excel/XLSX (Google Sheets compatible)
- **File Storage**: Local storage

## Project Structure

```
intern/
├── client/                 # React frontend (deploy to Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Apply.jsx
│   │   │   └── Success.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Express backend (deploy to Render)
│   ├── uploads/           # File storage
│   ├── database/
│   │   ├── db.js          # Database operations
│   │   └── applications.xlsx  # Excel database (auto-created)
│   ├── index.js
│   └── package.json
├── SPEC.md
└── README.md
```

## Features

1. **Home Page** - Display 6 internship domains with domain selection modal
2. **Application Form** - Multi-step form (Personal Details → Resume → Payment)
3. **Payment via UPI** - QR code, UTR number + screenshot upload
4. **Success Page** - Confirmation message
5. **Excel Database** - All data stored in `applications.xlsx` (Google Sheets compatible)

## Google Sheets Integration

The application data is stored in an Excel file (`applications.xlsx`) that can be easily:
- Downloaded from your server
- Uploaded to Google Drive/Sheets for viewing and analysis
- Shared with your team
- Exported to CSV or other formats

To sync with Google Sheets:
1. Download `server/database/applications.xlsx` from your server
2. Upload to Google Drive
3. Open with Google Sheets
4. Set up automatic sync using Google Apps Script (optional)

## Prerequisites

- Node.js (v18+)

## Local Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Start backend:

```bash
npm start
```

The Excel database file (`applications.xlsx`) will be created automatically in the `server/database/` folder.

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Deployment Guide

### Step 1: Deploy Backend (Render)

1. **Push code to GitHub**
   - Create a new repository
   - Push the `server` folder or entire project

2. **Create Render Account**
   - Go to https://render.com and sign up

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the branch (main/master)

4. **Configure Settings**
   - Name: `techbridge-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

5. **Set Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - `PORT`: 5000 (optional, defaults to 5000)

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://techbridge-backend.onrender.com`)

### Step 2: Database Setup

The application uses an Excel file (`applications.xlsx`) as the database, which is automatically created when the server starts. This file is:
- Compatible with Google Sheets (you can upload it to Google Drive)
- Easy to view and edit in Excel, Google Sheets, or LibreOffice
- Stored in `server/database/applications.xlsx`

To view/manage data:
1. Download the `applications.xlsx` file from your server
2. Upload to Google Sheets or open in Excel
3. View, filter, and export data as needed

### Step 3: Deploy Frontend (Vercel)

1. **Create GitHub Repository**
   - Push the entire project to GitHub

2. **Import to Vercel**
   - Go to https://vercel.com and sign up
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure**
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL`: Your Render backend URL (e.g., `https://techbridge-backend.onrender.com`)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 4: Update Frontend Config

In `client/src/pages/Apply.jsx`, update the API URL if needed:

```javascript
// For production, this will come from Vite env var
const API_URL = import.meta.env.VITE_API_URL || ''
```

---

## Configuration

### Update Company Details

**1. UPI Payment Details** (`client/src/pages/Apply.jsx`):
```javascript
const UPI_ID = 'yourname@upi'  // Change to your UPI ID
const AMOUNT = 1999             // Change your amount
```

**2. QR Code** (`client/src/pages/Apply.jsx`):
```javascript
const QR_CODE_URL = 'https://your-qr-image-url.jpg'
```
- Upload your QR code to any image host (ImgBB, Imgur, etc.)
- Or put image in `client/public/` and use `/qr-code.png`

**3. Company Name** (already set to "TechBridge"):
- Navbar and footer in `client/src/pages/Home.jsx`
- Benefits section title
- CTA section

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/apply | Submit application |
| GET | /api/applications | Get all applications |
| GET | /api/applications/:id | Get single application |
| PATCH | /api/applications/:id | Update status |
| GET | /api/health | Health check |

---

## Troubleshooting

1. **CORS Error**: Ensure backend has CORS enabled (already configured in server/index.js)

2. **API Not Found**: Check that VITE_API_URL is set correctly in Vercel

3. **Database File Not Found**: The Excel file is created automatically. Ensure the server has write permissions to the `database` folder

4. **File Upload Issues**: Render has 100MB limit - if you need larger files, consider using Cloudinary

5. **Viewing Data**: Download `server/database/applications.xlsx` and open in Excel or upload to Google Sheets

---

## License

MIT