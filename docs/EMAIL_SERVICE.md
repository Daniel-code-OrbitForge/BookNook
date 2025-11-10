# BookNook Email Service Documentation

## Overview

The email service is a core component of BookNook that handles all transactional emails including:
- Welcome emails for new user registration
- Password reset emails
- Purchase confirmation emails

The service uses Mailtrap for development and testing, making it easy to verify email functionality without sending actual emails.

## Setup and Configuration

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration (Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@booknook.com
```

### 2. Dependencies

The email service uses `nodemailer` for sending emails. Make sure it's installed:

```bash
npm install nodemailer
```

## Service Architecture

The email service is implemented as a singleton class with methods for different types of emails:

```javascript
class EmailService {
  constructor() { ... }
  async sendEmail(options) { ... }
  async sendWelcomeEmail(user) { ... }
  async sendPasswordResetEmail(user, resetToken) { ... }
  async sendPurchaseConfirmationEmail(user, book, purchase) { ... }
}
```

## Usage Examples

### 1. Sending Welcome Email

Used in user registration:

```javascript
const emailService = require('../services/emailService');

// In your registration controller
const user = await User.create({...});
await emailService.sendWelcomeEmail({
  name: user.name,
  email: user.email
});
```

### 2. Password Reset Email

Used in the forgot password flow:

```javascript
const emailService = require('../services/emailService');

// In your forgot password controller
const resetToken = generateResetToken();
await emailService.sendPasswordResetEmail({
  name: user.name,
  email: user.email
}, resetToken);
```

### 3. Purchase Confirmation

Used after successful book purchase:

```javascript
const emailService = require('../services/emailService');

// In your purchase controller
await emailService.sendPurchaseConfirmationEmail(
  user,
  book,
  {
    amount: book.price,
    transactionId: 'txn_123'
  }
);
```

## Email Templates

All emails use responsive HTML templates with consistent branding:

1. **Welcome Email**
   - Greeting with user's name
   - Account features list
   - Call-to-action button to browse books
   
2. **Password Reset Email**
   - Security information
   - Reset link (valid for 10 minutes)
   - Warning about email origin

3. **Purchase Confirmation**
   - Order details
   - Download link
   - Support information

## Testing with Mailtrap

1. Create a Mailtrap account at https://mailtrap.io
2. Get your SMTP credentials from your Mailtrap inbox
3. Update your `.env` file with the credentials
4. All sent emails will be captured in your Mailtrap inbox

## Production Deployment

When deploying to production:

1. Replace Mailtrap configuration with your production email service
2. Update EMAIL_FROM to your verified sender domain
3. Consider implementing email queuing for high-volume scenarios
4. Add monitoring for email delivery success/failure

## Error Handling

The service includes built-in error handling:

```javascript
try {
  await emailService.sendWelcomeEmail(user);
} catch (error) {
  console.error('Email sending failed:', error);
  // Handle error appropriately
}
```

## Best Practices

1. **Always use environment variables** for email configuration
2. **Include both HTML and plain text versions** of emails (for better deliverability)
3. **Use proper error handling** around email operations
4. **Keep templates consistent** with your branding
5. **Include unsubscribe links** in marketing emails
6. **Monitor email delivery rates** in production

## Common Issues and Solutions

1. **Emails not sending**
   - Check Mailtrap credentials
   - Verify environment variables are loaded
   - Check network connectivity

2. **HTML not rendering**
   - Validate HTML template syntax
   - Check email client compatibility
   - Use inline CSS for better compatibility

3. **Missing environment variables**
   - Ensure .env file is present
   - Check variable names match exactly
   - Restart server after changing environment variables

## Integration Guide

1. **Install required dependencies:**
   ```bash
   npm install nodemailer
   ```

2. **Set up environment variables** in your `.env` file

3. **Import the email service** where needed:
   ```javascript
   const emailService = require('../services/emailService');
   ```

4. **Use in your controllers** for sending emails:
   ```javascript
   // Example in auth controller
   const register = async (req, res) => {
     try {
       const user = await User.create(req.body);
       
       // Send welcome email
       await emailService.sendWelcomeEmail({
         name: user.name,
         email: user.email
       });
       
       res.status(201).json({
         success: true,
         message: 'Registration successful'
       });
     } catch (error) {
       // Handle error
     }
   };
   ```

## Security Considerations

1. **Environment Variables**
   - Never commit email credentials to version control
   - Use different credentials for development and production
   - Rotate credentials periodically

2. **Email Content**
   - Sanitize all user input used in emails
   - Use HTTPS for all links in emails
   - Include security warnings in sensitive emails

3. **Rate Limiting**
   - Implement rate limiting for password reset emails
   - Monitor for unusual email sending patterns

## Contributing

When contributing to the email service:

1. Follow the existing template structure
2. Test all changes with Mailtrap
3. Update documentation for any new features
4. Add error handling for new scenarios

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Mailtrap documentation
3. Contact the development team