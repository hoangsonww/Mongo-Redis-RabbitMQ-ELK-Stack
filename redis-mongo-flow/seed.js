const { MongoClient } = require('mongodb');
const config = require('./config');

// Provide data to MongoDB for testing
async function seedData() {
    const mongoClient = new MongoClient(config.mongoURI);
    try {
        await mongoClient.connect();

        const dbName = 'myDatabase';
        const collectionName = 'myCollection';

        const mongodb = mongoClient.db(dbName);
        const collection = mongodb.collection(collectionName);

        const data = [
            { key: "user123", value: { name: "Alice", age: 30 } },
            { key: "product456", value: { name: "Widget", price: 9.99 } },
            { key: "order789", value: { product: "product456", quantity: 5 } },
            { key: "customer999", value: { name: "Bob", email: "customer999@gmail.com" } },
            { key: "bill1234", value: { order: "David", total: 49.95 } },
        ];

        await collection.insertMany(data);
        console.log("Data seeded successfully");
    }
    catch (error) {
        console.error("Error seeding data:", error);
    }
    finally {
        mongoClient.close();
    }
}

seedData();
