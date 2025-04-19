// Default user credentials
const users = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
    },
    user: {
        username: 'user',
        password: 'user123',
        role: 'user'
    }
};

// Check if user is already logged in
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'admin') {
            window.location.href = 'pages/admin/dashboard.html';
        } else {
            window.location.href = 'pages/user/dashboard.html';
        }
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'pages/admin/dashboard.html';
        } else {
            window.location.href = 'pages/user/dashboard.html';
        }
    } else {
        alert('Invalid username or password');
    }
});

// Initialize default admin user if none exists
function initializeDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (!users.some(u => u.username === 'admin')) {
        users.push({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Run initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeDefaultAdmin();
}); 