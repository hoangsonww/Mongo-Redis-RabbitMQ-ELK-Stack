const Expense = require('../models/expense');
const Budget = require('../models/budget');
const redisClient = require('../services/redisService');

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: API for managing expenses
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Add a new expense to a budget
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - budgetId
 *               - description
 *               - amount
 *             properties:
 *               budgetId:
 *                 type: string
 *                 description: The ID of the budget to which the expense belongs.
 *               description:
 *                 type: string
 *                 description: The description of the expense.
 *               amount:
 *                 type: number
 *                 description: The amount of the expense.
 *     responses:
 *       201:
 *         description: Expense added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expense added
 *                 expense:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     budgetId:
 *                       type: string
 *                       example: 64c9f8f2a73c2f001b3c68f4
 *                     description:
 *                       type: string
 *                       example: Flight tickets
 *                     amount:
 *                       type: number
 *                       example: 500
 *       404:
 *         description: Budget not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Budget not found
 *       500:
 *         description: Server error.
 */
exports.addExpense = async (req, res, next) => {
  const { budgetId, description, amount } = req.body;

  try {
    // Ensure budget exists
    const budget = await Budget.findById(budgetId);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    // Create expense
    const expense = new Expense({ budgetId, description, amount });
    const savedExpense = await expense.save();

    // Update Redis cache for the budget
    const cachedBudget = await redisClient.get(`budget:${budgetId}`);
    if (cachedBudget) {
      const parsedBudget = JSON.parse(cachedBudget);
      parsedBudget.expenses = parsedBudget.expenses || [];
      parsedBudget.expenses.push(savedExpense);
      await redisClient.set(`budget:${budgetId}`, JSON.stringify(parsedBudget));
    }

    res.status(201).json({ message: 'Expense added', expense: savedExpense });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/expenses/{budgetId}:
 *   get:
 *     summary: Retrieve all expenses for a specific budget
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to retrieve expenses for.
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64c9b5f4e7a7d2b001e76a1b
 *                       budgetId:
 *                         type: string
 *                         example: 64c9f8f2a73c2f001b3c68f4
 *                       description:
 *                         type: string
 *                         example: Flight tickets
 *                       amount:
 *                         type: number
 *                         example: 500
 *                 source:
 *                   type: string
 *                   example: cache
 *       404:
 *         description: No expenses found for this budget.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No expenses found for this budget
 *       500:
 *         description: Server error.
 */
exports.getExpensesByBudget = async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    // Check cache first
    const cachedExpenses = await redisClient.get(`expenses:${budgetId}`);
    if (cachedExpenses) {
      return res.status(200).json({ expenses: JSON.parse(cachedExpenses), source: 'cache' });
    }

    // Fetch expenses from MongoDB if not cached
    const expenses = await Expense.find({ budgetId });
    if (!expenses.length) return res.status(404).json({ error: 'No expenses found for this budget' });

    // Cache expenses in Redis
    await redisClient.set(`expenses:${budgetId}`, JSON.stringify(expenses));

    res.status(200).json({ expenses, source: 'database' });
  } catch (error) {
    next(error);
  }
};
