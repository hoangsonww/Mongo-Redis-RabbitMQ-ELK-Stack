// kafkaService.js
const { Kafka } = require('kafkajs'); // Import KafkaJS
const config = require('../config'); // Import your configuration

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [config.kafkaBroker], // Provide the Kafka broker URL from your config
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// Function to connect to Kafka
async function connectToKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('Kafka Producer and Consumer Connected');

    // Subscribe to Kafka topic
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    // Consume messages from Kafka
    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
      },
    });

  } catch (err) {
    console.error('Kafka Connection Error:', err);
  }
}

// Kafka Message Producer
async function sendMessageToKafka(message) {
  try {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: message }],
    });
    console.log(`Sent message to Kafka: ${message}`);
  } catch (err) {
    console.error('Error sending message to Kafka:', err);
  }
}

// Export Kafka functions
module.exports = {
  connectToKafka,
  sendMessageToKafka,
};
