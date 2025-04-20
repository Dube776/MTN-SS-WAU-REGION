// Check authentication
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    if (user.role !== 'admin') {
        window.location.href = 'dashboard.html';
    }
}

// Run auth check when page loads
checkAuth();

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// User Management Form Template
const userManagementForm = `
    <div class="user-management">
        <h2><i class="fas fa-user-plus"></i> User Management</h2>
        <div class="user-form">
            <form id="userForm">
                <input type="hidden" id="userId">
                <div class="form-group">
                    <label for="username"><i class="fas fa-user"></i> Username</label>
                    <input type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label for="email"><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password"><i class="fas fa-lock"></i> Password</label>
                    <input type="password" id="password">
                </div>
                <div class="form-group">
                    <label for="role"><i class="fas fa-user-tag"></i> Role</label>
                    <select id="role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save User
                    </button>
                    <button type="button" class="btn btn-secondary" id="cancelBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
        <div class="users-table">
            <table id="usersTable">
                <thead>
                    <tr>
                        <th><i class="fas fa-user"></i> Username</th>
                        <th><i class="fas fa-envelope"></i> Email</th>
                        <th><i class="fas fa-user-tag"></i> Role</th>
                        <th><i class="fas fa-calendar"></i> Created</th>
                        <th><i class="fas fa-cogs"></i> Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Users will be populated here -->
                </tbody>
            </table>
        </div>
    </div>
`;

// Show user management form
function showUserManagement() {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.innerHTML = userManagementForm;
        
        // Load users
        loadUsers();
        
        // Add form submission handler
        const form = document.getElementById('userForm');
        if (form) {
            form.addEventListener('submit', handleUserFormSubmit);
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

// Load users into the table
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tbody = document.querySelector('#usersTable tbody');
    
    if (tbody) {
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', () => editUser(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', () => deleteUser(btn.dataset.id));
        });
    }
}

// Handle user form submission
function handleUserFormSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (userId) {
        // Edit existing user
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                username,
                email,
                role,
                ...(password && { password }) // Only update password if provided
            };
        }
    } else {
        // Add new user
        users.push({
            id: Date.now().toString(),
            username,
            email,
            password,
            role,
            createdAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reset form and reload users
    e.target.reset();
    document.getElementById('userId').value = '';
    loadUsers();
    
    // Show success message
    alert('User saved successfully!');
}

// Edit user
function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        document.getElementById('password').value = ''; // Clear password field
    }
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        loadUsers();
        alert('User deleted successfully!');
    }
}

