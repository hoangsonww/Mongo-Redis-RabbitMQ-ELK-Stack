const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the task.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         description:
 *           type: string
 *           description: A brief description of the task.
 *           example: "Process user analytics"
 *         status:
 *           type: string
 *           description: The current status of the task.
 *           example: "pending"
 *           default: "pending"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was created.
 *           example: "2023-10-01T12:34:56.789Z"
 *       example:
 *         _id: "64c9f8f2a73c2f001b3c68f4"
 *         description: "Process user analytics"
 *         status: "pending"
 *         createdAt: "2023-10-01T12:34:56.789Z"
 */

const taskSchema = new Schema({
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
