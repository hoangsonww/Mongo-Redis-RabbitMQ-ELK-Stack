const express = require('express');
const { sendTask, checkTaskStatus, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// Add a task to RabbitMQ
router.post('/', sendTask);
router.post('/tasks', sendTask);

// Check the status of a task (using Redis)
router.get('/:id', checkTaskStatus);

// Delete a task from RabbitMQ
router.delete('/:id', deleteTask);

module.exports = router;
