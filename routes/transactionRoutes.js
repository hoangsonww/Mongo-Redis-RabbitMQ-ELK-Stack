const express = require('express');
const {
  addTransactionLog,
  getAllTransactionLogs,
  getTransactionLogsByUser,
  updateTransactionLog,
  deleteTransactionLog,
} = require('../controllers/transactionController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, addTransactionLog);
router.get('/', authenticate, getAllTransactionLogs);
router.get('/user/:userId', authenticate, getTransactionLogsByUser);
router.put('/:id', authenticate, updateTransactionLog);
router.delete('/:id', authenticate, deleteTransactionLog);

module.exports = router;
