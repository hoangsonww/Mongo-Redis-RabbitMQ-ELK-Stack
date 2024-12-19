const express = require('express');
const { addExpense, getExpensesByBudget } = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, addExpense);
router.get('/:budgetId', authenticate, getExpensesByBudget);

module.exports = router;
