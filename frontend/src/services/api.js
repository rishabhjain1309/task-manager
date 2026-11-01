export const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Handle HTTP response and JSON parsing with descriptive error reporting
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (typeof errorJson === 'object') {
        errorDetail = Object.entries(errorJson)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join(' | ');
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorDetail);
  }

  // 204 No Content does not return a body
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * GET all tasks
 */
export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  return handleResponse(response);
}

/**
 * POST a new task
 */
export async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * PUT full update on a task
 */
export async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
}

/**
 * PATCH partial update on a task (e.g. quick status toggle)
 */
export async function patchTask(id, partialData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(partialData),
  });
  return handleResponse(response);
}

/**
 * DELETE a task
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
