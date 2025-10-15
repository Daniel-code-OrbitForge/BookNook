const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    
    const headers = {
        ...options.headers,
    };

    if (token && !options.isFormData) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!options.isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token && options.isFormData) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

const authAPI = {
    register: (userData) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    
    forgotPassword: (email) => apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
    
    resetPassword: (token, password) => apiCall(`/auth/reset-password/${token}`, {
        method: 'PUT',
        body: JSON.stringify({ password }),
    }),
    
    getMe: () => apiCall('/auth/me'),
};

const booksAPI = {
    getAllBooks: () => fetch(`${API_URL}/books`).then(res => res.json()),
    
    getBookById: (id) => fetch(`${API_URL}/books/${id}`).then(res => res.json()),
    
    createBook: (formData) => apiCall('/books', {
        method: 'POST',
        body: formData,
        isFormData: true,
    }),
    
    updateBook: (id, formData) => apiCall(`/books/${id}`, {
        method: 'PUT',
        body: formData,
        isFormData: true,
    }),
    
    deleteBook: (id) => apiCall(`/books/${id}`, {
        method: 'DELETE',
    }),
    
    purchaseBook: (id) => apiCall(`/books/${id}/purchase`, {
        method: 'POST',
    }),
};

const usersAPI = {
    getAllUsers: () => apiCall('/users'),
    
    getUserById: (id) => apiCall(`/users/${id}`),
    
    updateUser: (id, userData) => apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    }),
    
    deleteUser: (id) => apiCall(`/users/${id}`, {
        method: 'DELETE',
    }),
};

async function loadBooks() {
    const loadingEl = document.getElementById('loadingBooks');
    const gridEl = document.getElementById('booksGrid');
    const noBooks = document.getElementById('noBooksMessage');
    const actionsEl = document.getElementById('booksActions');
    
    try {
        const data = await booksAPI.getAllBooks();
        
        if (loadingEl) loadingEl.style.display = 'none';
        
        if (data.books && data.books.length > 0) {
            gridEl.innerHTML = data.books.map(book => `
                <div class="book-card">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p class="price">$${book.price}</p>
                    <p>${book.description}</p>
                    <div class="book-actions" id="book-actions-${book._id}">
                        <a href="${book.fileUrl}" download class="btn btn-primary btn-sm">Download</a>
                    </div>
                </div>
            `).join('');
            
            const user = getCurrentUser();
            if (user && (user.role === 'user' || user.role === 'admin')) {
                data.books.forEach(book => {
                    const actionsDiv = document.getElementById(`book-actions-${book._id}`);
                    if (actionsDiv) {
                        actionsDiv.innerHTML += `
                            <button onclick="purchaseBook('${book._id}')" class="btn btn-success btn-sm">Purchase</button>
                        `;
                    }
                });
            }
            
            if (actionsEl && user && (user.role === 'user' || user.role === 'admin')) {
                actionsEl.innerHTML = '<a href="upload.html" class="btn btn-primary">Upload Book</a>';
            }
        } else {
            if (noBooks) noBooks.style.display = 'block';
        }
    } catch (error) {
        if (loadingEl) loadingEl.style.display = 'none';
        console.error('Error loading books:', error);
    }
}

async function purchaseBook(bookId) {
    try {
        const data = await booksAPI.purchaseBook(bookId);
        alert(data.message);
    } catch (error) {
        alert(error.message || 'Failed to purchase book');
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
