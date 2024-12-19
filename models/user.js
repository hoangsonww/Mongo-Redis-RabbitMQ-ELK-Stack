const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the user.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         username:
 *           type: string
 *           description: The unique username of the user.
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: The unique email address of the user.
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: The hashed password of the user.
 *           example: "$2b$10$CjUFG4fXHh9vMmKoYfZdFeJ.kXhE3IvB4ZrOyW6RmCR8e4XMTKBgG"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 *           example: "2023-10-01T12:34:56.789Z"
 *       example:
 *         _id: "64c9f8f2a73c2f001b3c68f4"
 *         username: "john_doe"
 *         email: "john.doe@example.com"
 *         password: "$2b$10$CjUFG4fXHh9vMmKoYfZdFeJ.kXhE3IvB4ZrOyW6RmCR8e4XMTKBgG"
 *         createdAt: "2023-10-01T12:34:56.789Z"
 */

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plaintext password with hashed password
userSchema.methods.comparePassword = async function (plaintextPassword) {
  return bcrypt.compare(plaintextPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
