// const Book = require("../models/bookModel");

// // const createBook = async(bookid, title, author, about, publishedyear) => {
// //     const book = new Book({ bookid, title, author, about, publishedyear });
// //   const result = await book.save();
// //   console.log("Book Created:", result);
// // };

// const createBook = async (req, res) => {
//   try {
//     const { bookid, title, publishedyear, author,  } = req.body;
    
//     const file = req.file;
//     const filePath = file ? file.path : null;
//     const fileName = file ? file.filename : null;

//     const book = await Book.create({
//       title,
//       publishedyear,
//       author,
//       bookid,
//       about,
//       filePath,
//       fileName
//     });

//     if (!book) {
//       return res.status(400).json({
//         status: false,
//         message: "Could not create the book",
//         data: null,
//       });
//     }

//     return res.status(201).json({
//       status: true,
//       message: "Book created successfully",
//       data: book,
//     });
//   } catch (error) {
//     console.error("Error creating book:", error.message);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createBook
// };
