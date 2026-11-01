import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import {
  getTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
} from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast notifications
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  }, []);

  // Fetch all tasks from Django REST API
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create or Update task
  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        showNotification(`Task "${updated.title}" updated successfully!`);
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [created, ...prev]);
        showNotification(`Task "${created.title}" created successfully!`);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick status toggle
  const handleStatusChange = async (id, newStatus) => {
    const originalTasks = [...tasks];
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const updated = await patchTask(id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      showNotification(`Task status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      // Revert if API fails
      setTasks(originalTasks);
      showNotification(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // Delete task
  const handleDeleteTask = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showNotification(`Task "${title}" deleted.`);
    } catch (err) {
      showNotification(`Failed to delete task: ${err.message}`, 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  // Filter tasks based on search & selectors
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'ALL' || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'ALL' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  return (
    <div className="app-shell">
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={loadTasks}
        loading={loading}
      />

      {notification && (
        <aside
          aria-live="polite"
          className={`toast-notification toast-${notification.type}`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </aside>
      )}

      <main className="main-content">
        <DashboardStats
          tasks={tasks}
          activeStatusFilter={statusFilter}
          onStatusFilterChange={(status) => setStatusFilter(status)}
        />

        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onRetry={loadTasks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          onResetFilters={handleResetFilters}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onOpenCreate={handleOpenCreateModal}
        />
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
        submitting={submitting}
      />
    </div>
  );
}

export default App;
