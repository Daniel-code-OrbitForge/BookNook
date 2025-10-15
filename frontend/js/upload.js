const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('file', document.getElementById('file').files[0]);
        
        const submitBtn = uploadForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';
        
        try {
            const data = await booksAPI.createBook(formData);
            showMessage('message', data.message);
            uploadForm.reset();
            
            setTimeout(() => {
                window.location.href = 'books.html';
            }, 1500);
        } catch (error) {
            showMessage('message', error.message, true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Upload Book';
        }
    });
}
