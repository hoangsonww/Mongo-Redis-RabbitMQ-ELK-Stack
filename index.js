const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const redisClient = require('./services/redisService');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swaggerConfig');
const { connectToKafka } = require('./apache-kafka/kafkaService');
const routes = require('./routes');
const config = require('./config/config');
const { connectToRabbitMQ } = require('./services/rabbitMQService');
const seedMongoData = require('./services/dataSeeder');
const startGrpcServer = require('./grpcServer');

const app = express();
app.use(express.json());

// Swagger Setup
const swaggerOptions = { customSiteTitle: 'Budget Management API Documentation' };
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerOptions));

// MongoDB Connection
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Kafka Connection (optional, non-critical)
connectToKafka().catch(err => {
  console.warn('Kafka initialization failed. The application will continue without Kafka.');
});

// RabbitMQ Connection
connectToRabbitMQ();

// Seed MongoDB Data
seedMongoData();

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'views', 'home.html');

  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading HTML file:', err.message);
      return res.status(500).send('An error occurred while loading the homepage.');
    }
    res.send(data);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

// Start gRPC Server
startGrpcServer();

// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/docs for API documentation`);
});

module.exports = app;
