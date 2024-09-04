const express = require('express');
const router = express.Router();

router.get('/route1', (req, res) => {
  res.send('This is Test Route 1!');
});

router.get('/route2', (req, res) => {
  res.send('This is Test Route 2!');
});

module.exports = router;
