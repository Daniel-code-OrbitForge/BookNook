## BookNook | Tech4Africans (TechCrush) Capstone Project ##
**A complete online bookstore web application with role-based access control, book management, and email notifications. Built with Node.js, Express, MongoDB, and vanilla JavaScript.**

---

## Project Overview ##
**This is a Minimum Viable Product (MVP) for an online bookstore that allows users to:**

- Browse and view books (Guest access)
- Purchase and upload books (Registered users)
- Manage books and users (Admin access)

---

## Features ##
**Guest User**

- View public pages (Home, About, Contact)
- Browse available books
- Read book details and descriptions

**Registered User**

- All guest features
- User registration with email confirmation
- Secure login with JWT authentication
- Purchase books (mock checkout)
- Upload books with file support (PDF, EPUB, MOBI, TXT)
- Password reset via email

**Admin User**

- All registered user features
- Full book management (Create, Read, Update, Delete)
- User management
- Admin dashboard with complete oversight

---

## Tech Stack ##
**Backend**

- **Node.js** -> Runtime environment
- **Express.js** -> Web framework
- **MongoDB** -> NoSQL database
- **Mongoose** -> MongoDB ODM
- **JWT** -> Authentication tokens
- **bcrypt** -> Password hashing
- **Multer** -> File upload handling
- **Nodemailer** -> Email service

**Frontend**

- **HTML5** -> Physical Structure
- **CSS3** -> Styling with custom variables
- **Vanilla** JavaScript -> Interactivity
- **Media Queries** -> Responsive design

---

## Project Structure ##

```bash
online-bookstore/
├── backend/                      # Core Backend logic folders & files
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── bookController.js     # Book CRUD operations
│   │   └── userController.js     # User management
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   └── bookModel.js          # Book schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── bookRoutes.js         # Book endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT & role protection
│   │   └── errorMiddleware.js    # Error handling
│   ├── utils/
│   │   ├── sendEmail.js          # Email service
│   │   └── helpers.js            # Helper functions
│   ├── uploads/                  # Book files storage
│   └── server.js                 # Entry point
├── frontend/                     # Frontend folders & files
│   ├── css/
│   │   ├── style.css             # Main styles
│   │   └── responsive.css        # Mobile responsive
│   ├── js/
│   │   ├── main.js               # General utilities
│   │   ├── api.js                # API calls
│   │   ├── auth.js               # Authentication
│   │   ├── upload.js             # Book upload
│   │   └── admin.js              # Admin dashboard
│   ├── index.html                # Home page
│   ├── about.html                # About page
│   ├── contact.html              # Contact page
│   ├── books.html                # Books listing
│   ├── login.html                # Login page
│   ├── register.html             # Registration
│   ├── upload.html               # Book upload
│   ├── admin-dashboard.html      # Admin panel
│   ├── forgot-password.html      # Password reset request
│   └── reset-password.html       # Password reset
├── package.json
├── .env.example                  # Environment variables template
├── .gitignore
└── README.md
```

---

## Getting Started ##

**Prerequisites**
- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn

**Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Daniel-code-OrbitForge/BookNook.git
cd booknook
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Copy *.env.example* to *.env* and configure:
```bash
cp .env.example .env
```
Update the following in *.env*:
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/booknook

# JWT
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Email (Mailtrap for testing)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@booknook.com

# Admin Secret (for creating admin users)
ADMIN_SECRET=your_secure_admin_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5000
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**
```bash
npm start
```

6. **Access the application**
Open your browser and navigate to:
```bash
http://localhost:5000
```

---

## Email Configuration ##
---
**The application uses Nodemailer for email functionality:**
**For Development (Mailtrap)**

- Sign up at Mailtrap.io
- Get your SMTP credentials
- Update .env with your Mailtrap credentials

**For Production**
---
**Replace Mailtrap settings with your production email service (Gmail, SendGrid, etc.)**
**Admin User Setup**
---
**IMPORTANT SECURITY NOTE:** Regular users cannot self-assign admin roles. Admin users must be created using the secure admin endpoint with the admin secret.
Create Your First Admin User

1. **Set Admin Secret in *.env***
```bash
ADMIN_SECRET=your_secure_admin_secret_key
```

2. **Create Admin via API**
```bash
POST /api/admin/create-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword123",
  "adminSecret": "your_secure_admin_secret_key"
}
```

