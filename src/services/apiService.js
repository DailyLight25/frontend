

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || response.statusText);
    }
    return response.json();
};

const apiService = {
    get: (endpoint) =>
        fetch(`${API_BASE_URL}/${endpoint}/`, {
            credentials: 'include',
        }).then(handleResponse),

    post: (endpoint, data) =>
        fetch(`${API_BASE_URL}/${endpoint}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        }).then(handleResponse),

    put: (endpoint, data) =>
        fetch(`${API_BASE_URL}/${endpoint}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        }).then(handleResponse),

    delete: (endpoint) =>
        fetch(`${API_BASE_URL}/${endpoint}/`, {
            method: 'DELETE',
            credentials: 'include',
        }).then(handleResponse),
};

export default apiService;