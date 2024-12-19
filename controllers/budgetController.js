const Budget = require('../models/budget');
const redisClient = require('../services/redisService');

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Budget Management API
 */

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - limit
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the budget.
 *               limit:
 *                 type: number
 *                 description: The spending limit of the budget.
 *     responses:
 *       201:
 *         description: Budget created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Budget created
 *                 budget:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     name:
 *                       type: string
 *                       example: Travel
 *                     limit:
 *                       type: number
 *                       example: 2000
 *       500:
 *         description: Server error.
 */
exports.createBudget = async (req, res, next) => {
  try {
    const { name, limit } = req.body;
    const budget = new Budget({ name, limit });
    const savedBudget = await budget.save();

    // Cache the budget in Redis
    await redisClient.set(`budget:${savedBudget._id}`, JSON.stringify(savedBudget));

    res.status(201).json({ message: 'Budget created', budget: savedBudget });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the budget to retrieve.
 *     responses:
 *       200:
 *         description: Budget retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 budget:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64c9b5f4e7a7d2b001e76a1b
 *                     name:
 *                       type: string
 *                       example: Travel
 *                     limit:
 *                       type: number
 *                       example: 2000
 *                 source:
 *                   type: string
 *                   example: cache
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
exports.getBudget = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check cache first
    const cachedBudget = await redisClient.get(`budget:${id}`);
    if (cachedBudget) {
      return res.status(200).json({ budget: JSON.parse(cachedBudget), source: 'cache' });
    }

    // Fetch from MongoDB if not in cache
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    // Cache the budget in Redis
    await redisClient.set(`budget:${id}`, JSON.stringify(budget));

    res.status(200).json({ budget, source: 'database' });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: List of all budgets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64c9b5f4e7a7d2b001e76a1b
 *                   name:
 *                     type: string
 *                     example: Travel
 *                   limit:
 *                     type: number
 *                     example: 2000
 *       500:
 *         description: Server error.
 */
exports.getAllBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find();
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};
