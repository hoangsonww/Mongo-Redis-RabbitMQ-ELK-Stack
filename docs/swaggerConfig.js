const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with MongoDB, Redis, RabbitMQ, and Kafka',
      version: '1.0.0',
      description: 'A simple Express Backend API integrated with multiple services',
      contact: {
        name: 'Son Nguyen',
        url: 'https://sonnguyenhoang.com',
        email: 'hoangson091104@gmail.com',
      },
      servers: [
        {
          url: 'http://localhost:10000',
          description: 'Local Development Server',
        },
        {
          url: 'https://mongo-redis-rabbitmq-kafka-elk-backend.onrender.com',
          description: 'Production Server',
        },
      ],
    },
  },
  apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
