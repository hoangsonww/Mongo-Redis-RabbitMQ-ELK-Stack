const express = require('express');
const { createBudget, getBudget, getAllBudgets } = require('../controllers/budgetController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createBudget);
router.get('/:id', authenticate, getBudget);
router.get('/', authenticate, getAllBudgets);

module.exports = router;
