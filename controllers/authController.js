import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../services/email.service.js"; // optional


dotenv.config();

export const registerUser = async (req, res)=> {
    const {email, password, username, location} = req.body;
    const checkEmail = await User.findOne({email});

    if (checkEmail) {
    return res.status(404).json({
      status: false,
      message: "Email has been used",
      data: [],
    });
  }
  // Create user (password will be hashed via pre-save hook)
    const hashed_password = await bcrypt.hash(password, 10);

  const user = await User.create({ 
    email, 
    username,
    location,
    user_UUID:crypto.randomUUID,
    password: hashed_password });
  
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "Could not create the user",
      data: [],
    });
  }
//  Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    sendEmail(email, "Welcome to Book Reviews", "Thank you for signing up!");

    return res.status(201).json({
    status: true,
    message: "user created successfully",
    data: {user, token},
  });
}

//login a user
export const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email, password})
    
    if(!user){
        return res.status(404).json({
            status: false,
            message: "Invalid email or password",
            data: [],
        })
    }
    const isMatch = await user.comparePassword();
    if(!isMatch) return res.status(401).json({error:"Invalid Password"})

        res.status(200).json({
            Message:"Loggin Successfully",
            status: true,
            data: token,
        });
};




















// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { sendEmail } from "../services/email.service.js"; // optional

// dotenv.config();

// // 🔐 Helper to generate JWT
// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       username: user.username,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );
// };

// // 👤 Register New User
// export const register = async (req, res) => {
//   try {
//     const { username, email, password, location, user_UUID } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({
//         status: false,
//         message: "Email already in use",
//       });
//     }

//     const newUser = new User({ username, email, password, location, user_UUID });
//     await newUser.save(); // pre-save hook hashes the password

//     // Optional welcome email
//     sendEmail(email, "Welcome to Book Reviews", "Thanks for signing up!");

//     return res.status(201).json({
//       status: true,
//       message: "User registered successfully",
//       data: {
//         id: newUser._id,
//         email: newUser.email,
//         username: newUser.username,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// };

// // 🔐 Login User
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid email or password",
//       });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = generateToken(user);

//     return res.status(200).json({
//       status: true,
//       message: "Login successful",
//       data: {
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           username: user.username,
//         },
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: "Login failed",
//       error: error.message,
//     });
//   }
// };
