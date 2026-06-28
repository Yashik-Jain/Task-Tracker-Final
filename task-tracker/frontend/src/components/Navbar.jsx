const Navbar = ({ taskCount, darkMode, onToggleTheme }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">✓</span>
        <h1 className="navbar-title">Task Tracker</h1>
      </div>
      <div className="navbar-actions">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle dark mode">
          {darkMode ? '☀️' : '🌙'}
        </button>
        <span className="navbar-count">
          {taskCount} task{taskCount !== 1 ? 's' : ''}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
