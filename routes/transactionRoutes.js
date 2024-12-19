const express = require('express');
const {
  addTransactionLog,
  getAllTransactionLogs,
  getTransactionLogsByUser,
} = require('../controllers/transactionController');

const router = express.Router();

router.post('/', addTransactionLog);
router.get('/', getAllTransactionLogs);
router.get('/user/:userId', getTransactionLogsByUser);

module.exports = router;
