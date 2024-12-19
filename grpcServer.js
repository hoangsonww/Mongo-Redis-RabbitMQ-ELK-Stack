const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const Budget = require('./models/budget');
const Expense = require('./models/expense');

// Load gRPC Proto
const PROTO_PATH = path.join(__dirname, 'proto/budget.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const budgetProto = grpc.loadPackageDefinition(packageDefinition).budget;

// Implement BudgetManager Service
const budgetManager = {
  // Get a Budget
  GetBudget: async (call, callback) => {
    try {
      const { budgetId } = call.request;
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        return callback(new Error('Budget not found'), null);
      }
      callback(null, {
        budgetId: budget._id.toString(),
        name: budget.name,
        limit: budget.limit,
        createdAt: budget.createdAt.toISOString(),
      });
    } catch (error) {
      callback(error, null);
    }
  },

  // Create a Budget
  CreateBudget: async (call, callback) => {
    try {
      const { name, limit } = call.request;
      const budget = new Budget({ name, limit });
      const savedBudget = await budget.save();
      callback(null, { budgetId: savedBudget._id.toString() });
    } catch (error) {
      callback(error, null);
    }
  },

  // Add an Expense
  AddExpense: async (call, callback) => {
    try {
      const { budgetId, description, amount } = call.request;
      const budget = await Budget.findById(budgetId);
      if (!budget) {
        return callback(new Error('Budget not found'), null);
      }
      const expense = new Expense({ budgetId, description, amount });
      const savedExpense = await expense.save();
      callback(null, { expenseId: savedExpense._id.toString() });
    } catch (error) {
      callback(error, null);
    }
  },

  // Get Expenses for a Budget
  GetExpenses: async (call, callback) => {
    try {
      const { budgetId } = call.request;
      const expenses = await Expense.find({ budgetId });
      if (!expenses.length) {
        return callback(new Error('No expenses found for this budget'), null);
      }
      callback(null, {
        expenses: expenses.map(exp => ({
          expenseId: exp._id.toString(),
          description: exp.description,
          amount: exp.amount,
          createdAt: exp.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      callback(error, null);
    }
  },
};

// Start gRPC Server
const startGrpcServer = () => {
  const server = new grpc.Server();
  server.addService(budgetProto.BudgetManager.service, budgetManager);
  const PORT = process.env.GRPC_PORT || 50051;
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting gRPC server:', err);
      process.exit(1);
    }
    console.log(`gRPC Server running at http://0.0.0.0:${port}`);
    server.start();
  });
};

module.exports = startGrpcServer;
