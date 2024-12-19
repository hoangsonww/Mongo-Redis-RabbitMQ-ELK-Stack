const esClient = require('../services/elasticService');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API for searching expenses
 */

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search expenses in Elasticsearch
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: The search query string.
 *                 example: "Flight"
 *     responses:
 *       200:
 *         description: Search results for expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   budgetId:
 *                     type: string
 *                     example: "64c9f8f2a73c2f001b3c68f4"
 *                   description:
 *                     type: string
 *                     example: "Flight tickets"
 *                   amount:
 *                     type: number
 *                     example: 500
 *       400:
 *         description: Missing search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Search query is required"
 *       500:
 *         description: Server error.
 */
exports.searchExpenses = async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const result = await esClient.search({
      index: 'expenses',
      query: {
        multi_match: {
          query,
          fields: ['description', 'budgetId'],
        },
      },
    });

    res.status(200).json(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    next(error);
  }
};
