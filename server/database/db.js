const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'applications.xlsx');

// Initialize database file if it doesn't exist
function initDatabase() {
    // Ensure database directory exists
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
        console.log('Database directory created:', DB_DIR);
    }

    if (!fs.existsSync(DB_FILE)) {
        // Create initial workbook with headers
        const workbook = XLSX.utils.book_new();
        const initialData = [{
            id: 'ID',
            name: 'Name',
            email: 'Email',
            phone: 'Phone',
            passoutYear: 'Passout Year',
            college: 'College',
            domain: 'Domain',
            skills: 'Skills',
            resumeUrl: 'Resume URL',
            paymentSessionId: 'Payment Session ID',
            cashfreeOrderId: 'Cashfree Order ID',
            paymentStatus: 'Payment Status',
            status: 'Status',
            createdAt: 'Created At'
        }];
        const worksheet = XLSX.utils.json_to_sheet(initialData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
        XLSX.writeFile(workbook, DB_FILE);
        console.log('Database file created:', DB_FILE);
    }
}

// Read all applications from Excel
function readApplications() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            console.log('Database file not found, returning empty array');
            return [];
        }
        const workbook = XLSX.readFile(DB_FILE);
        const worksheet = workbook.Sheets['Applications'];

        if (!worksheet) {
            console.log('Applications worksheet not found');
            return [];
        }

        const data = XLSX.utils.sheet_to_json(worksheet);

        // Filter out header row if it exists
        const filteredData = data.filter(row => row.id !== 'ID');

        console.log(`Read ${filteredData.length} applications from database`);
        return filteredData;
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
}

// Write applications to Excel
function writeApplications(data) {
    try {
        // Ensure we have data to write
        if (!Array.isArray(data)) {
            console.error('Data must be an array');
            return false;
        }

        const workbook = XLSX.utils.book_new();

        // If data is empty, create empty sheet with headers
        if (data.length === 0) {
            const headers = [{
                id: 'ID',
                name: 'Name',
                email: 'Email',
                phone: 'Phone',
                passoutYear: 'Passout Year',
                college: 'College',
                domain: 'Domain',
                skills: 'Skills',
                resumeUrl: 'Resume URL',
                paymentSessionId: 'Payment Session ID',
                cashfreeOrderId: 'Cashfree Order ID',
                paymentStatus: 'Payment Status',
                status: 'Status',
                createdAt: 'Created At'
            }];
            const worksheet = XLSX.utils.json_to_sheet(headers);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
        } else {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
        }

        XLSX.writeFile(workbook, DB_FILE);
        console.log(`Wrote ${data.length} applications to database`);
        return true;
    } catch (error) {
        console.error('Error writing to database:', error);
        console.error('Error details:', error.message);
        return false;
    }
}

// Create new application
function createApplication(applicationData) {
    try {
        console.log('Creating new application:', applicationData);

        const applications = readApplications();
        const newApplication = {
            id: Date.now().toString(),
            name: applicationData.name || '',
            email: applicationData.email || '',
            phone: applicationData.phone || '',
            passoutYear: applicationData.passoutYear || '',
            college: applicationData.college || '',
            domain: applicationData.domain || '',
            skills: applicationData.skills || '',
            resumeUrl: applicationData.resumeUrl || '',
            paymentSessionId: applicationData.paymentSessionId || '',
            cashfreeOrderId: applicationData.cashfreeOrderId || '',
            paymentStatus: applicationData.paymentStatus || 'PENDING',
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        applications.push(newApplication);
        const success = writeApplications(applications);

        if (success) {
            console.log('Application created successfully with ID:', newApplication.id);
        } else {
            console.error('Failed to write application to database');
        }

        return newApplication;
    } catch (error) {
        console.error('Error creating application:', error);
        throw error;
    }
}

// Get all applications
function getAllApplications() {
    return readApplications();
}

// Get application by ID
function getApplicationById(id) {
    const applications = readApplications();
    return applications.find(app => app.id === id);
}

// Update application status
function updateApplicationStatus(id, status) {
    const applications = readApplications();
    const index = applications.findIndex(app => app.id === id);

    if (index === -1) {
        return null;
    }

    applications[index].status = status;
    writeApplications(applications);
    return applications[index];
}

module.exports = {
    initDatabase,
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus
};
