const { Client } = require('@elastic/elasticsearch');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Configuration
const elasticsearchNode = 'http://localhost:9200';
const logstashInputPort = 5044;
const kibanaUrl = 'http://localhost:5601';
const testIndexName = 'elk_test_index';

// Test functions
async function testElasticsearch() {
  const client = new Client({ node: elasticsearchNode });
  const health = await client.cluster.health();
  return health.body.status === 'green';
}

async function testLogstash() {
  try {
    const message = { timestamp: new Date(), message: 'ELK Stack test message' };
    const response = await fetch(`http://localhost:${logstashInputPort}`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function testKibana() {
  try {
    const response = await fetch(kibanaUrl);
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function testElasticsearchData() {
  const client = new Client({ node: elasticsearchNode });
  try {
    await client.indices.refresh({ index: testIndexName });
    const searchResult = await client.search({
      index: testIndexName,
      query: {
        match: {
          message: 'ELK Stack test message',
        },
      },
    });
    return searchResult.body.hits.total.value > 0;
  } catch (err) {
    return false;
  }
}

// Run tests
async function runTests() {
  if (!((await testElasticsearch()) && (await testLogstash()) && (await testKibana()))) {
    console.error('Basic connection tests failed. Exiting.');
    return;
  }

  console.log('Waiting for data to be indexed...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

  const dataIndexed = await testElasticsearchData();
  console.log('Data indexed in Elasticsearch:', dataIndexed);
}

runTests().catch(console.error);
