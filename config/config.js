require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_DB_URI,
  redisUrl: process.env.REDIS_URL,
  rabbitMQUrl: process.env.RABBITMQ_URL,
  kafkaBroker: process.env.KAFKA_BROKER,
  jwtSecret: process.env.JWT_SECRET,
  elasticSearchUrl: process.env.ELASTIC_SEARCH_URL,
  postgresUrl: process.env.POSTGRES_URL,
};
