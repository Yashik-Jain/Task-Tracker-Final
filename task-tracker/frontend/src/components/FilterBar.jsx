import { useState, useEffect } from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="filter-bar">
      <div className="filter-bar-copy">
        <span className="filter-chip">Smart filters</span>
        <p>Refine your board in a click</p>
      </div>
      <input
        id="filter-search"
        type="text"
        className="filter-search"
        placeholder="🔍 Search tasks..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <select
        id="filter-status"
        className="filter-select"
        value={filters.status}
        onChange={(e) => onFilterChange({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        id="filter-priority"
        className="filter-select"
        value={filters.priority}
        onChange={(e) => onFilterChange({ priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        id="filter-sort"
        className="filter-select"
        value={filters.sort}
        onChange={(e) => onFilterChange({ sort: e.target.value })}
      >
        <option value="createdAt">Newest First</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title A–Z</option>
      </select>
    </div>
  );
};

export default FilterBar;
