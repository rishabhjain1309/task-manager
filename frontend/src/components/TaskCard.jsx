export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const isDone = task.status === 'DONE';

  // Check if overdue
  const isOverdue = (() => {
    if (!task.due_date || isDone) return false;
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  })();

  const priorityLabels = {
    LOW: 'Low Priority',
    MEDIUM: 'Medium Priority',
    HIGH: 'High Priority',
  };

  const statusLabels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Completed',
  };

  return (
    <div className={`task-card ${isDone ? 'task-card-done' : ''}`}>
      <div className="task-card-top">
        <div className="task-badges">
          <span className={`badge-priority badge-priority-${task.priority.toLowerCase()}`}>
            {priorityLabels[task.priority] || task.priority}
          </span>
          {isOverdue && <span className="badge-overdue">Overdue</span>}
        </div>

        <div className="task-actions">
          <button
            type="button"
            className="btn-icon btn-edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✎ Edit
          </button>
          <button
            type="button"
            className="btn-icon btn-delete"
            onClick={() => onDelete(task.id, task.title)}
            title="Delete task"
          >
            ✕ Delete
          </button>
        </div>
      </div>

      <h3 className={`task-title ${isDone ? 'title-done' : ''}`}>{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.due_date && (
          <div className="meta-item">
            <span className="meta-label">📅 Due:</span>
            <span className={`meta-value ${isOverdue ? 'meta-overdue' : ''}`}>
              {task.due_date}
            </span>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-label">🕒 Created:</span>
          <span className="meta-value">
            {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-footer">
        <label className="status-select-label">
          Status:
          <select
            className={`status-select status-select-${task.status.toLowerCase()}`}
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>
        </label>
      </div>
    </div>
  );
}
