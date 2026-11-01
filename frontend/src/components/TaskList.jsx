import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onResetFilters,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreate,
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <section className="task-section">
      {/* Search & Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-select-wrapper">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Completed</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label htmlFor="priority-filter">Priority:</label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-text"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert-error">
          <div className="alert-content">
            <strong>Failed to load tasks:</strong> {error}
          </div>
          <button type="button" className="btn btn-retry" onClick={onRetry}>
            ↻ Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Connecting to Django API & loading tasks...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">{hasActiveFilters ? '🔍' : '📝'}</div>
          <h3>{hasActiveFilters ? 'No matching tasks found' : 'No tasks yet'}</h3>
          <p>
            {hasActiveFilters
              ? 'Try adjusting your search keywords or clear your active filters.'
              : 'Create your first task to get organized and stay on track!'}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilters}
            >
              Clear All Filters
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenCreate}
            >
              + Create Your First Task
            </button>
          )}
        </div>
      )}

      {/* Task Cards Grid */}
      {!loading && tasks.length > 0 && (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}
