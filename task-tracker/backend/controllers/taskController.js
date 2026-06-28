const Task = require('../models/Task');

const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sort, order } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = {};
    if (sort && ['dueDate', 'priority', 'createdAt', 'title'].includes(sort)) {
      sortObj[sort] = sortOrder;
    } else {
      sortObj.createdAt = -1;
    }

    const tasks = await Task.find(filter).sort(sortObj);
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTasks, createTask, getTaskById, updateTask, deleteTask };
