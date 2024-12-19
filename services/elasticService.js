const { Client } = require('@elastic/elasticsearch');
const config = require('../config/config');

// Initialize ElasticSearch client
const esClient = new Client({ node: config.elasticSearchUrl });

/**
 * Check if ElasticSearch is connected and the index exists
 */
const initializeElasticSearch = async () => {
  try {
    const { body: health } = await esClient.cluster.health({});
    console.log('ElasticSearch cluster health:', health.status);

    // Ensure "expenses" index exists
    const indexExists = await esClient.indices.exists({ index: 'expenses' });
    if (!indexExists.body) {
      await esClient.indices.create({
        index: 'expenses',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              description: { type: 'text' },
              amount: { type: 'float' },
              budgetId: { type: 'keyword' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      console.log('ElasticSearch "expenses" index created.');
    } else {
      console.log('ElasticSearch "expenses" index already exists.');
    }
  } catch (error) {
    console.error('Error initializing ElasticSearch:', error.message);
  }
};

initializeElasticSearch();

module.exports = esClient;
