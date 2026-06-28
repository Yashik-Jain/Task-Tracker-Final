import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as api from '../api/tasks';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sort: 'createdAt',
    order: 'desc',
  });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      if (filters.order) params.order = filters.order;

      const res = await api.fetchTasks(params);
      setTasks(res.data.data);
    } catch (err) {
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      setTasks((prev) => [res.data.data, ...prev]);
      toast.success('Task created successfully!');
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = err.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, errors };
    }
  };

  const editTask = async (id, taskData) => {
    try {
      const res = await api.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      toast.success('Task updated successfully!');
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      const message = err.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, errors };
    }
  };

  const removeTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return { tasks, loading, error, filters, addTask, editTask, removeTask, updateFilters };
};

export default useTasks;
