const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const amqp = require('amqplib');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('./config');
const testRoutes = require('./routes/test');

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Connect to Redis
const redisClient = redis.createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`,
});

redisClient
  .connect()
  .then(() => {
    console.log('Redis Connected');
    // Test Redis by setting and getting a simple key-value pair
    return redisClient.set('testKey', 'Hello from Redis');
  })
  .then(() => redisClient.get('testKey'))
  .then(value => console.log(`Redis Test: ${value}`))
  .catch(err => console.error('Redis Connection Error:', err));

const app = express();

app.use('/api/test', testRoutes);

app.get('/', (req, res) => {
  const message = 'Server is running! MongoDB and Redis connections established.';
  console.log(message);
  res.send(message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/ to test the connection.`);
});

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(`amqp://${config.rabbitMQHost}`);
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    console.log('RabbitMQ Connected');

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(
      queue,
      async msg => {
        if (msg !== null) {
          const messageContent = msg.content.toString();

          try {
            console.log(" [x] Received '%s'", messageContent);

            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error('RabbitMQ Error:', err);
  }
}

connectToRabbitMQ();

async function getExistingConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  } else {
    throw new Error('Mongoose is not connected. Please ensure the connection is established before using this function.');
  }
}

// MongoDB Aggregation Pipeline Demo
async function performAggregation() {
  const mongoClient = new MongoClient(config.mongoURI);
  try {
    // Connect to the existing MongoDB connection we created earlier
    const db = await mongoClient.connect().then(() => getExistingConnection());

    const ordersCollection = db.collection('orders');
    const customersCollection = db.collection('customers');

    const sampleOrders = [
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 50 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 80 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 35 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 100 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 45 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 60 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 75 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 90 },
      { _id: new ObjectId(), customerId: new ObjectId(), amount: 55 },
    ];

    const sampleCustomers = [
      { _id: sampleOrders[0].customerId, name: 'Alice' },
      { _id: sampleOrders[1].customerId, name: 'Bob' },
      { _id: sampleOrders[2].customerId, name: 'Charlie' },
      { _id: sampleOrders[3].customerId, name: 'David' },
      { _id: sampleOrders[4].customerId, name: 'Eve' },
      { _id: sampleOrders[5].customerId, name: 'Frank' },
      { _id: sampleOrders[6].customerId, name: 'Grace' },
      { _id: sampleOrders[7].customerId, name: 'Helen' },
      { _id: sampleOrders[8].customerId, name: 'Ivy' },
    ];

    if ((await ordersCollection.countDocuments()) === 0) {
      await ordersCollection.insertMany(sampleOrders);
    }

    if ((await customersCollection.countDocuments()) === 0) {
      await customersCollection.insertMany(sampleCustomers);
    }

    const aggregationResult = await ordersCollection
      .aggregate([
        // Performs a left outer join between the orders collection and the customers collection.
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerDetails', // The result of the join will be stored in the customerDetails field.
          },
        },
        // Unwinds the customerDetails array to create a separate document for each element in the array.
        { $unwind: '$customerDetails' },
        // Groups the documents by the customer name and calculates the total order value for each customer.
        {
          $group: {
            _id: '$customerDetails.name',
            totalOrderValue: { $sum: '$amount' },
          },
        },
      ])
      .toArray();

    console.log('Aggregation result:', aggregationResult);
  } catch (error) {
    console.error('MongoDB Error:', error);
  } finally {
    await mongoClient.close();
  }
}

performAggregation();
