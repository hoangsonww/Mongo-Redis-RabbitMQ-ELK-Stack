const { broadcastNotification } = require('../services/websocketService');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing real-time notifications
 */

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send a real-time notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The notification message to broadcast.
 *                 example: Budget exceeded limit!
 *     responses:
 *       200:
 *         description: Notification sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification sent successfully
 *       400:
 *         description: Missing notification message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Message is required
 *       500:
 *         description: Server error.
 */
exports.sendNotification = (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    broadcastNotification({ message });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    next(error);
  }
};
