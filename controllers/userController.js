const User = require('../models/user');
const { verifyToken } = require('../services/jwtService');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the profile of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       401:
 *         description: Authorization token missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authorization token missing"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error.
 */
exports.getProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token missing' });

    // Verify JWT token
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the profile of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The updated username.
 *                 example: "john_doe_updated"
 *               email:
 *                 type: string
 *                 description: The updated email address.
 *                 example: "john.doe.updated@example.com"
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64c9f8f2a73c2f001b3c68f4"
 *                 username:
 *                   type: string
 *                   example: "john_doe_updated"
 *                 email:
 *                   type: string
 *                   example: "john.doe.updated@example.com"
 *       401:
 *         description: Authorization token missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Authorization token missing"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error.
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token missing' });

    const decoded = verifyToken(token);

    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
