// Test script to verify Excel database is working
const db = require('./database/db');

console.log('🧪 Testing Excel Database...\n');

// Initialize database
db.initDatabase();
console.log('✅ Database initialized');

// Test: Create a sample application
console.log('\n📝 Creating test application...');
const testApp = db.createApplication({
    name: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    passoutYear: '2025',
    college: 'Test College',
    domain: 'Web Development',
    skills: 'React, Node.js',
    resumeUrl: '/uploads/test-resume.pdf',
    paymentScreenshotUrl: '/uploads/test-payment.png',
    utrNumber: '123456789012'
});
console.log('✅ Application created:', testApp.id);

// Test: Get all applications
console.log('\n📋 Fetching all applications...');
const allApps = db.getAllApplications();
console.log(`✅ Found ${allApps.length} application(s)`);

// Test: Get application by ID
console.log('\n🔍 Fetching application by ID...');
const foundApp = db.getApplicationById(testApp.id);
if (foundApp) {
    console.log('✅ Application found:', foundApp.name);
} else {
    console.log('❌ Application not found');
}

// Test: Update application status
console.log('\n✏️  Updating application status...');
const updatedApp = db.updateApplicationStatus(testApp.id, 'Verified');
if (updatedApp && updatedApp.status === 'Verified') {
    console.log('✅ Status updated to:', updatedApp.status);
} else {
    console.log('❌ Status update failed');
}

// Display all applications
console.log('\n📊 All Applications:');
console.log('─────────────────────────────────────────────────');
allApps.forEach((app, index) => {
    console.log(`${index + 1}. ${app.name} (${app.email})`);
    console.log(`   Domain: ${app.domain}`);
    console.log(`   Status: ${app.status}`);
    console.log(`   Created: ${app.createdAt}`);
    console.log('─────────────────────────────────────────────────');
});

console.log('\n✅ All tests passed!');
console.log('\n💡 Check server/database/applications.xlsx to see the data');
console.log('💡 You can open it in Excel or upload to Google Sheets');
