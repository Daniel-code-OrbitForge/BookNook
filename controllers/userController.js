// const User = require('../models/userModel.js');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const sendEmail = require('../utils/sendEmail.js');
// const Book = require('../models/bookModel.js');


// // dotenv.config();

// //get user profile
// const userProfile = async (req, res)=>{
//     return res.status(200).json({
//         message: "user profile retrieved successfully",
//         status: true,
//         data: req.user
//     })
// } 

// //update a user
// const updateUser = async(req, res)=>{
//     const {userID} = req.params;
//     const user = await User.findbyPK(Number(userID));
//     if (!user){
//         return res.status(400).json({
//             status: false,
//             message: "Search Failed",
//             data: []
//         })
//     }
//     await user.update(req.body);

//     return res.status(200).json({
//     status: true,
//     message: "user updated successfully",
//     data: user,
//   });
// }


















// // const createUser = async (req, res)=> {
// //     const {email, password, username, location} = req.body;
// //     const checkEmail = await User.findOne({email});

// //     if (checkEmail) {
// //     return res.status(404).json({
// //       status: false,
// //       message: "Email has been used",
// //       data: [],
// //     });
// //   }
// //   // Create user (password will be hashed via pre-save hook)
// //     const hashed_password = await bcrypt.hash(password, 10);

// //   const user = await User.create({ 
// //     email, 
// //     username,
// //     location,
// //     user_UUID:crypto.randomUUID,
// //     password: hashed_password });
  
// //   if (!user) {
// //     return res.status(400).json({
// //       status: false,
// //       message: "Could not create the user",
// //       data: [],
// //     });
// //   }
// // //  Generate JWT token
// //     const token = jwt.sign(
// //       { id: user._id, email: user.email },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '7d' }
// //     );
// //     sendEmail(email, "Welcome to Book Reviews", "Thank you for signing up!");

// //     return res.status(201).json({
// //     status: true,
// //     message: "user created successfully",
// //     data: {user, token},
// //   });
// // }

// // //login a user
// // const loginUser = async (req, res)=>{
// //     const {email, password} = req.body;
// //     const user = await User.findOne({email, password})
    
// //     if(!user){
// //         return res.status(404).json({
// //             status: false,
// //             message: "Invalid email or password",
// //             data: [],
// //         })
// //     }
// //     const isMatch = await user.comparePassword();
// //     if(!isMatch) return res.status(401).json({error:"Invalid Password"})

// //         res.status(200).json({
// //             Message:"Loggin Successfully",
// //             status: true,
// //             data: token,
// //         });
// // };

