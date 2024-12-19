const express = require('express');
const { searchExpenses } = require('../controllers/searchController');

const router = express.Router();

router.post('/', searchExpenses);

module.exports = router;
