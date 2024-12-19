const express = require('express');
const { createBudget, getBudget, getAllBudgets, deleteBudget } = require('../controllers/budgetController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createBudget);
router.get('/:id', authenticate, getBudget);
router.get('/', authenticate, getAllBudgets);
router.delete('/:id', authenticate, deleteBudget);

module.exports = router;