3. **Using cURL**
```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securepassword123",
    "adminSecret": "your_secure_admin_secret_key"
  }'
  ```
  **Note: The admin secret should be kept secure and never committed to version control. Regular user registration *(/api/auth/register)* automatically creates users with the 'user' role only.**

  ---

  ## API Endpoints ##
  **Authentication**

- **POST /api/auth/register** -> Register new user (creates 'user' role only)
- **POST /api/auth/login** -> User login
- **POST /api/auth/forgot-password** -> Request password reset
- **PUT /api/auth/reset-password/:token** -> Reset password
- **GET /api/auth/me** -> Get current user (Protected)

**Admin**

- **POST /api/admin/create-admin** -> Create admin user (requires admin secret)

**Books**

- **GET /api/books** -> Get all books (Public)
- **GET /api/books/:id** -> Get single book (Public)
- **POST /api/books** -> Create book (User/Admin)
- **PUT /api/books/:id** -> Update book (User/Admin)
- **DELETE /api/books/:id** -> Delete book (User/Admin)
- **POST /api/books/:id/purchase** -> Purchase book (User/Admin)

**Users (Admin Only)**

- **GET /api/users** -> Get all users
- **GET /api/users/:id** -> Get single user
- **PUT /api/users/:id** -> Update user
- **DELETE /api/users/:id** -> Delete user

--- 

## Security Features

- Password hashing with **bcrypt**
- JWT-based authentication
- Role-based access control **(RBAC)** with protected admin creation
- Secure admin provisioning via secret-protected endpoint
- Input validation
- Secure file upload with type validation
- Token-based password reset
- **CORS** enabled
- Prevention of privilege escalation **(users cannot self-assign admin role)**

**Responsive Design**
---
**The application is fully responsive with breakpoints for:**

- **Mobile** devices (< 480px)
- **Tablets** (480px - 768px)
- **Desktop** (> 768px)

**User Interface**
**Pages**

- **Home** -> Landing page with features overview
- **About** -> Information about the platform
- **Contact** -> Contact form and details
- **Books** -> Browse all available books
- **Login/Register** -> User authentication
- **Upload** -> Book upload form (User/Admin)
- **Admin Dashboard** -> Management panel (Admin only)
- **Password Reset** -> Forgot/Reset password flow

**Design Features**
---
- Clean, modern UI with gradient hero sections
- Card-based layouts for books
- Responsive navigation with mobile hamburger menu
- Form validation and error handling
- Success/Error message displays

**File Upload**
**Supported Formats**
---
- PDF (.pdf)
- EPUB (.epub)
- MOBI (.mobi)
- TXT (.txt)

**File Size Limit**
---
**Maximum:** 10MB per file

**Storage**
---
- **Files stored in: backend/uploads/**
- **Access via: /uploads/filename**

**Testing the Application**
**Test User Registration**
---
- Navigate to /register.html
- Fill in user details
- Submit to receive confirmation email
- Login with credentials

**Test Book Upload**

- Login as user or admin
- Navigate to /upload.html
- Fill in book details and upload file
- Book appears in books listing

**Test Admin Features**

- Login as admin
- Navigate to /admin-dashboard.html
- Manage books and users

## Troubleshooting ##
MongoDB Connection Issues

**Check if MongoDB is running**
ps aux | grep mongod

**Start MongoDB**
mongod --dbpath /path/to/data

Port Already in Use

**Find process using port 5000**
lsof -i :5000

**Kill process**
kill -9 <PID>

## Email Not Sending ##

- Verify Mailtrap credentials in .env
- Check internet connection
- Review server logs for email errors

## Future Enhancements
**Phase 2 Features**

- Advanced search and filtering
- Shopping cart functionality
- Book categories and tags
- User reviews and ratings
- Purchase history tracking
- Book recommendations
- Payment gateway integration
- Book preview functionality

## License

This project is licensed under the ISC License.
**Author (s)**
1. Harrison Daniel Chinomso -> BD/2025/TC3/064 | (Team Leader)
2. Agu Micheal Uche -> BD/2025/TC3/089
3. Onigbinde Joshua Oluwafenwa -> BD/2025/TC3/078
4. Olukayode Feyisike P. -> BD/2025/TC3/057
5. Omijori Muiz Ayomide -> BD/2025/TC3/092

## Acknowledgments

- Tech4Africans (TechCrush) for the learning opportunity
- MongoDB for the database solution
- Express.js community for the excellent framework
- All contributors and testers

## Support

For issues, questions, or contributions:

- Email: support@booknook.com
- Create an issue in the repository

Built with ❤️ for Tech4Africans Capstone Submission