const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database/db');
require('dotenv').config();
const { Cashfree, CFEnvironment } = require('cashfree-pg');

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration for Production & Development
const allowedOrigins = [
  'http://localhost:3000',      // Local development (old port)
  'http://localhost:5173',      // Local development (Vite default)
  'https://localhost:3000',
  'https://localhost:5173',
  process.env.CLIENT_URL,       // Production Vercel URL from env var
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize database
db.initDatabase();
console.log('Excel database initialized');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDF files are allowed'));
  }
});

// API Routes

// POST /api/apply - Submit new application
app.post('/api/apply', upload.fields([
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received application submission');

    const {
      name,
      email,
      phone,
      passoutYear,
      college,
      domain,
      skills,
      cashfreeOrderId,
      paymentSessionId
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !passoutYear || !college || !domain) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.resume) {
      console.log('Validation failed: Missing resume');
      return res.status(400).json({ message: 'Resume is required' });
    }

    if (!cashfreeOrderId || !paymentSessionId) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const resumeUrl = `/uploads/${req.files.resume[0].filename}`;

    console.log('Creating application with data:', {
      name,
      email,
      phone,
      cashfreeOrderId
    });

    // Create new application
    const application = db.createApplication({
      name,
      email,
      phone,
      passoutYear,
      college,
      domain,
      skills: skills || '',
      resumeUrl,
      cashfreeOrderId,
      paymentSessionId,
      paymentStatus: 'SUCCESS'
    });

    console.log('Application created successfully:', application.id);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application.id
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error while submitting application', error: error.message });
  }
});

// POST /api/payment/create-order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;

    let request = {
      "order_amount": amount || 1999.00,
      "order_currency": "INR",
      "customer_details": {
        "customer_id": phone || name.replace(/\s/g, '').substring(0, 10),
        "customer_name": name,
        "customer_email": email,
        "customer_phone": phone
      },
      "order_meta": {
        "return_url": "http://localhost:5173/success?order_id={order_id}"
      }
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.json(response.data);
  } catch (error) {
    console.error('Create Order Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create Cashfree order' });
  }
});

// POST /api/payment/verify
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { orderId } = req.body;
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

    const isPaid = response.data.some(payment => payment.payment_status === 'SUCCESS');

    if (isPaid) {
      res.json({ verified: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ verified: false, message: "Payment pending or failed" });
    }
  } catch (error) {
    console.error('Verify Order Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// GET /api/applications - Get all applications (admin)
app.get('/api/applications', async (req, res) => {
  try {
    const applications = db.getAllApplications();
    // Sort by createdAt descending
    applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// GET /api/applications/:id - Get single application
app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = db.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
  }
});

// PATCH /api/applications/:id - Update application status
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = db.updateApplicationStatus(req.params.id, status);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      message: `Application ${status.toLowerCase()}`,
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CS Internship Application Server is running',
    status: 'active',
    availableEndpoints: {
      health: '/api/health',
      apply: 'POST /api/apply',
      payment: {
        createOrder: 'POST /api/payment/create-order',
        verify: 'POST /api/payment/verify'
      },
      applications: 'GET /api/applications'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'Excel/XLSX' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using Excel file as database');
});
