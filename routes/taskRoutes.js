const express = require('express');
const { sendTask, checkTaskStatus } = require('../controllers/taskController');

const router = express.Router();

// Add a task to RabbitMQ
router.post('/', sendTask);
router.post('/tasks', sendTask);

// Check the status of a task (using Redis)
router.get('/tasks/:id/status', checkTaskStatus);

module.exports = router;
