// src/services/apiService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
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
};

export default apiService; // 👈 THIS is the ES module default export
