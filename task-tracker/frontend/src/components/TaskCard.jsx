const statusConfig = {
  todo: { label: 'Todo', cls: 'badge-gray' },
  'in-progress': { label: 'In Progress', cls: 'badge-blue' },
  done: { label: 'Done', cls: 'badge-green' },
};

const priorityConfig = {
  low: { label: 'Low', cls: 'badge-green' },
  medium: { label: 'Medium', cls: 'badge-amber' },
  high: { label: 'High', cls: 'badge-red' },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return new Date(dueDate) < new Date();
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id);
    }
  };

  const statusInfo = statusConfig[task.status] || statusConfig.todo;
  const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className={`task-card ${task.status === 'done' ? 'task-card-done' : ''} ${overdue ? 'task-card-overdue' : ''}`}
    >
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-badges">
          <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>
          <span className={`badge ${priorityInfo.cls}`}>{priorityInfo.label}</span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.dueDate && (
          <span className={`task-due ${overdue ? 'due-overdue' : ''}`}>
            📅 Due: {formatDate(task.dueDate)}
            {overdue && ' ⚠ Overdue'}
          </span>
        )}
        <span className="task-created">🕐 {formatDate(task.createdAt)}</span>
      </div>

      <div className="task-actions">
        <button
          className="btn btn-sm btn-edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.title}`}
        >
           Edit
        </button>
        <button
          className="btn btn-sm btn-delete"
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
        >
           Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
