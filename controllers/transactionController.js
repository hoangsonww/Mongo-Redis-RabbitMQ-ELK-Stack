const pool = require('../services/postgresService');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transaction logs
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction log
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - description
 *               - amount
 *               - budgetId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user associated with the transaction.
 *               description:
 *                 type: string
 *                 description: A description of the transaction.
 *               amount:
 *                 type: number
 *                 description: The amount of the transaction.
 *               budgetId:
 *                 type: string
 *                 description: The ID of the budget associated with the transaction.
 *     responses:
 *       201:
 *         description: Transaction log added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction log added"
 *                 transaction:
 *                   type: object
 *       500:
 *         description: Server error.
 */
exports.addTransactionLog = async (req, res, next) => {
  const { userId, description, amount, budgetId } = req.body;

  try {
    const query = `
        INSERT INTO transaction_logs (user_id, description, amount, budget_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;

    const values = [userId, description, amount, budgetId];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Transaction log added', transaction: result.rows[0] });
  } catch (error) {
    console.error('Error adding transaction log:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve all transaction logs
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transaction logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error.
 */
exports.getAllTransactionLogs = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM transaction_logs ORDER BY created_at DESC;');

    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching transaction logs:', error.message);
    next(error);
  }
};

/**
 * @swagger
 * /api/transactions/user/{userId}:
 *   get:
 *     summary: Retrieve transaction logs by user ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve transaction logs for.
 *     responses:
 *       200:
 *         description: List of transaction logs for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error.
 */
exports.getTransactionLogsByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const query = 'SELECT * FROM transaction_logs WHERE user_id = $1 ORDER BY created_at DESC;';
    const result = await pool.query(query, [userId]);

    res.status(200).json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching user transaction logs:', error.message);
    next(error);
  }
};