// Show analytics
function showAnalytics() {
    const registrations = JSON.parse(localStorage.getItem('simRegistrations') || '[]');
    
    // Calculate total registrations
    document.getElementById('totalRegistrations').textContent = registrations.length;
    
    // Calculate registrations by freelancer
    const freelancerStats = {};
    registrations.forEach(reg => {
        freelancerStats[reg.freelancerName] = (freelancerStats[reg.freelancerName] || 0) + 1;
    });
    
    // Display freelancer stats
    const freelancerTable = document.getElementById('freelancerStats');
    freelancerTable.innerHTML = `
        <tr>
            <th>Freelancer</th>
            <th>Registrations</th>
        </tr>
    `;
    
    Object.entries(freelancerStats).forEach(([name, count]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${count}</td>
        `;
        freelancerTable.appendChild(row);
    });
}

// Initialize dashboard
function initializeDashboard() {
    // Add event listeners for form navigation
    const formLinks = document.querySelectorAll('.sidebar a[data-form]');
    formLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const formType = this.getAttribute('data-form');
            if (formType.startsWith('user') || formType.startsWith('role') || formType.startsWith('permission')) {
                showAdminManagement(formType);
            } else {
                showForm(formType);
            }
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
            updateDashboardStats();
        });
    }

    // Add logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Initialize dashboard stats
    updateDashboardStats();
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
});

// Form templates
const formTemplates = {
    mposRequisition: `
        <h2>New MPOS Requisition Form</h2>
        <div class="form-container">
            <form id="mposRequisitionForm">
                <h3>Requester Details</h3>
                <div class="form-group">
                    <label for="tscName">TSC Name</label>
                    <input type="text" id="tscName" required>
                </div>
                <div class="form-group">
                    <label for="reqDate">Date</label>
                    <input type="date" id="reqDate" required>
                </div>
                <div class="form-group">
                    <label for="reqSignature">Signature</label>
                    <input type="text" id="reqSignature" required>
                </div>

                <h3>Approver Details</h3>
                <div class="form-group">
                    <label for="rsmName">RSM Name</label>
                    <input type="text" id="rsmName" required>
                </div>
                <div class="form-group">
                    <label for="appDate">Date</label>
                    <input type="date" id="appDate" required>
                </div>
                <div class="form-group">
                    <label for="appSignature">Signature</label>
                    <input type="text" id="appSignature" required>
                </div>

                <h3>Form Details</h3>
                <div class="form-group">
                    <label for="freelancerName">Freelancer/POS Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="location">Location/Market</label>
                    <input type="text" id="location" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" required>
                </div>
                <div class="form-group">
                    <label for="msisdn">MSISDN</label>
                    <input type="text" id="msisdn" required>
                </div>

                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    mposTracking: `
        <h2>MPOS Tracking of New Deployment</h2>
        <div class="form-container">
            <form id="mposTrackingForm">
                <div class="form-group">
                    <label for="freelancerName">Freelancer's Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" required>
                </div>
                <div class="form-group">
                    <label for="tsc">TSC</label>
                    <input type="text" id="tsc" required>
                </div>
                <div class="form-group">
                    <label for="dealerTerritory">Dealer Territory</label>
                    <input type="text" id="dealerTerritory" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    offlineMpos: `
        <h2>MPOS Codes Offline Registration</h2>
        <div class="form-container">
            <form id="offlineMposForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" required>
                </div>
                <div class="form-group">
                    <label for="msisdn">MSISDN</label>
                    <input type="text" id="msisdn" required>
                </div>
                <div class="form-group">
                    <label for="territory">Territory</label>
                    <input type="text" id="territory" required>
                </div>
                <div class="form-group">
                    <label for="tsc">TSC</label>
                    <input type="text" id="tsc" required>
                </div>
                <div class="form-group">
                    <label for="rsm">RSM</label>
                    <input type="text" id="rsm" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    wauSouth: `
        <h2>Tronic Wau South Freelancers</h2>
        <div class="form-container">
            <form id="wauSouthForm">
                <div class="form-group">
                    <label for="freelancerName">Freelancer/POS Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="mposId">MPOS ID</label>
                    <input type="text" id="mposId" required>
                </div>
                <div class="form-group">
                    <label for="mposMsisdn">MPOS MSISDN</label>
                    <input type="text" id="mposMsisdn" required>
                </div>
                <div class="form-group">
                    <label for="territory">Territory</label>
                    <input type="text" id="territory" required>
                </div>
                <div class="form-group">
                    <label for="region">Region</label>
                    <input type="text" id="region" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    wauNorth: `
        <h2>Tronic Wau North Freelancers</h2>
        <div class="form-container">
            <form id="wauNorthForm">
                <div class="form-group">
                    <label for="freelancerName">Freelancer/POS Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="mposId">MPOS ID</label>
                    <input type="text" id="mposId" required>
                </div>
                <div class="form-group">
                    <label for="mposMsisdn">MPOS MSISDN</label>
                    <input type="text" id="mposMsisdn" required>
                </div>
                <div class="form-group">
                    <label for="territory">Territory</label>
                    <input type="text" id="territory" required>
                </div>
                <div class="form-group">
                    <label for="region">Region</label>
                    <input type="text" id="region" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    gsmMomo: `
        <h2>One GSM and One MoMo Addition</h2>
        <div class="form-container">
            <form id="gsmMomoForm">
                <div class="form-group">
                    <label for="freelancerName">Freelancer's Name</label>
                    <input type="text" id="freelancerName" required>
                </div>
                <div class="form-group">
                    <label for="mposCode">MPOS Code</label>
                    <input type="text" id="mposCode" required>
                </div>
                <div class="form-group">
                    <label for="territory">Territory</label>
                    <input type="text" id="territory" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    timeTable: `
        <h2>General Timetable for both Wau North and South</h2>
        <div class="form-container">
            <form id="timeTableForm">
                <div class="form-group">
                    <label for="day">Day</label>
                    <select id="day" required>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="territory">Territory</label>
                    <input type="text" id="territory" required>
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" required>
                </div>
                <div class="form-group">
                    <label for="teamLeader">Team Leader</label>
                    <input type="text" id="teamLeader" required>
                </div>
                <div class="form-group">
                    <label for="contact">Contact</label>
                    <input type="text" id="contact" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    flexenAddition: `
        <h2>Number for Flexen Addition</h2>
        <div class="form-container">
            <form id="flexenAdditionForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="code">Code</label>
                    <input type="text" id="code" required>
                </div>
                <div class="form-group">
                    <label for="mposNumber">MPOS Number</label>
                    <input type="text" id="mposNumber" required>
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    `,
    simReg: `
        <h2>SIM Registration Details</h2>
        <div class="form-container">
            <form id="simRegForm">
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
    `,
    userManagement: userManagementForm
};

// Show form function
function showForm(formType) {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.innerHTML = formTemplates[formType];

        // Add form submission handler
        const form = formContainer.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, formType));
        }

        // Add cancel button handler
        const cancelBtn = formContainer.querySelector('.btn-secondary');
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
        if (input.type !== 'button' && input.type !== 'submit') {
            formData[input.id] = input.value;
        }
    });
    
    // Get existing data from localStorage or initialize empty array
    const storageKey = `${formType}Data`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add new data
    existingData.push({
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    // Show success message
    alert('Form submitted successfully!');
    
    // Reset form
    form.reset();
    
    // Update dashboard stats
    updateDashboardStats();
}

// Update dashboard stats
function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const mposData = JSON.parse(localStorage.getItem('mposRequisitionData') || '[]');
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('totalMpos').textContent = mposData.length;
    
    // Update recent users table
    const tbody = document.querySelector('#recentUsers tbody');
    if (tbody) {
        tbody.innerHTML = users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
    }
}

