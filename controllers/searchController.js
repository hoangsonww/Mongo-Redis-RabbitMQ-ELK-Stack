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
 *               page:
 *                 type: integer
 *                 description: The page number for paginated results.
 *                 example: 1
 *               size:
 *                 type: integer
 *                 description: The number of results per page.
 *                 example: 10
 *     responses:
 *       200:
 *         description: Search results for expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of matching expenses.
 *                   example: 2
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                   example: 1
 *                 size:
 *                   type: integer
 *                   description: Number of results per page.
 *                   example: 10
 *                 expenses:
 *                   type: array
 *                   description: List of matching expenses.
 *                   items:
 *                     type: object
 *                     properties:
 *                       budgetId:
 *                         type: string
 *                         example: "64c9f8f2a73c2f001b3c68f4"
 *                       description:
 *                         type: string
 *                         example: "Flight tickets"
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-19T10:48:23.606Z"
 *       400:
 *         description: Missing or invalid search query.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred"
 *                 details:
 *                   type: string
 *                   example: "Internal server error details"
 */
exports.searchExpenses = async (req, res, next) => {
  const { query, page = 1, size = 10 } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Elasticsearch query
    const esQuery = {
      index: 'expenses',
      body: {
        query: {
          bool: {
            should: [
              { term: { 'description.keyword': query } }, // Exact match
              { match: { description: query } }, // Partial match
              { match: { budgetId: query } }, // Match by budgetId
            ],
          },
        },
        from: (page - 1) * size, // Pagination: starting index
        size, // Pagination: number of results per page
      },
    };

    // Log the constructed query for debugging
    console.log('Elasticsearch query:', JSON.stringify(esQuery, null, 2));

    // Perform search
    const result = await esClient.search(esQuery);

    res.status(200).json({
      total: result.hits.total.value,
      page,
      size,
      expenses: result.hits.hits.map(hit => hit._source),
    });
  } catch (error) {
    console.error('Elasticsearch search error:', error);

    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.meta ? error.meta.body.error : error.message,
    });
  }
};
