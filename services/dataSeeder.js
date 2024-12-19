const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');

module.exports = async () => {
  try {
    const ordersCount = await Order.countDocuments();
    const customersCount = await Customer.countDocuments();

    if (ordersCount === 0 && customersCount === 0) {
      const sampleCustomers = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
      ];
      const customers = await Customer.insertMany(sampleCustomers);

      const sampleOrders = [
        { customerId: customers[0]._id, amount: 100 },
        { customerId: customers[1]._id, amount: 200 },
      ];
      await Order.insertMany(sampleOrders);

      console.log('Sample data seeded into MongoDB');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};
