const express = require('express');
const router = express.Router();
const { createAdminUser } = require('../controllers/adminController');

// Special route for creating admin users
router.post('/create-admin', createAdminUser);

module.exports = router;
