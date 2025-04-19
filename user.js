// Check authentication
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = '../../index.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    if (user.role !== 'user') {
        window.location.href = '../admin/dashboard.html';
    }
}

// Run auth check when page loads
checkAuth();

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
});

// Show form function
function showForm(formType) {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    // Hide dashboard content and show form container
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.innerHTML = formTemplates[formType];

        // Add form submission handler
        const form = formContainer.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, formType));
        }

        if (formType === 'simRegistration') {
            initializeSimRegistration();
        }

        // Add cancel button handler
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                formContainer.style.display = 'none';
                if (dashboardContent) dashboardContent.style.display = 'block';
            });
        }
    }
}

// Handle form submission
function handleFormSubmit(e, formType) {
    e.preventDefault();
    
    const formData = {};
    const form = e.target;
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });
    
    // Get existing data from localStorage or initialize empty array
    const storageKey = `${formType}Data`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add new data
    existingData.push({
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    // Show success message
    alert('Form submitted successfully!');
    
    // Reset form
    form.reset();
}

// Show recent registrations
function showRecentRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const table = document.getElementById('recentRegistrations');
    
    // Sort by date (newest first)
    registrations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Get last 5 registrations
    const recentRegistrations = registrations.slice(0, 5);
    
    // Update table
    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Freelancer</th>
                <th>MPOS Code</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${recentRegistrations.map(reg => `
                <tr>
                    <td>${new Date(reg.timestamp).toLocaleDateString()}</td>
                    <td>${reg.freelancerName}</td>
                    <td>${reg.mposCode}</td>
                    <td>${reg.remarks}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Update dashboard stats
function updateDashboardStats() {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const mposData = JSON.parse(localStorage.getItem('mposRequisitionData') || '[]');
    
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('totalMpos').textContent = mposData.length;
}

// Initialize dashboard
function initializeDashboard() {
    showRecentRegistrations();
    updateDashboardStats();
}

// Add event listeners for form navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for all form navigation links
    const formLinks = document.querySelectorAll('.sidebar a[data-form]');
    formLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const formType = this.getAttribute('data-form');
            showForm(formType);
        });
    });

    // Add click handler for dashboard link
    const dashboardLink = document.querySelector('.sidebar a[href="#dashboard"]');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            const formContainer = document.getElementById('form-container');
            const dashboardContent = document.getElementById('dashboard-content');
            if (formContainer) formContainer.style.display = 'none';
            if (dashboardContent) dashboardContent.style.display = 'block';
        });
    }

    // Initialize dashboard
    initializeDashboard();
});

// Handle sidebar toggle
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Show SIM registration form
function showSimRegistration() {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.style.display = 'none';
    formContainer.style.display = 'block';
    
    formContainer.innerHTML = `
        <h2>SIM Registration Form</h2>
        <div class="form-container">
            <form id="simRegistrationForm">
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" required>
                </div>
                <div class="form-group">
                    <label for="freelancerName">Freelancer/POS Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" required>
                </div>
                <div class="form-group">
                    <label for="mposMsisdn">MPOS MSISDN</label>
                    <input type="text" id="mposMsisdn" required>
                </div>
                <div class="form-group">
                    <label for="totalSim">Total SIM Registered</label>
                    <input type="number" id="totalSim" required>
                </div>
                <div class="form-group">
                    <label for="simOnboarded">SIMCards Onboarded on MoMo</label>
                    <input type="number" id="simOnboarded" required>
                </div>
                <div class="form-group">
                    <label for="rejection">Rejection</label>
                    <select id="rejection" required>
                        <option value="none">None</option>
                        <option value="network">Network</option>
                        <option value="mpos">MPOS Issues</option>
                        <option value="documents">Documents</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="remarks">Remarks</label>
                    <select id="remarks" required>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `;
    
    document.getElementById('simRegistrationForm').addEventListener('submit', handleSimRegistration);
}

// Handle SIM registration form submission
function handleSimRegistration(e) {
    e.preventDefault();
    
    const formData = {
        date: document.getElementById('date').value,
        freelancerName: document.getElementById('freelancerName').value,
        mposCode: document.getElementById('mposCode').value,
        mposMsisdn: document.getElementById('mposMsisdn').value,
        totalSim: document.getElementById('totalSim').value,
        simOnboarded: document.getElementById('simOnboarded').value,
        rejection: document.getElementById('rejection').value,
        remarks: document.getElementById('remarks').value,
        userId: JSON.parse(localStorage.getItem('currentUser')).username,
        timestamp: new Date().toISOString()
    };
    
    // Get existing registrations
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    
    // Add new registration
    registrations.push({
        id: Date.now(),
        ...formData
    });
    
    // Save to localStorage
    localStorage.setItem('simRegData', JSON.stringify(registrations));
    
    // Show sharing options
    showSharingOptions(formData);
}

// Show sharing options
function showSharingOptions(data) {
    const formContainer = document.getElementById('form-container');
    
    const message = `
SIM Registration Details:
Date: ${data.date}
Freelancer: ${data.freelancerName}
MPOS Code: ${data.mposCode}
MSISDN: ${data.mposMsisdn}
Total SIM: ${data.totalSim}
Onboarded: ${data.simOnboarded}
Rejection: ${data.rejection}
Remarks: ${data.remarks}
    `.trim();
    
    formContainer.innerHTML = `
        <h2>Registration Successful!</h2>
        <div class="form-container">
            <p>Choose how you would like to share this information:</p>
            <div class="sharing-buttons">
                <button onclick="shareSMS('${encodeURIComponent(message)}')" class="btn btn-primary">
                    <i class="fas fa-sms"></i> Share via SMS
                </button>
                <button onclick="shareWhatsApp('${encodeURIComponent(message)}')" class="btn btn-primary">
                    <i class="fab fa-whatsapp"></i> Share via WhatsApp
                </button>
            </div>
            <button onclick="showSimRegistration()" class="btn btn-secondary">
                Register Another SIM
            </button>
        </div>
    `;
}

// Share via SMS
function shareSMS(message) {
    window.location.href = `sms:?body=${message}`;
}

// Share via WhatsApp
function shareWhatsApp(message) {
    window.open(`https://wa.me/?text=${message}`);
}

// Show registration history
function showRegistrationHistory() {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.style.display = 'none';
    formContainer.style.display = 'block';
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]')
        .filter(reg => reg.userId === currentUser.username);
    
    formContainer.innerHTML = `
        <h2>Registration History</h2>
        <div class="form-container">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Freelancer</th>
                            <th>MPOS Code</th>
                            <th>Total SIM</th>
                            <th>Onboarded</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${registrations.map(reg => `
                            <tr>
                                <td>${reg.date}</td>
                                <td>${reg.freelancerName}</td>
                                <td>${reg.mposCode}</td>
                                <td>${reg.totalSim}</td>
                                <td>${reg.simOnboarded}</td>
                                <td>
                                    <button onclick="editRegistration(${reg.id})" class="btn btn-secondary">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteRegistration(${reg.id})" class="btn btn-secondary">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    <button onclick="shareRegistration(${reg.id})" class="btn btn-secondary">
                                        <i class="fas fa-share"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Edit registration
function editRegistration(id) {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const registration = registrations.find(reg => reg.id === id);
    
    if (!registration) return;
    
    const formContainer = document.getElementById('form-container');
    
    formContainer.innerHTML = `
        <h2>Edit Registration</h2>
        <div class="form-container">
            <form id="editRegistrationForm">
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" value="${registration.date}" required>
                </div>
                <div class="form-group">
                    <label for="freelancerName">Freelancer/POS Name</label>
                    <input type="text" id="freelancerName" value="${registration.freelancerName}" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" value="${registration.mposCode}" required>
                </div>
                <div class="form-group">
                    <label for="mposMsisdn">MPOS MSISDN</label>
                    <input type="text" id="mposMsisdn" value="${registration.mposMsisdn}" required>
                </div>
                <div class="form-group">
                    <label for="totalSim">Total SIM Registered</label>
                    <input type="number" id="totalSim" value="${registration.totalSim}" required>
                </div>
                <div class="form-group">
                    <label for="simOnboarded">SIMCards Onboarded on MoMo</label>
                    <input type="number" id="simOnboarded" value="${registration.simOnboarded}" required>
                </div>
                <div class="form-group">
                    <label for="rejection">Rejection</label>
                    <select id="rejection" required>
                        <option value="none" ${registration.rejection === 'none' ? 'selected' : ''}>None</option>
                        <option value="network" ${registration.rejection === 'network' ? 'selected' : ''}>Network</option>
                        <option value="mpos" ${registration.rejection === 'mpos' ? 'selected' : ''}>MPOS Issues</option>
                        <option value="documents" ${registration.rejection === 'documents' ? 'selected' : ''}>Documents</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="remarks">Remarks</label>
                    <select id="remarks" required>
                        <option value="excellent" ${registration.remarks === 'excellent' ? 'selected' : ''}>Excellent</option>
                        <option value="good" ${registration.remarks === 'good' ? 'selected' : ''}>Good</option>
                        <option value="fair" ${registration.remarks === 'fair' ? 'selected' : ''}>Fair</option>
                        <option value="poor" ${registration.remarks === 'poor' ? 'selected' : ''}>Poor</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
            </form>
        </div>
    `;
    
    document.getElementById('editRegistrationForm').addEventListener('submit', (e) => handleEditRegistration(e, id));
}

// Handle edit registration
function handleEditRegistration(e, id) {
    e.preventDefault();
    
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const index = registrations.findIndex(reg => reg.id === id);
    
    if (index === -1) return;
    
    const formData = {
        date: document.getElementById('date').value,
        freelancerName: document.getElementById('freelancerName').value,
        mposCode: document.getElementById('mposCode').value,
        mposMsisdn: document.getElementById('mposMsisdn').value,
        totalSim: document.getElementById('totalSim').value,
        simOnboarded: document.getElementById('simOnboarded').value,
        rejection: document.getElementById('rejection').value,
        remarks: document.getElementById('remarks').value,
        userId: registrations[index].userId,
        timestamp: new Date().toISOString()
    };
    
    registrations[index] = {
        ...registrations[index],
        ...formData
    };
    
    localStorage.setItem('simRegData', JSON.stringify(registrations));
    showRegistrationHistory();
}

// Delete registration
function deleteRegistration(id) {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const filteredRegistrations = registrations.filter(reg => reg.id !== id);
    
    localStorage.setItem('simRegData', JSON.stringify(filteredRegistrations));
    showRegistrationHistory();
}

// Share registration
function shareRegistration(id) {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const registration = registrations.find(reg => reg.id === id);
    
    if (registration) {
        showSharingOptions(registration);
    }
}

// SIM Registration Form Template
const simRegForm = `
    <div class="form-container">
        <h2><i class="fas fa-sim-card"></i> SIM Registration</h2>
        <form id="simRegForm">
            <div class="form-group">
                <label for="fullName"><i class="fas fa-user"></i> Full Name</label>
                <input type="text" id="fullName" required>
            </div>
            <div class="form-group">
                <label for="phoneNumber"><i class="fas fa-phone"></i> Phone Number</label>
                <input type="tel" id="phoneNumber" required>
            </div>
            <div class="form-group">
                <label for="idType"><i class="fas fa-id-card"></i> ID Type</label>
                <select id="idType" required>
                    <option value="national_id">National ID</option>
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                </select>
            </div>
            <div class="form-group">
                <label for="idNumber"><i class="fas fa-hashtag"></i> ID Number</label>
                <input type="text" id="idNumber" required>
            </div>
            <div class="form-group">
                <label for="address"><i class="fas fa-map-marker-alt"></i> Address</label>
                <textarea id="address" required></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Save Registration
                </button>
                <button type="button" class="btn btn-secondary" id="cancelBtn">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </form>
    </div>
    <div class="table-container">
        <h3><i class="fas fa-table"></i> Registered SIMs</h3>
        <div class="table-actions">
            <button class="btn btn-primary" id="exportWhatsApp">
                <i class="fab fa-whatsapp"></i> Export to WhatsApp
            </button>
            <button class="btn btn-primary" id="exportSMS">
                <i class="fas fa-sms"></i> Export to SMS
            </button>
        </div>
        <table id="simRegTable">
            <thead>
                <tr>
                    <th><i class="fas fa-user"></i> Full Name</th>
                    <th><i class="fas fa-phone"></i> Phone Number</th>
                    <th><i class="fas fa-id-card"></i> ID Type</th>
                    <th><i class="fas fa-hashtag"></i> ID Number</th>
                    <th><i class="fas fa-calendar"></i> Registration Date</th>
                    <th><i class="fas fa-cogs"></i> Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- SIM registrations will be populated here -->
            </tbody>
        </table>
    </div>
`;

// Add SIM Registration to form templates
formTemplates.simRegistration = simRegForm;

// Handle SIM Registration form submission
function handleSimRegSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now().toString(),
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value,
        address: document.getElementById('address').value,
        registrationDate: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('currentUser')).id
    };
    
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    registrations.push(formData);
    localStorage.setItem('simRegData', JSON.stringify(registrations));
    
    // Reset form and reload table
    e.target.reset();
    loadSimRegistrations();
    alert('SIM Registration saved successfully!');
}

