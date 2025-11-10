const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, purchaseBook } = require('../controllers/bookController');
const { authenticate, authorizeUser } = require('../middleWare/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|epub|mobi|txt/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Error: Books must be PDF, EPUB, MOBI, or TXT files!'));
    }
});

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', authenticate, authorizeUser, upload.single('file'), createBook);
router.put('/:id', authenticate, authorizeUser, upload.single('file'), updateBook);
router.delete('/:id', authenticate, authorizeUser, deleteBook);
router.post('/:id/purchase', authenticate, authorizeUser, purchaseBook);

module.exports = router;
