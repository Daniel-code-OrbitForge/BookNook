const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        if (tabName === 'books' && !document.getElementById('adminBooksGrid').innerHTML) {
            loadAdminBooks();
        } else if (tabName === 'users' && !document.getElementById('usersTable').innerHTML) {
            loadUsers();
        }
    });
});

async function loadAdminBooks() {
    const loadingEl = document.getElementById('loadingAdminBooks');
    const gridEl = document.getElementById('adminBooksGrid');
    
    try {
        const data = await booksAPI.getAllBooks();
        loadingEl.style.display = 'none';
        
        if (data.books && data.books.length > 0) {
            gridEl.innerHTML = data.books.map(book => `
                <div class="book-card">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p class="price">$${book.price}</p>
                    <p>${book.description}</p>
                    <p><small>Uploaded by: ${book.uploadedBy?.name || 'Unknown'}</small></p>
                    <div class="book-actions">
                        <a href="${book.fileUrl}" download class="btn btn-primary btn-sm">Download</a>
                        <button onclick="editBook('${book._id}')" class="btn btn-warning btn-sm">Edit</button>
                        <button onclick="deleteBookConfirm('${book._id}')" class="btn btn-danger btn-sm">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            gridEl.innerHTML = '<p class="no-books">No books available</p>';
        }
    } catch (error) {
        loadingEl.style.display = 'none';
        gridEl.innerHTML = `<p class="error">Error loading books: ${error.message}</p>`;
    }
}

async function loadUsers() {
    const loadingEl = document.getElementById('loadingUsers');
    const tableEl = document.getElementById('usersTable');
    
    try {
        const data = await usersAPI.getAllUsers();
        loadingEl.style.display = 'none';
        
        if (data.users && data.users.length > 0) {
            tableEl.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.users.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td>
                                    <button onclick="deleteUserConfirm('${user._id}')" class="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableEl.innerHTML = '<p class="no-books">No users found</p>';
        }
    } catch (error) {
        loadingEl.style.display = 'none';
        tableEl.innerHTML = `<p class="error">Error loading users: ${error.message}</p>`;
    }
}

const modal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

async function editBook(bookId) {
    try {
        const data = await booksAPI.getBookById(bookId);
        const book = data.book;
        
        document.getElementById('editBookId').value = book._id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editCategory').value = book.category;
        document.getElementById('editPrice').value = book.price;
        document.getElementById('editDescription').value = book.description;
        
        modal.style.display = 'block';
    } catch (error) {
        alert('Error loading book: ' + error.message);
    }
}

const editBookForm = document.getElementById('editBookForm');
if (editBookForm) {
    editBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookId = document.getElementById('editBookId').value;
        const formData = new FormData();
        formData.append('title', document.getElementById('editTitle').value);
        formData.append('author', document.getElementById('editAuthor').value);
        formData.append('category', document.getElementById('editCategory').value);
        formData.append('price', document.getElementById('editPrice').value);
        formData.append('description', document.getElementById('editDescription').value);
        
        try {
            await booksAPI.updateBook(bookId, formData);
            modal.style.display = 'none';
            loadAdminBooks();
            alert('Book updated successfully');
        } catch (error) {
            alert('Error updating book: ' + error.message);
        }
    });
}

async function deleteBookConfirm(bookId) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            await booksAPI.deleteBook(bookId);
            loadAdminBooks();
            alert('Book deleted successfully');
        } catch (error) {
            alert('Error deleting book: ' + error.message);
        }
    }
}

async function deleteUserConfirm(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await usersAPI.deleteUser(userId);
            loadUsers();
            alert('User deleted successfully');
        } catch (error) {
            alert('Error deleting user: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdminBooks();
});
