import TaskCard from './TaskCard';

const TaskList = ({ tasks, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="state-message">
        <div className="loading-spinner" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-message state-error">
        <span className="state-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-message state-empty">
        <span className="empty-icon">📋</span>
        <p>No tasks found. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
