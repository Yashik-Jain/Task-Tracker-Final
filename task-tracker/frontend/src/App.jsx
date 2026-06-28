import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useTasks from './hooks/useTasks';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './styles/global.css';

function App() {
  const { tasks, loading, error, filters, addTask, editTask, removeTask, updateFilters } =
    useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = window.localStorage.getItem('task-tracker-theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem('task-tracker-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    let result;
    if (editingTask) {
      result = await editTask(editingTask._id, formData);
    } else {
      result = await addTask(formData);
    }
    setIsSubmitting(false);
    if (result?.success) {
      handleCloseForm();
    }
    return result;
  };

  return (
    <div className={`app ${darkMode ? 'theme-dark' : ''}`}>
      <Navbar taskCount={tasks.length} darkMode={darkMode} onToggleTheme={() => setDarkMode((prev) => !prev)} />

      <main className="main-content">
        <section className="hero-panel">
          <div className="content-header">
            <div className="content-header-left">
              <span className="hero-pill"> Focus Mode</span>
              <h2 className="page-title">My Tasks</h2>
              <p className="page-subtitle">Organize, track, and conquer your work</p>
            </div>
            <button
              id="add-task-btn"
              className="btn btn-primary btn-add"
              onClick={handleOpenCreate}
            >
              <span className="btn-icon">+</span> Add Task
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Active</span>
              <strong>{tasks.filter((task) => task.status !== 'done').length}</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Completed</span>
              <strong>{tasks.filter((task) => task.status === 'done').length}</strong>
            </div>
          </div>
        </section>

        <FilterBar filters={filters} onFilterChange={updateFilters} />

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={removeTask}
        />
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={handleCloseForm}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {editingTask ? ' Edit Task' : ' Create New Task'}
              </h2>
              <button
                className="modal-close"
                onClick={handleCloseForm}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <TaskForm
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              initialData={editingTask}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
