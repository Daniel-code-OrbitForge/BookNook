// const crypto = require('node:crypto')
// const bcrypt = require('node:bcrypt');
// const sendEmail = require('../utils/sendEmail');
// const models = require('../models/userModel');


// //Password reset request
// export const requestPasswordReset = async (models, email) => {
//   //const { email } = req.body;//browser feeds the email address e.g engrcharles33@gmail.com

//   try {
//     const user = await models.findOne({ email });// mongodb lookout for engrcharles33@gmail.com
//     if (!user)// if engrcharles33@gmail.com don't exist throw
//       return res.status(404).json({ message: 'No user found with that email' });

//     // Generate token
//     const token = crypto.randomBytes(32).toString('hex');// create random secure token
//     const expiry = Date.now() + 1000 * 60 * 60; // 1 hour i.e setting the expiration time

//     user.resetToken = token;
//     user.resetTokenExpiry = expiry;
//     await user.save();// save the token and expiration time in the database

//     const resetLink = `http://localhost:5000/reset-password/${token}`;//builds a url reset link sent to engrcharles33@gmail.com
//     await sendEmail(user.email, 'Password Reset', `
//       <h2>Password Reset Requested</h2>
//       <p>Click below to reset your password:</p>
//       <a href="${resetLink}">Reset Password</a>
//       <p>This link will expire in 1 hour.</p>
//     `);//Sends the reset email to the user with the clickable link and instructions.

//     res.json({ message: 'Password reset email sent' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


// //Reset password after clicking link
// export const resetPassword = async (models, token) => {
//  const { newPassword } = req.body;//Extracts The token from the URL and The newPassword from the form or request body

//   try {
//     const user = await models.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() }, // Not expired
//     });//Find a user with this token that hasn’t expired yet.” If no match is found, the token is invalid or expired.
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     user.password = newPassword; // Will be hashed in pre-save hook. Sets the user’s password to the new one.
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;//Clears the reset token and its expiry date from the database so it can’t be reused later.
// //This ensures the token can only be used once.
//     await user.save();//Saves the updated user record to the database:

//     res.json({ message: 'Password has been reset successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


