const Customer = require('../models/customer');
const mongoose = require('mongoose');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: The customer's name.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The customer's email address.
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: The customer's phone number.
 *                 example: "+123456789"
 *     responses:
 *       201:
 *         description: Customer created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64c9b5f4e7a7d2b001e76a1b"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+123456789"
 *       400:
 *         description: Bad request. Validation or duplicate key error.
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
 *                   description: Detailed validation or error information.
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Name is required."
 *                     - "Email must be unique."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *                 details:
 *                   type: string
 *                   example: "An unexpected error occurred while processing your request."
 */
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Name, email, and phone are required fields.',
      });
    }

    // Create and save the customer
    const customer = new Customer({ name, email, phone });
    const savedCustomer = await customer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    // Handle duplicate key error (e.g., unique email constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate key error',
        details: `A customer with the same ${Object.keys(error.keyValue).join(', ')} already exists.`,
      });
    }

    // Handle validation errors (e.g., schema validation)
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }

    // Log and handle unexpected errors
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing your request.',
    });
  }
};

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Retrieve a list of all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64c9b5f4e7a7d2b001e76a1b
 *                   name:
 *                     type: string
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   phone:
 *                     type: string
 *                     example: +123456789
 *       500:
 *         description: Server error.
 */
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the customer to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64c9b5f4e7a7d2b001e76a1b
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 phone:
 *                   type: string
 *                   example: +123456789
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found
 *       500:
 *         description: Server error.
 */
exports.getCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error retrieving customer:', error);
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to delete.
 *     responses:
 *       200:
 *         description: Customer deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer deleted successfully.
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found.
 *       500:
 *         description: Server error.
 */
exports.deleteCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    const customer = await Customer.findByIdAndDelete(customerId);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the customer.
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 description: The updated email of the customer.
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: The updated phone number of the customer.
 *                 example: "+987654321"
 *     responses:
 *       200:
 *         description: Customer updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer updated successfully.
 *                 customer:
 *                   type: object
 *       400:
 *         description: Validation error or invalid ID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error.
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Name is required."
 *       404:
 *         description: Customer not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found.
 *       500:
 *         description: Server error.
 */
exports.updateCustomerById = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, { name, email, phone }, { new: true, runValidators: true });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }

    console.error('Error updating customer:', error);
    next(error);
  }
};
