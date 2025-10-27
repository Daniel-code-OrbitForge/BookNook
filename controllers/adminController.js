// const User = require('../models/userModel.js');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const sendEmail = require('../utils/sendEmail.js');
// const Book = require('../models/bookModel.js');



// const getAllUser = async (req, res)=>{
//     const bookId = Number(req.params.bookId);
//     const checkBook = await Book.findByPK(bookId);
//     const {year, author} = req.query;

//     if (!checkBook) {
//     return res.status(404).json({
//       status: false,
//       message: "Could not find the book",
//       data: [],
//     });
//   }
//   const where = { bookId };
//   if (year) {
//     where.year = year;
//   }

//   if (author) {
//     where.author = author;
//   }

//   const users = await User.findAll({where});
//   if (!users){
//     return res.status(400).json({
//         message: "Retrieving Users Unsuccessful",
//         status: false,
//         data: []
//     });
//   };

//   if(users){
//     return res.status(200).json({
//         status: true,
//         message: "Users retrieved successfully",
//         data: users
//     });
//   }

// };

// //delete a user
// const deleteUser = async(req, res)=>{
//     const { userId } = req.params;
//     const user = await User.findByPk(Number(userId));
//     await user.destroy();
//     return res.status(200).json({
//         status: true,
//         message: "User deleted successfully",
//         data: []
//     })
// }

