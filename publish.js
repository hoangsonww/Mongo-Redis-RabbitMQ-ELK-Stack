const amqp = require('amqplib');
const config = require('./config');

async function publishMessage(messageContent) {
  try {
    const connection = await amqp.connect(`amqp://${config.rabbitMQHost}`);
    const channel = await connection.createChannel();
    const queue = 'task_queue';

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(messageContent), { persistent: true });
    console.log(" [x] Sent '%s'", messageContent);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('RabbitMQ Error:', error);
  }
}

const message = 'This is a test message!';
publishMessage(message);
