const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Budget = require('../models/budget');
const Expense = require('../models/expense');
const Task = require('../models/task');
const pool = require('../services/postgresService');

module.exports = async () => {
  try {
    // MongoDB: Seed Customers, Orders, Budgets, Expenses, and Tasks
    const customersCount = await Customer.countDocuments();
    const budgetsCount = await Budget.countDocuments();
    const tasksCount = await Task.countDocuments();

    if (customersCount === 0) {
      console.log('Seeding MongoDB customers and orders...');
      const sampleCustomers = [];
      for (let i = 1; i <= 50; i++) {
        sampleCustomers.push({
          name: `Customer${i}`,
          email: `customer${i}@example.com`,
          phone: `+12345678${i}`,
        });
      }
      const customers = await Customer.insertMany(sampleCustomers);

      const sampleOrders = [];
      for (let i = 0; i < customers.length; i++) {
        for (let j = 1; j <= 5; j++) {
          sampleOrders.push({
            customerId: customers[i]._id,
            amount: Math.floor(Math.random() * 500) + 1,
          });
        }
      }
      await Order.insertMany(sampleOrders);

      console.log('Customers and orders seeded into MongoDB.');
    } else {
      console.log('Customers and orders already exist. Skipping...');
    }

    if (budgetsCount === 0) {
      console.log('Seeding MongoDB budgets and expenses...');
      const sampleBudgets = [];
      for (let i = 1; i <= 20; i++) {
        sampleBudgets.push({
          name: `Budget${i}`,
          limit: Math.floor(Math.random() * 10000) + 1000, // Random limit between 1000 and 10000
        });
      }
      const budgets = await Budget.insertMany(sampleBudgets);

      const sampleExpenses = [];
      for (let i = 0; i < budgets.length; i++) {
        for (let j = 1; j <= 10; j++) {
          sampleExpenses.push({
            budgetId: budgets[i]._id,
            description: `Expense ${j} for ${budgets[i].name}`,
            amount: Math.floor(Math.random() * budgets[i].limit / 10) + 50, // Random amount within budget
          });
        }
      }
      await Expense.insertMany(sampleExpenses);

      console.log('Budgets and expenses seeded into MongoDB.');
    } else {
      console.log('Budgets and expenses already exist. Skipping...');
    }

    if (tasksCount === 0) {
      console.log('Seeding MongoDB tasks...');
      const sampleTasks = [];
      for (let i = 1; i <= 100; i++) {
        sampleTasks.push({
          description: `Task ${i}: Process analytics for user ${Math.ceil(i / 10)}`,
          status: i % 3 === 0 ? 'completed' : 'pending', // Randomly assign status
        });
      }
      await Task.insertMany(sampleTasks);

      console.log('Tasks seeded into MongoDB.');
    } else {
      console.log('Tasks already exist. Skipping...');
    }

    // PostgreSQL: Seed Transactions
    console.log('Seeding PostgreSQL transactions...');
    const result = await pool.query('SELECT COUNT(*) FROM transaction_logs');
    const transactionsCount = parseInt(result.rows[0].count, 10);

    if (transactionsCount === 0) {
      const seedTransactions = [];
      for (let i = 1; i <= 1000; i++) {
        seedTransactions.push({
          userId: `user${Math.ceil(i / 10)}`, // Each user gets 10 transactions
          description: `Transaction ${i}`,
          amount: parseFloat((Math.random() * 1000).toFixed(2)), // Random amount between 0 and 1000
          budgetId: `budget${Math.ceil(i / 50)}`, // Each budget gets 50 transactions
        });
      }

      const query = `
          INSERT INTO transaction_logs (user_id, description, amount, budget_id)
          VALUES ($1, $2, $3, $4);
      `;

      for (const transaction of seedTransactions) {
        await pool.query(query, [
          transaction.userId,
          transaction.description,
          transaction.amount,
          transaction.budgetId,
        ]);
      }

      console.log('Transactions seeded into PostgreSQL.');
    } else {
      console.log('Transactions already exist in PostgreSQL. Skipping...');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
