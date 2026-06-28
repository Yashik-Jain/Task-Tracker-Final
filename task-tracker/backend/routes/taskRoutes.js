const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const {
  taskValidationRules,
  handleValidationErrors,
} = require('../middleware/validateTask');

router
  .route('/')
  .get(getAllTasks)
  .post(taskValidationRules, handleValidationErrors, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(taskValidationRules, handleValidationErrors, updateTask)
  .delete(deleteTask);

module.exports = router;
