const express = require('express');
const { createCustomer, getAllCustomers, getCustomerById } = require('../controllers/customerController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createCustomer);
router.get('/', authenticate, getAllCustomers);
router.get('/:customerId', authenticate, getCustomerById);

module.exports = router;
