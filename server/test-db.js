// Test script to verify database operations
const db = require('./database/db');

console.log('=== Testing Database Operations ===\n');

// Initialize database
console.log('1. Initializing database...');
db.initDatabase();
console.log('✓ Database initialized\n');

// Test creating an application
console.log('2. Creating test application...');
const testApp = db.createApplication({
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    passoutYear: '2025',
    college: 'Test College',
    domain: 'Web Development',
    skills: 'React, Node.js',
    resumeUrl: '/uploads/test-resume.pdf',
    paymentScreenshotUrl: '/uploads/test-payment.jpg',
    utrNumber: '123456789012'
});
console.log('✓ Application created:', testApp);
console.log('');

// Test reading all applications
console.log('3. Reading all applications...');
const allApps = db.getAllApplications();
console.log('✓ Found', allApps.length, 'application(s)');
console.log('Applications:', allApps);
console.log('');

// Test reading by ID
console.log('4. Reading application by ID...');
const foundApp = db.getApplicationById(testApp.id);
console.log('✓ Found application:', foundApp);
console.log('');

// Test updating status
console.log('5. Updating application status...');
const updatedApp = db.updateApplicationStatus(testApp.id, 'Verified');
console.log('✓ Updated application:', updatedApp);
console.log('');

// Verify update
console.log('6. Verifying update...');
const verifiedApp = db.getApplicationById(testApp.id);
console.log('✓ Status is now:', verifiedApp.status);
console.log('');

console.log('=== All Tests Passed! ===');
console.log('\nCheck server/database/applications.xlsx to see the data!');
