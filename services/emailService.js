const nodemailer = require('nodemailer');

/**
 * EmailService Class
 * Handles all email operations for BookNook using Mailtrap
 */
class EmailService {
  constructor() {
    // Initialize nodemailer transporter with Mailtrap credentials
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    this.fromEmail = process.env.EMAIL_FROM || 'noreply@booknook.com';
  }

  /**
   * Send email wrapper
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - Email HTML content
   */
  async sendEmail(options) {
    try {
      await this.transporter.sendMail({
        from: `BookNook <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to newly registered user
   * @param {Object} user - User object
   * @param {string} user.name - User's name
   * @param {string} user.email - User's email
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to BookNook - Your Account is Ready!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to BookNook!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Thank you for joining BookNook! We're excited to have you as part of our community of book lovers.</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>Browse our extensive collection of books</li>
              <li>Purchase and download books instantly</li>
              <li>Share your own books with our community</li>
              <li>Keep track of your reading journey</li>
            </ul>
            <p>Ready to start exploring?</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/books.html" class="button">Browse Books</a>
            </p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} BookNook. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send password reset email
   * @param {Object} user - User object
   * @param {string} user.name - User's name
   * @param {string} user.email - User's email
   * @param {string} resetToken - Password reset token
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;
    const subject = 'BookNook - Password Reset Request';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .warning { color: #dc2626; margin-top: 20px; font-size: 0.9em; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>You recently requested to reset your password for your BookNook account. Click the button below to reset it:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p class="warning">This password reset link is only valid for 10 minutes.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} BookNook. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Send purchase confirmation email
   * @param {Object} user - User object
   * @param {Object} book - Book object
   * @param {Object} purchase - Purchase details
   */
  async sendPurchaseConfirmationEmail(user, book, purchase) {
    const subject = 'BookNook - Purchase Confirmation';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
          .purchase-details { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Purchase!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Your purchase has been confirmed. Here are your order details:</p>
            
            <div class="purchase-details">
              <h3>Purchase Details:</h3>
              <p><strong>Book:</strong> ${book.title}</p>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Amount:</strong> $${purchase.amount}</p>
              <p><strong>Transaction ID:</strong> ${purchase.transactionId}</p>
              <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>You can download your book by clicking the button below:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${book.fileUrl}" class="button">Download Book</a>
            </p>
            
            <p>We hope you enjoy your new book! If you have any questions about your purchase, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>&copy; ${new Date().getFullYear()} BookNook. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({ to: user.email, subject, html });
  }
}

// Create and export a single instance
const emailService = new EmailService();
module.exports = emailService;
