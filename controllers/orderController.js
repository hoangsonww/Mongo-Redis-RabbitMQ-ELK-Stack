const Order = require('../models/order');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer who placed the order.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: The ID of the product ordered.
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the product ordered.
 *             example:
 *               customerId: "64c9b5f4e7a7d2b001e76a1b"
 *               items:
 *                 - productId: "64c9b5f4e7a7d2b001e76a1c"
 *                   quantity: 2
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error.
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { customerId, items } = req.body;

    // Validate required fields
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'customerId and items are required, and items cannot be empty.',
      });
    }

    // Calculate total amount
    const amount = items.reduce((total, item) => {
      if (!item.productId || !item.quantity) {
        throw new Error('Each item must have a productId and quantity.');
      }
      return total + item.quantity;
    }, 0);

    // Create and save the order
    const order = new Order({ customerId, items, amount });
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }

    // General server error
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
};

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error.
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('customerId');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error.
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customerId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error.
 */
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer who placed the order.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: The ID of the product ordered.
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the product ordered.
 *     responses:
 *       200:
 *         description: Order updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order updated successfully.
 *                 order:
 *                   type: object
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Order not found.
 *       500:
 *         description: Server error.
 */
exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { customerId, items } = req.body;

  try {
    if (!customerId && (!items || items.length === 0)) {
      return res.status(400).json({
        error: 'Validation error',
        details: 'Provide at least one field to update: customerId or items.',
      });
    }

    const updateData = {};
    if (customerId) updateData.customerId = customerId;
    if (items) {
      const amount = items.reduce((total, item) => {
        if (!item.productId || !item.quantity) {
          throw new Error('Each item must have a productId and quantity.');
        }
        return total + item.quantity;
      }, 0);
      updateData.items = items;
      updateData.amount = amount;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    next(error);
  }
};
