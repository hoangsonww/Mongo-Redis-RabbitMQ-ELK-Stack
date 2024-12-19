const Customer = require('../models/customer');

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
 *               email:
 *                 type: string
 *                 description: The customer's email address.
 *               phone:
 *                 type: string
 *                 description: The customer's phone number.
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
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid request data
 *       500:
 *         description: Server error.
 */
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    next(error);
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
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid customer ID format' });
    }

    // Cast the id to ObjectId
    const customer = await Customer.findById(mongoose.Types.ObjectId(id));

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error retrieving customer by ID:", error);
    next(error);
  }
};
