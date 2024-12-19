const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
