const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - budgetId
 *         - description
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the expense.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         budgetId:
 *           type: string
 *           description: The ID of the associated budget.
 *           example: "64c9f8f2a73c2f001b3c68f3"
 *         description:
 *           type: string
 *           description: A description of the expense.
 *           example: "Flight tickets"
 *         amount:
 *           type: number
 *           description: The amount of the expense.
 *           example: 500.0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the expense was created.
 *           example: "2023-10-01T12:34:56.789Z"
 *       example:
 *         _id: "64c9f8f2a73c2f001b3c68f4"
 *         budgetId: "64c9f8f2a73c2f001b3c68f3"
 *         description: "Flight tickets"
 *         amount: 500.0
 *         createdAt: "2023-10-01T12:34:56.789Z"
 */

const expenseSchema = new mongoose.Schema({
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', expenseSchema);
