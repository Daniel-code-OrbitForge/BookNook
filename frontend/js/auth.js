function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function updateNavbar() {
    const authLinks = document.getElementById('authLinks');
    const user = getCurrentUser();
    
    if (authLinks) {
        if (user) {
            authLinks.innerHTML = `
                <span style="margin-right: 1rem;">Hi, ${user.name}</span>
                ${user.role === 'admin' ? '<a href="admin-dashboard.html">Dashboard</a>' : ''}
                ${user.role === 'user' || user.role === 'admin' ? '<a href="upload.html">Upload</a>' : ''}
                <a href="#" onclick="logout()" class="btn-login">Logout</a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="login.html" class="btn-login">Login</a>
                <a href="register.html" class="btn-register">Register</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function saveUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function showMessage(elementId, message, isError = false) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.className = `message ${isError ? 'error' : 'success'}`;
        messageEl.textContent = message;
    }
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const data = await authAPI.login({ email, password });
            saveUserData(data.token, data.user);
            showMessage('message', 'Login successful! Redirecting...');
            
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'books.html';
                }
            }, 1000);
        } catch (error) {
            showMessage('message', error.message, true);
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('message', 'Passwords do not match', true);
            return;
        }
        
        try {
            const data = await authAPI.register({ name, email, password });
            saveUserData(data.token, data.user);
            showMessage('message', 'Registration successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'books.html';
            }, 1000);
        } catch (error) {
            showMessage('message', error.message, true);
        }
    });
}

const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        try {
            const data = await authAPI.forgotPassword(email);
            showMessage('message', data.message);
            forgotPasswordForm.reset();
        } catch (error) {
            showMessage('message', error.message, true);
        }
    });
}

const resetPasswordForm = document.getElementById('resetPasswordForm');
if (resetPasswordForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        showMessage('message', 'Invalid reset token', true);
    }
    
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('message', 'Passwords do not match', true);
            return;
        }
        
        try {
            const data = await authAPI.resetPassword(token, password);
            showMessage('message', 'Password reset successful! Redirecting to login...');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            showMessage('message', error.message, true);
        }
    });
}

function checkAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        alert('You do not have permission to access this page');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    
    if (window.location.pathname.includes('admin-dashboard.html')) {
        checkAuth('admin');
    } else if (window.location.pathname.includes('upload.html')) {
        checkAuth();
    }
});
