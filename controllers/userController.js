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
    if (!token) {
      return res.status(401).json({ error: 'Authorization token missing' });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if the user ID exists in the decoded token
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Find user by ID
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);

    // Handle specific known errors
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Handle all other errors
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
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
 *       400:
 *         description: Bad request. Validation error, duplicate key error, or no fields provided to update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Email is not a valid email address."]
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

    // Check if fields are provided
    if (!username && !email) {
      return res.status(400).json({ error: 'At least one field (username or email) must be provided for update' });
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.userId, { username, email }, { new: true, runValidators: true }).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateKey = Object.keys(error.keyValue).join(', ');
      return res.status(400).json({
        error: 'Duplicate key error',
        details: `Duplicate key error: ${duplicateKey} already exists.`,
      });
    }

    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }

    console.error('Unexpected error during profile update:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all user profiles
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user profiles retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64c9f8f2a73c2f001b3c68f4"
 *                   username:
 *                     type: string
 *                     example: "john_doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *       500:
 *         description: Server error.
 */
exports.getAllProfiles = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Partially update the profile of the currently authenticated user
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
 *       400:
 *         description: Bad request. Validation error, duplicate key error, or no fields provided to update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Email is not a valid email address."]
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
exports.patchProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authorization token missing' });

    const decoded = verifyToken(token);

    const updates = req.body;

    // Ensure updates object is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.userId, updates, { new: true, runValidators: true }).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const duplicateKey = Object.keys(error.keyValue).join(', ');
      return res.status(400).json({
        error: 'Duplicate key error',
        details: `Duplicate key error: ${duplicateKey} already exists.`,
      });
    }

    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }

    console.error('Unexpected error during profile update:', error);
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};
