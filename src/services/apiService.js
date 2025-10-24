// src/services/apiService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const handleResponse = async (response) => {
  if (!response.ok) {
    // If 401 Unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem('access_token', refreshData.access);
            // Retry the original request with new token
            const retryResponse = await fetch(response.url, {
              method: response.method,
              headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
              },
            });
            return retryResponse.json();
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
        }
      }
    }
    
    const errorData = await response.json().catch(() => ({}));
    
    // Handle detailed validation errors
    if (errorData && typeof errorData === 'object') {
      // If it's a validation error with field-specific messages
      if (errorData.username || errorData.email || errorData.password || errorData.confirmPassword) {
        const fieldErrors = [];
        if (errorData.username) fieldErrors.push(`Username: ${errorData.username[0]}`);
        if (errorData.email) fieldErrors.push(`Email: ${errorData.email[0]}`);
        if (errorData.password) fieldErrors.push(`Password: ${errorData.password[0]}`);
        if (errorData.confirmPassword) fieldErrors.push(`Confirm Password: ${errorData.confirmPassword[0]}`);
        throw new Error(fieldErrors.join('. '));
      }
      
      // Handle other specific errors
      if (errorData.detail) {
        throw new Error(errorData.detail);
      }
      
      // Handle non-field errors
      if (errorData.non_field_errors) {
        throw new Error(errorData.non_field_errors[0]);
      }
    }
    
    throw new Error(errorData.detail || response.statusText);
  }
  return response.json();
};

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiService = {
  get: (endpoint) =>
    fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      },
    }).then(handleResponse),

  post: (endpoint, data) =>
    fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),

  put: (endpoint, data) =>
    fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (endpoint) =>
    fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    }).then(handleResponse),

  getCurrentUser: () =>
    fetch(`${API_BASE_URL}/users/me/`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      },
    }).then(handleResponse),

  patchCurrentUser: (data) =>
    fetch(`${API_BASE_URL}/users/me/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

export default apiService; // 👈 THIS is the ES module default export
