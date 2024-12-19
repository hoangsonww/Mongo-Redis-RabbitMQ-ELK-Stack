const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the customer.
 *           example: "64c9f8f2a73c2f001b3c68f4"
 *         name:
 *           type: string
 *           description: The full name of the customer.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email address of the customer.
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: The phone number of the customer.
 *           example: "+1234567890"
 *       example:
 *         _id: "64c9f8f2a73c2f001b3c68f4"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         phone: "+1234567890"
 */

const customerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
});

module.exports = mongoose.model('Customer', customerSchema);
