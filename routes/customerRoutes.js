const express = require('express');
const { createCustomer, getAllCustomers } = require('../controllers/customerController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createCustomer);
router.get('/', authenticate, getAllCustomers);

module.exports = router;
