const redis = require('redis');
const config = require('../config/config');

const redisClient = redis.createClient({ url: config.redisUrl });

const connectToRedis = async () => {
  try {
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
    redisClient.on('error', err => {
      console.warn('Redis Error:', err.message);
    });

    // Connect to Redis
    await redisClient.connect();
  } catch (err) {
    console.warn('Error connecting to Redis:', err.message);

    // Retry connection after a delay
    setTimeout(connectToRedis, 5000);
  }
};

// Initialize Redis connection
connectToRedis();

module.exports = redisClient;
