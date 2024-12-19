const express = require('express');
const {
  addTransactionLog,
  getAllTransactionLogs,
  getTransactionLogsByUser,
  updateTransactionLog,
  deleteTransactionLog,
} = require('../controllers/transactionController');

const router = express.Router();

router.post('/', addTransactionLog);
router.get('/', getAllTransactionLogs);
router.get('/user/:userId', getTransactionLogsByUser);
router.put('/:id', updateTransactionLog);
router.delete('/:id', deleteTransactionLog);

module.exports = router;
