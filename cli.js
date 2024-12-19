#!/usr/bin/env node

const { Command } = require('commander');
const mongoose = require('mongoose');
const config = require('./config/config');
const seedMongoData = require('./services/dataSeeder');
const { broadcastNotification } = require('./services/websocketService');

const program = new Command();

program.name('budget-manager').description('A CLI for managing budgets, tasks, orders, and more.').version('1.0.0');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(config.mongoURI, {});
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

// CLI Command: Seed MongoDB
program
  .command('seed')
  .description('Seed the MongoDB database with initial data')
  .action(async () => {
    await connectToMongoDB();
    await seedMongoData();
    console.log('Database seeded successfully.');
    process.exit(0);
  });

// CLI Command: Send Notification
program
  .command('notify <message>')
  .description('Send a real-time notification to WebSocket clients')
  .action(message => {
    broadcastNotification({ message });
    console.log(`Notification sent: ${message}`);
    process.exit(0);
  });

// CLI Command: List Budgets
program
  .command('list-budgets')
  .description('List all budgets in the database')
  .action(async () => {
    await connectToMongoDB();
    const Budget = require('./models/budget');
    const budgets = await Budget.find();
    console.log('Budgets:', budgets);
    process.exit(0);
  });

// CLI Command: Add Task
program
  .command('add-task <description>')
  .description('Add a new task to the task queue')
  .action(async description => {
    await connectToMongoDB();
    const Task = require('./models/task');
    const newTask = new Task({ description, status: 'pending' });
    await newTask.save();
    console.log('Task added:', newTask);
    process.exit(0);
  });

// CLI Command: List Orders
program
  .command('list-orders')
  .description('List all orders in the database')
  .action(async () => {
    await connectToMongoDB();
    const Order = require('./models/order');
    const orders = await Order.find().populate('customerId');
    console.log('Orders:', orders);
    process.exit(0);
  });

// CLI Command: Add Order
program
  .command('add-order <customerId> <amount>')
  .description('Add a new order')
  .action(async (customerId, amount) => {
    await connectToMongoDB();
    const Order = require('./models/order');
    const newOrder = new Order({ customerId, amount, status: 'pending' });
    await newOrder.save();
    console.log('Order added:', newOrder);
    process.exit(0);
  });

// CLI Command: List Customers
program
  .command('list-customers')
  .description('List all customers in the database')
  .action(async () => {
    await connectToMongoDB();
    const Customer = require('./models/customer');
    const customers = await Customer.find();
    console.log('Customers:', customers);
    process.exit(0);
  });

// CLI Command: Add Customer
program
  .command('add-customer <name> <email> [phone]')
  .description('Add a new customer')
  .action(async (name, email, phone) => {
    await connectToMongoDB();
    const Customer = require('./models/customer');
    const newCustomer = new Customer({ name, email, phone });
    await newCustomer.save();
    console.log('Customer added:', newCustomer);
    process.exit(0);
  });

// CLI Command: Search Expenses
program
  .command('search-expenses <query>')
  .description('Search for expenses using a query')
  .action(async query => {
    const esClient = require('./services/elasticService');
    try {
      const result = await esClient.search({
        index: 'expenses',
        query: {
          multi_match: {
            query,
            fields: ['description', 'budgetId'],
          },
        },
      });
      console.log(
        'Search results:',
        result.hits.hits.map(hit => hit._source)
      );
    } catch (error) {
      console.error('Error searching expenses:', error.message);
    }
    process.exit(0);
  });

// CLI Command: GraphQL Query
program
  .command('graphql-query <query>')
  .description('Perform a GraphQL query')
  .action(async query => {
    const axios = require('axios');
    try {
      const response = await axios.post('http://localhost:3000/graphql', { query });
      console.log('GraphQL Response:', response.data);
    } catch (error) {
      console.error('Error performing GraphQL query:', error.message);
    }
    process.exit(0);
  });

// Enhance Help Command
program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('  $ budget-manager seed');
  console.log('  $ budget-manager notify "Hello World!"');
  console.log('  $ budget-manager list-budgets');
  console.log('  $ budget-manager add-task "New Task Description"');
});

program.parse(process.argv);
