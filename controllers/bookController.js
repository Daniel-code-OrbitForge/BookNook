const Book = require('../models/bookModel');
const path = require('path');
const fs = require('fs');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('uploadedBy', 'name', 'email');
    
    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('uploadedBy', 'name', 'email');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, category, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a book file' });
    }

    const book = await Book.create({
      title,
      author,
      category,
      description,
      price,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.filename,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Book uploaded successfully',
      book,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book',
      });
    }

    const updateData = {
      title: req.body.title || book.title,
      author: req.body.author || book.author,
      category: req.body.category || book.category,
      description: req.body.description || book.description,
      price: req.body.price || book.price,
    };

    if (req.file) {
      const oldFilePath = path.join(__dirname, '..', book.fileUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      
      updateData.fileUrl = `/uploads/${req.file.filename}`;
      updateData.fileName = req.file.filename;
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book',
      });
    }

    const filePath = path.join(__dirname, '..', book.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const purchaseBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Book purchased successfully (mock checkout)',
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  purchaseBook,
};