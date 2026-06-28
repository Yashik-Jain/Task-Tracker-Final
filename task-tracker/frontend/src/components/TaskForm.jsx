import { useState, useEffect } from 'react';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ onSubmit, onCancel, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'todo',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData(defaultForm);
    }
    setFieldErrors({});
  }, [initialData]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
    if (!['todo', 'in-progress', 'done'].includes(formData.status)) {
      errors.status = 'Invalid status selected';
    }
    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.dueDate) < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const result = await onSubmit(formData);
    if (result?.errors) {
      const serverErrors = {};
      result.errors.forEach((err) => {
        serverErrors[err.field] = err.message;
      });
      setFieldErrors(serverErrors);
    } else if (result?.success) {
      setFormData(defaultForm);
      setFieldErrors({});
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Title <span className="required-star">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          className={`form-input ${fieldErrors.title ? 'input-error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength={100}
        />
        {fieldErrors.title && (
          <span className="field-error">{fieldErrors.title}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          className="form-input form-textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional task description..."
          maxLength={500}
          rows={3}
        />
        {fieldErrors.description && (
          <span className="field-error">{fieldErrors.description}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">
            Status
          </label>
          <select
            id="task-status"
            name="status"
            className="form-input"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {fieldErrors.status && (
            <span className="field-error">{fieldErrors.status}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">
            Priority
          </label>
          <select
            id="task-priority"
            name="priority"
            className="form-input"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldErrors.priority && (
            <span className="field-error">{fieldErrors.priority}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="task-dueDate" className="form-label">
            Due Date
          </label>
          <input
            id="task-dueDate"
            name="dueDate"
            type="date"
            className={`form-input ${fieldErrors.dueDate ? 'input-error' : ''}`}
            value={formData.dueDate}
            onChange={handleChange}
          />
          {fieldErrors.dueDate && (
            <span className="field-error">{fieldErrors.dueDate}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="btn-loading">
              <span className="spinner" /> Saving...
            </span>
          ) : initialData ? (
            'Update Task'
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
