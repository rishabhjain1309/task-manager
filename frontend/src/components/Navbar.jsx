export default function Navbar({ onOpenCreateModal, onRefresh, loading }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">✓</div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <span className="brand-subtitle">Django REST + React</span>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh task list"
          >
            {loading ? '↻ Loading...' : '↻ Refresh'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            + New Task
          </button>
        </div>
      </div>
    </header>
  );
}
