const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { MongoClient } = require('mongodb');
const config = require('./config');

const app = express();
app.use(express.json());

// Establish connections to MongoDB and Redis
const mongoClient = new MongoClient(config.mongoURI);
const redisClient = redis.createClient();

const dbName = 'myDatabase';
const collectionName = 'myCollection';

app.get('/data/:key', async (req, res) => {
    const key = req.params.key;

    // First try to get data from Redis
    let data = await redisClient.get(key);
    if (data) {
        return res.json({ source: 'redis', data: JSON.parse(data) });
    }

    // If data not found in Redis, query MongoDB
    try {
        const mongodb = mongoClient.db(dbName);
        const collection = mongodb.collection(collectionName);

        data = await collection.findOne({ key });

        // After successfully querying MongoDB, store data in Redis for future requests
        if (data) {
            await redisClient.set(key, JSON.stringify(data));
            return res.json({ source: 'mongodb', data });
        }
    }
    catch (error) {
        console.error("Error querying MongoDB:", error);
        res.status(500).json({ message: "Error retrieving data" });
    }

    // If data not found in MongoDB, return data not found
    res.status(404).json({ message: 'Data not found' });
});

// Start the server
async function startServer() {
    await mongoClient.connect();
    await redisClient.connect();
    app.listen(config.port, () => {
        console.log(`Server started successfully...`);
    });
}

startServer();
