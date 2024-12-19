const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Budget Management API',
      version: '1.0.0',
      description: 'A comprehensive backend API for managing budgets, expenses, orders, transactions, and notifications.',
      contact: {
        name: 'Son Nguyen',
        url: 'https://sonnguyenhoang.com',
        email: 'hoangson091104@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://budget-management-backend-api.onrender.com',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./controllers/*.js', './models/*.js', './routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
