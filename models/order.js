const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerId
 *         - amount
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the order.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         customerId:
 *           type: string
 *           description: The ID of the customer associated with the order.
 *           example: "64c9f8f2a73c2f001b3c68f3"
 *         amount:
 *           type: number
 *           description: The total amount of the order.
 *           example: 150.5
 *         status:
 *           type: string
 *           description: The status of the order.
 *           example: "pending"
 *           default: "pending"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the order was created.
 *           example: "2023-10-01T12:34:56.789Z"
 *       example:
 *         _id: "64c9f8f2a73c2f001b3c68f4"
 *         customerId: "64c9f8f2a73c2f001b3c68f3"
 *         amount: 150.5
 *         status: "pending"
 *         createdAt: "2023-10-01T12:34:56.789Z"
 */

const orderSchema = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
