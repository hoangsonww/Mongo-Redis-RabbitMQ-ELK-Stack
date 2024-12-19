const express = require('express');
const { createCustomer, getAllCustomers, getCustomerById, deleteCustomerById, updateCustomerById } = require('../controllers/customerController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createCustomer);
router.get('/', authenticate, getAllCustomers);
router.get('/:customerId', authenticate, getCustomerById);
router.delete('/:customerId', authenticate, deleteCustomerById);
router.put('/:customerId', authenticate, updateCustomerById);

module.exports = router;