// Admin Management Form Templates
const adminManagementForms = {
    userManagement: `
        <div class="admin-management">
            <h2><i class="fas fa-users"></i> User Management</h2>
            <div class="user-form">
                <form id="userForm">
                    <input type="hidden" id="userId">
                    <div class="form-group">
                        <label for="username"><i class="fas fa-user"></i> Username</label>
                        <input type="text" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password"><i class="fas fa-lock"></i> Password</label>
                        <input type="password" id="password">
                    </div>
                    <div class="form-group">
                        <label for="role"><i class="fas fa-user-tag"></i> Role</label>
                        <select id="role" required>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save User
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelBtn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
            <div class="users-table">
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th><i class="fas fa-user"></i> Username</th>
                            <th><i class="fas fa-envelope"></i> Email</th>
                            <th><i class="fas fa-user-tag"></i> Role</th>
                            <th><i class="fas fa-calendar"></i> Created</th>
                            <th><i class="fas fa-cogs"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Users will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `,
    roleManagement: `
        <div class="admin-management">
            <h2><i class="fas fa-user-tag"></i> Role Management</h2>
            <div class="role-form">
                <form id="roleForm">
                    <input type="hidden" id="roleId">
                    <div class="form-group">
                        <label for="roleName"><i class="fas fa-tag"></i> Role Name</label>
                        <input type="text" id="roleName" required>
                    </div>
                    <div class="form-group">
                        <label for="roleDescription"><i class="fas fa-info-circle"></i> Description</label>
                        <textarea id="roleDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-key"></i> Permissions</label>
                        <div class="permissions-list">
                            <!-- Permissions will be populated here -->
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Role
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelRoleBtn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
            <div class="roles-table">
                <table id="rolesTable">
                    <thead>
                        <tr>
                            <th><i class="fas fa-tag"></i> Role Name</th>
                            <th><i class="fas fa-info-circle"></i> Description</th>
                            <th><i class="fas fa-users"></i> Users</th>
                            <th><i class="fas fa-cogs"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Roles will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `,
    permissionManagement: `
        <div class="admin-management">
            <h2><i class="fas fa-key"></i> Permission Management</h2>
            <div class="permission-form">
                <form id="permissionForm">
                    <input type="hidden" id="permissionId">
                    <div class="form-group">
                        <label for="permissionName"><i class="fas fa-key"></i> Permission Name</label>
                        <input type="text" id="permissionName" required>
                    </div>
                    <div class="form-group">
                        <label for="permissionDescription"><i class="fas fa-info-circle"></i> Description</label>
                        <textarea id="permissionDescription" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Permission
                        </button>
                        <button type="button" class="btn btn-secondary" id="cancelPermissionBtn">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
            <div class="permissions-table">
                <table id="permissionsTable">
                    <thead>
                        <tr>
                            <th><i class="fas fa-key"></i> Permission Name</th>
                            <th><i class="fas fa-info-circle"></i> Description</th>
                            <th><i class="fas fa-user-tag"></i> Roles</th>
                            <th><i class="fas fa-cogs"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Permissions will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `
};

