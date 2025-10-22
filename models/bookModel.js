const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookid:{type: String, required:true, unique:true, index:true},
    title: {type: String, required:true, index:true},
    author: {type: String, required:true, unique:true},
    about: {type: String, required:true, index:true, null:false},
    publishedyear: {type: String, required:true, index:true}
}, {timestamps: true}
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book
