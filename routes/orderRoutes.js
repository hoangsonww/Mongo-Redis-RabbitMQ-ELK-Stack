const express = require('express');
const { createOrder, getAllOrders, getOrderById, deleteOrder, updateOrder } = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.delete('/:id', authenticate, deleteOrder);
router.put('/:id', authenticate, updateOrder);

module.exports = router;