// Show admin management form
function showAdminManagement(formType) {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.innerHTML = adminManagementForms[formType];
        
        // Load data based on form type
        switch(formType) {
            case 'userManagement':
                loadUsers();
                setupUserForm();
                break;
            case 'roleManagement':
                loadRoles();
                setupRoleForm();
                break;
            case 'permissionManagement':
                loadPermissions();
                setupPermissionForm();
                break;
        }
        
        // Add cancel button handler
        const cancelBtn = document.getElementById(`cancel${formType.charAt(0).toUpperCase() + formType.slice(1)}Btn`);
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                formContainer.style.display = 'none';
                if (dashboardContent) dashboardContent.style.display = 'block';
            });
        }
    }
}

// Setup user form
function setupUserForm() {
    const form = document.getElementById('userForm');
    if (form) {
        form.addEventListener('submit', handleUserFormSubmit);
    }
}

// Setup role form
function setupRoleForm() {
    const form = document.getElementById('roleForm');
    if (form) {
        form.addEventListener('submit', handleRoleFormSubmit);
    }
}

// Setup permission form
function setupPermissionForm() {
    const form = document.getElementById('permissionForm');
    if (form) {
        form.addEventListener('submit', handlePermissionFormSubmit);
    }
}

// Handle role form submission
function handleRoleFormSubmit(e) {
    e.preventDefault();
    
    const roleId = document.getElementById('roleId').value;
    const roleName = document.getElementById('roleName').value;
    const roleDescription = document.getElementById('roleDescription').value;
    
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    
    if (roleId) {
        // Edit existing role
        const index = roles.findIndex(r => r.id === roleId);
        if (index !== -1) {
            roles[index] = {
                ...roles[index],
                name: roleName,
                description: roleDescription
            };
        }
    } else {
        // Add new role
        roles.push({
            id: Date.now().toString(),
            name: roleName,
            description: roleDescription,
            createdAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('roles', JSON.stringify(roles));
    
    // Reset form and reload roles
    e.target.reset();
    document.getElementById('roleId').value = '';
    loadRoles();
    
    // Show success message
    alert('Role saved successfully!');
}

// Handle permission form submission
function handlePermissionFormSubmit(e) {
    e.preventDefault();
    
    const permissionId = document.getElementById('permissionId').value;
    const permissionName = document.getElementById('permissionName').value;
    const permissionDescription = document.getElementById('permissionDescription').value;
    
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    
    if (permissionId) {
        // Edit existing permission
        const index = permissions.findIndex(p => p.id === permissionId);
        if (index !== -1) {
            permissions[index] = {
                ...permissions[index],
                name: permissionName,
                description: permissionDescription
            };
        }
    } else {
        // Add new permission
        permissions.push({
            id: Date.now().toString(),
            name: permissionName,
            description: permissionDescription,
            createdAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('permissions', JSON.stringify(permissions));
    
    // Reset form and reload permissions
    e.target.reset();
    document.getElementById('permissionId').value = '';
    loadPermissions();
    
    // Show success message
    alert('Permission saved successfully!');
}

// Load roles
function loadRoles() {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const tbody = document.querySelector('#rolesTable tbody');
    
    if (tbody) {
        tbody.innerHTML = roles.map(role => `
            <tr>
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td>${getUsersWithRole(role.id).length}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-role" data-id="${role.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-role" data-id="${role.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-role').forEach(btn => {
            btn.addEventListener('click', () => editRole(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-role').forEach(btn => {
            btn.addEventListener('click', () => deleteRole(btn.dataset.id));
        });
    }
}

// Load permissions
function loadPermissions() {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const tbody = document.querySelector('#permissionsTable tbody');
    
    if (tbody) {
        tbody.innerHTML = permissions.map(permission => `
            <tr>
                <td>${permission.name}</td>
                <td>${permission.description}</td>
                <td>${getRolesWithPermission(permission.id).length}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-permission" data-id="${permission.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-permission" data-id="${permission.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-permission').forEach(btn => {
            btn.addEventListener('click', () => editPermission(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-permission').forEach(btn => {
            btn.addEventListener('click', () => deletePermission(btn.dataset.id));
        });
    }
}

// Get users with a specific role
function getUsersWithRole(roleId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter(user => user.role === roleId);
}

// Get roles with a specific permission
function getRolesWithPermission(permissionId) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.filter(role => role.permissions && role.permissions.includes(permissionId));
}

// Edit role
function editRole(roleId) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const role = roles.find(r => r.id === roleId);
    
    if (role) {
        document.getElementById('roleId').value = role.id;
        document.getElementById('roleName').value = role.name;
        document.getElementById('roleDescription').value = role.description;
    }
}

// Edit permission
function editPermission(permissionId) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const permission = permissions.find(p => p.id === permissionId);
    
    if (permission) {
        document.getElementById('permissionId').value = permission.id;
        document.getElementById('permissionName').value = permission.name;
        document.getElementById('permissionDescription').value = permission.description;
    }
}

// Delete role
function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        const filteredRoles = roles.filter(r => r.id !== roleId);
        localStorage.setItem('roles', JSON.stringify(filteredRoles));
        loadRoles();
        alert('Role deleted successfully!');
    }
}

// Delete permission
function deletePermission(permissionId) {
    if (confirm('Are you sure you want to delete this permission?')) {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
        const filteredPermissions = permissions.filter(p => p.id !== permissionId);
        localStorage.setItem('permissions', JSON.stringify(filteredPermissions));
        loadPermissions();
        alert('Permission deleted successfully!');
    }
}

// Update form templates
formTemplates = {
    ...formTemplates,
    ...adminManagementForms
};

// Show form function
function showForm(formType) {
    const formContainer = document.getElementById('form-container');
    const dashboardContent = document.getElementById('dashboard-content');
    
    if (dashboardContent) dashboardContent.style.display = 'none';
    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.innerHTML = formTemplates[formType];

        // Add form submission handler
        const form = formContainer.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => handleFormSubmit(e, formType));
        }

        // Add cancel button handler
        const cancelBtn = formContainer.querySelector('.btn-secondary');
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
        if (input.type !== 'button' && input.type !== 'submit') {
            formData[input.id] = input.value;
        }
    });
    
    // Get existing data from localStorage or initialize empty array
    const storageKey = `${formType}Data`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add new data
    existingData.push({
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(existingData));
    
    // Show success message
    alert('Form submitted successfully!');
    
    // Reset form
    form.reset();
    
    // Update dashboard stats
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
            updateDashboardStats();
        });
    }
});

// Update dashboard stats
function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const registrations = JSON.parse(localStorage.getItem('simRegData') || '[]');
    const mposData = JSON.parse(localStorage.getItem('mposRequisitionData') || '[]');
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('totalMpos').textContent = mposData.length;
    
    // Update recent users table
    const tbody = document.querySelector('#recentUsers tbody');
    if (tbody) {
        tbody.innerHTML = users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `).join('');
    }
} 
