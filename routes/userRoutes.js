const express = require('express');
const { getProfile, updateProfile, getAllProfiles, patchProfile } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/profiles', authenticate, getAllProfiles);
router.patch('/profile', authenticate, patchProfile);

module.exports = router;
