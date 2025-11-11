const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure env vars are loaded

// Basic validation for required environment variables (helpful during dev)
const EMAIL_HOST = process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 2525;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || (EMAIL_USER ? `noreply@${EMAIL_USER.split('@').pop()}` : 'noreply@booknook.com');

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn('Warning: EMAIL_USER or EMAIL_PASS not set. Email sending will fail until configured.');
}

// Create transporter using Nodemailer
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Sends a generic email.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email.
 * @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body.
 * @param {string} [options.html] - HTML body (optional).
 * @returns {Promise<Object>} - Success status and message ID or error.
 */
async function sendEmail({ to, subject, text = '', html = '' }) {
  if (!to) {
    throw new Error('sendEmail: "to" address is required');
  }

  const mailOptions = {
    from: `BookNook <${EMAIL_FROM}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // Nodemailer returns info with messageId
    console.log(`Email sent to ${to} - messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends an order confirmation email for BookNook purchases.
 * @param {string} to - Recipient email.
 * @param {Object} order - Order details (e.g., { id: 123, items: [...], total: 50.00 }).
 * @returns {Promise<Object>} - Email send result.
 */
async function sendOrderConfirmation(to, order = {}) {
  const safeOrder = order || {};
  const orderId = safeOrder.id || 'N/A';
  const total = typeof safeOrder.total !== 'undefined' ? Number(safeOrder.total).toFixed(2) : '0.00';
  const items = Array.isArray(safeOrder.items) ? safeOrder.items : [];

  const subject = `Order Confirmation - BookNook #${orderId}`;
  const text = `Thank you for your order! Order ID: ${orderId}. Total: $${total}. Items: ${items.map(i => i.title).join(', ')}.`;

  const itemsHtml = items.length
    ? items.map(item => `<li>${escapeHtml(String(item.title || 'Untitled'))} - $${Number(item.price || 0).toFixed(2)}</li>`).join('')
    : '<li>No items</li>';

  const html = `
    <div style=\"font-family: Arial, sans-serif; color: #333;\">\n+      <h2>Thank you for shopping at BookNook!</h2>\n+      <p>Order ID: <strong>${escapeHtml(String(orderId))}</strong></p>\n+      <p>Total: <strong>$${total}</strong></p>\n+      <h3>Items</h3>\n+      <ul>\n+        ${itemsHtml}\n+      </ul>\n+      <p>We hope you enjoy your books!</p>\n+    </div>\n+  `;

  return await sendEmail({ to, subject, text, html });
}

/**
 * Sends a password reset email.
 * @param {string} to - Recipient email.
 * @param {string} resetLink - Password reset link.
 * @returns {Promise<Object>} - Email send result.
 */
async function sendPasswordReset(to, resetLink) {
  if (!resetLink) throw new Error('sendPasswordReset: resetLink is required');

  const subject = 'Reset Your BookNook Password';
  const text = `Click this link to reset your password: ${resetLink}`;
  const html = `
    <div style=\"font-family: Arial, sans-serif; color:#333;\">\n+      <h2>Password Reset</h2>\n+      <p>Click the button below to reset your BookNook password. This link is valid for a short time.</p>\n+      <p><a href=\"${escapeHtml(resetLink)}\" style=\"display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;\">Reset Password</a></p>\n+      <p>If you did not request a password reset, please ignore this email.</p>\n+    </div>\n+  `;

  return await sendEmail({ to, subject, text, html });
}

/**
 * Sends a welcome email for new BookNook users.
 * @param {string} to - Recipient email.
 * @param {string} userName - User's name.
 * @returns {Promise<Object>} - Email send result.
 */
async function sendWelcomeEmail(to, userName = 'Friend') {
  const subject = 'Welcome to BookNook!';
  const text = `Hi ${userName}, welcome to BookNook! Discover your next favorite book.`;
  const html = `
    <div style=\"font-family: Arial, sans-serif; color:#333;\">\n+      <h2>Welcome, ${escapeHtml(userName)}!</h2>\n+      <p>Thanks for joining BookNook. Start exploring our collection and enjoy your reading journey.</p>\n+      <p><a href=\"${escapeHtml(process.env.FRONTEND_URL || '/')}books.html\" style=\"display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:4px;\">Browse Books</a></p>\n+    </div>\n+  `;

  return await sendEmail({ to, subject, text, html });
}

// Small helper: escape minimal HTML special chars to avoid injection in templates
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendPasswordReset,
  sendWelcomeEmail,
  // expose transporter for tests or advanced usage
  transporter,
};