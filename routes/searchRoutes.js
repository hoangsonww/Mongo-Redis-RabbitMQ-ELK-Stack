const express = require('express');
const { searchExpenses } = require('../controllers/searchController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, searchExpenses);

module.exports = router;
