const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');
const app = require('./index'); // Import the app

jest.mock('./services/redisService', () => ({
  connect: jest.fn(),
  on: jest.fn(),
}));

jest.mock('./services/rabbitMQService', () => ({
  connectToRabbitMQ: jest.fn(),
}));

jest.mock('./apache-kafka/kafkaService', () => ({
  connectToKafka: jest.fn(() => Promise.resolve()),
}));

jest.mock('./services/dataSeeder', () => jest.fn());

jest.mock('./grpcServer', () => jest.fn());

describe('Budget Management API', () => {
  let mongoConnection;

  beforeAll(async () => {
    // Avoid multiple MongoDB connections
    if (mongoose.connection.readyState === 0) {
      mongoConnection = await mongoose.connect('mongodb://localhost:27017/testDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Ensure all connections are closed properly
    if (mongoConnection) {
      await mongoose.connection.close();
    }
  });

  describe('GET /', () => {
    it('should return the homepage HTML content', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<!DOCTYPE html>'); // Ensure it returns HTML content
    });

    it('should return a 500 error if the HTML file cannot be read', async () => {
      jest.spyOn(fs, 'readFile').mockImplementation((path, options, callback) => {
        callback(new Error('File not found'), null);
      });

      const response = await request(app).get('/');
      expect(response.status).toBe(500);
      expect(response.text).toBe('An error occurred while loading the homepage.');

      fs.readFile.mockRestore(); // Restore the original implementation
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger UI at /docs', async () => {
      const response = await request(app).get('/docs');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Swagger UI');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should return 500 for unhandled errors', async () => {
      app.get('/error', (req, res) => {
        throw new Error('Test Error');
      });

      const response = await request(app).get('/error');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'An unexpected error occurred',
        details: 'Test Error',
      });
    });
  });

  describe('Database Connections', () => {
    it('should connect to MongoDB successfully', () => {
      expect(mongoose.connection.readyState).toBe(1); // Ready state 1 = connected
    });

    it('should mock Redis connection', () => {
      const redisService = require('./services/redisService');
      expect(redisService.connect).toHaveBeenCalled();
    });

    it('should mock RabbitMQ connection', () => {
      const rabbitMQService = require('./services/rabbitMQService');
      expect(rabbitMQService.connectToRabbitMQ).toHaveBeenCalled();
    });

    it('should mock Kafka connection', () => {
      const kafkaService = require('./apache-kafka/kafkaService');
      expect(kafkaService.connectToKafka).toHaveBeenCalled();
    });
  });
});
