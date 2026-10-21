/**
 * Centralized API service for UserFlow client.
 * Connects directly to the Express REST API.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, errors = [], rawData = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.rawData = rawData;
    this.isNetworkError = status === 0;
  }
}

/**
 * Robust fetch wrapper with timeout, JSON formatting, and safe error handling.
 */
async function request(endpoint, options = {}, timeoutMs = 12000) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const defaultHeaders = {
    'Accept': 'application/json',
  };

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Safely parse JSON if response has content
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (err) {
        data = null;
      }
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      const errors = Array.isArray(data?.errors) ? data.errors : [];
      throw new ApiError(errorMessage, response.status, errors, data);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The server took too long to respond. Please check your connection.',
        0,
        [],
        null
      );
    }

    // Network connection errors (e.g. backend offline or CORS failure)
    throw new ApiError(
      `Cannot connect to backend server at ${API_BASE_URL}. Ensure the Express server is running on port 5000.`,
      0,
      [],
      null
    );
  }
}

/**
 * Health check endpoint
 * GET /api/health
 */
export async function getHealthStatus() {
  return request('/api/health');
}

/**
 * Root discovery endpoint
 * GET /
 */
export async function getRootInfo() {
  return request('/');
}

/**
 * Fetch all users
 * GET /api/users
 */
export async function getUsers() {
  const response = await request('/api/users');
  return response.data || [];
}

/**
 * Fetch a single user by ID
 * GET /api/users/:id
 */
export async function getUserById(id) {
  const response = await request(`/api/users/${id}`);
  return response.data;
}

/**
 * Create a new user
 * POST /api/users
 * Payload: { fullName, email, password }
 */
export async function createUser({ fullName, email, password }) {
  const response = await request('/api/users', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  return response.data;
}

/**
 * Update user information
 * PATCH /api/users/:id
 * Only send modified fields. If password is empty or not provided, omit it.
 */
export async function updateUser(id, updates) {
  const payload = {};
  if (updates.fullName !== undefined && updates.fullName.trim() !== '') {
    payload.fullName = updates.fullName.trim();
  }
  if (updates.email !== undefined && updates.email.trim() !== '') {
    payload.email = updates.email.trim();
  }
  if (updates.password !== undefined && updates.password.trim() !== '') {
    payload.password = updates.password;
  }

  const response = await request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.data;
}

/**
 * Delete a user
 * DELETE /api/users/:id
 */
export async function deleteUser(id) {
  const response = await request(`/api/users/${id}`, {
    method: 'DELETE',
  });
  return response.data;
}

export default {
  getHealthStatus,
  getRootInfo,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  ApiError,
};
