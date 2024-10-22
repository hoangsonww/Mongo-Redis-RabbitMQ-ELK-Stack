const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/test/route1:
 *   get:
 *     summary: Get Test Route 1
 *     description: Returns a message from Test Route 1.
 *     responses:
 *       200:
 *         description: A message from Route 1
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: This is Test Route 1!
 */
router.get('/route1', (req, res) => {
  res.send('This is Test Route 1!');
});

/**
 * @swagger
 * /api/test/route2:
 *   get:
 *     summary: Get Test Route 2
 *     description: Returns a message from Test Route 2.
 *     responses:
 *       200:
 *         description: A message from Route 2
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: This is Test Route 2!
 */
router.get('/route2', (req, res) => {
  res.send('This is Test Route 2!');
});

module.exports = router;
