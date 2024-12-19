const redis = require('redis');
const config = require('../config/config');

let redisClient;

const connectToRedis = async () => {
  try {
    // Create Redis client
    redisClient = redis.createClient({ url: config.redisUrl });

    // Event: Successful connection
    redisClient.on('connect', () => {
      console.log('Redis Connected');
    });

    // Event: Redis client is ready to use
    redisClient.on('ready', () => {
      console.log('Redis is ready');
    });

    // Event: Redis client disconnected
    redisClient.on('end', () => {
      console.warn('Redis connection closed');
    });

    // Event: Socket closed unexpectedly
    redisClient.on('error', (err) => {
      console.error('Redis Error:', err.message);
    });

    // Connect to Redis
    await redisClient.connect();
  } catch (err) {
    console.error('Error connecting to Redis:', err.message);

    // Retry connection after a delay
    setTimeout(connectToRedis, 5000);
  }
};

// Initialize Redis connection
connectToRedis();

module.exports = redisClient;
