export default function DashboardStats({ tasks, activeStatusFilter, onStatusFilterChange }) {
  const total = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  const stats = [
    {
      id: 'ALL',
      label: 'Total Tasks',
      count: total,
      colorClass: 'stat-total',
      icon: '📋',
    },
    {
      id: 'TODO',
      label: 'To Do',
      count: todoCount,
      colorClass: 'stat-todo',
      icon: '⏳',
    },
    {
      id: 'IN_PROGRESS',
      label: 'In Progress',
      count: inProgressCount,
      colorClass: 'stat-inprogress',
      icon: '⚡',
    },
    {
      id: 'DONE',
      label: 'Completed',
      count: doneCount,
      colorClass: 'stat-done',
      icon: '✅',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const isActive = activeStatusFilter === stat.id;
        return (
          <div
            key={stat.id}
            className={`stat-card ${stat.colorClass} ${isActive ? 'stat-card-active' : ''}`}
            onClick={() => onStatusFilterChange(stat.id)}
            role="button"
            tabIndex={0}
            title={`Filter by ${stat.label}`}
          >
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-count">{stat.count}</div>
          </div>
        );
      })}
    </div>
  );
}