// Load SIM Registrations
function loadSimRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userRegistrations = registrations.filter(reg => reg.userId === currentUser.id);
    
    const tbody = document.querySelector('#simRegTable tbody');
    if (tbody) {
        tbody.innerHTML = userRegistrations.map(reg => `
            <tr>
                <td>${reg.fullName}</td>
                <td>${reg.phoneNumber}</td>
                <td>${reg.idType.replace('_', ' ').toUpperCase()}</td>
                <td>${reg.idNumber}</td>
                <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-sim" data-id="${reg.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-sim" data-id="${reg.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-sim').forEach(btn => {
            btn.addEventListener('click', () => editSimReg(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-sim').forEach(btn => {
            btn.addEventListener('click', () => deleteSimReg(btn.dataset.id));
        });
    }
}

// Edit SIM Registration
function editSimReg(id) {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const registration = registrations.find(reg => reg.id === id);
    
    if (registration) {
        document.getElementById('fullName').value = registration.fullName;
        document.getElementById('phoneNumber').value = registration.phoneNumber;
        document.getElementById('idType').value = registration.idType;
        document.getElementById('idNumber').value = registration.idNumber;
        document.getElementById('address').value = registration.address;
        
        // Update form submission to handle edit
        const form = document.getElementById('simRegForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const updatedData = {
                ...registration,
                fullName: document.getElementById('fullName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                idType: document.getElementById('idType').value,
                idNumber: document.getElementById('idNumber').value,
                address: document.getElementById('address').value
            };
            
            const index = registrations.findIndex(reg => reg.id === id);
            registrations[index] = updatedData;
            localStorage.setItem('simRegData', JSON.stringify(registrations));
            
            form.reset();
            form.onsubmit = handleSimRegSubmit;
            loadSimRegistrations();
            alert('SIM Registration updated successfully!');
        };
    }
}

// Delete SIM Registration
function deleteSimReg(id) {
    if (confirm('Are you sure you want to delete this registration?')) {
        const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
        const filteredRegistrations = registrations.filter(reg => reg.id !== id);
        localStorage.setItem('simRegData', JSON.stringify(filteredRegistrations));
        loadSimRegistrations();
        alert('SIM Registration deleted successfully!');
    }
}

// Export to WhatsApp
function exportToWhatsApp() {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userRegistrations = registrations.filter(reg => reg.userId === currentUser.id);
    
    const text = userRegistrations.map(reg => 
        `Name: ${reg.fullName}\nPhone: ${reg.phoneNumber}\nID Type: ${reg.idType}\nID Number: ${reg.idNumber}\nAddress: ${reg.address}\nDate: ${new Date(reg.registrationDate).toLocaleDateString()}\n\n`
    ).join('');
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

// Export to SMS
function exportToSMS() {
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userRegistrations = registrations.filter(reg => reg.userId === currentUser.id);
    
    const text = userRegistrations.map(reg => 
        `Name: ${reg.fullName}\nPhone: ${reg.phoneNumber}\nID Type: ${reg.idType}\nID Number: ${reg.idNumber}\nAddress: ${reg.address}\nDate: ${new Date(reg.registrationDate).toLocaleDateString()}\n\n`
    ).join('');
    
    // This will open the default SMS app with the text
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
}

// Initialize SIM Registration
function initializeSimRegistration() {
    const form = document.getElementById('simRegForm');
    if (form) {
        form.addEventListener('submit', handleSimRegSubmit);
    }
    
    const exportWhatsAppBtn = document.getElementById('exportWhatsApp');
    if (exportWhatsAppBtn) {
        exportWhatsAppBtn.addEventListener('click', exportToWhatsApp);
    }
    
    const exportSMSBtn = document.getElementById('exportSMS');
    if (exportSMSBtn) {
        exportSMSBtn.addEventListener('click', exportToSMS);
    }
    
    loadSimRegistrations();
} 