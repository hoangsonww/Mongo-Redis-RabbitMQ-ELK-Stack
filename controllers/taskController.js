const { sendToQueue } = require('../services/rabbitMQService');
const { redisClient } = require('../index');
const Task = require('../models/task');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for task management using RabbitMQ and Redis
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Submit a task to RabbitMQ
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 description: The task description.
 *                 example: "Process user analytics"
 *     responses:
 *       202:
 *         description: Task submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task submitted successfully"
 *                 taskId:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *       500:
 *         description: Server error.
 */
exports.sendTask = async (req, res, next) => {
  const { description } = req.body;

  try {
    // Create a new task in MongoDB
    const task = new Task({ description, status: 'pending' });
    const savedTask = await task.save();

    try {
      // Attempt to cache the task status in Redis
      await redisClient.set(`task:${savedTask._id}:status`, 'pending');
    } catch (redisError) {
      console.error('Redis operation failed:', redisError.message);
    }

    // Send the task to RabbitMQ queue
    sendToQueue('task_queue', JSON.stringify({ taskId: savedTask._id, description }));

    res.status(202).json({ message: 'Task submitted successfully', taskId: savedTask._id });
  } catch (error) {
    next(error); // Forward error to middleware
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Check the status of a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to check status.
 *     responses:
 *       200:
 *         description: Task status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Server error.
 */
exports.checkTaskStatus = async (req, res, next) => {
  const { id } = req.params;

  try {
    const status = await redisClient.get(`task:${id}:status`);

    if (!status) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ taskId: id, status });
  } catch (error) {
    next(error);
  }
};
