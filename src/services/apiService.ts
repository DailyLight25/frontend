const API_BASE_URL: string = import.meta.env.VITE_API_URL || "http://localhost:8000";

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

interface OriginalRequest {
  url: string;
  options: RequestOptions;
}

const getAuthHeader = (): Record<string, string> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildUrl = (endpoint: string): string => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}/${endpoint}`;
};

const parseBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text();
  return (text as unknown) as T;
};

const handleResponse = async <T>(
  response: Response,
  originalRequest?: OriginalRequest
): Promise<T> => {
  if (response.ok) {
    return parseBody<T>(response);
  }

  if (response.status === 401 && originalRequest) {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/users/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = (await refreshResponse.json()) as { access: string };
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", refreshData.access);
          }

          const retryOptions: RequestOptions = {
            ...originalRequest.options,
            headers: {
              ...(originalRequest.options.headers ?? {}),
              ...getAuthHeader(),
            },
          };

          const retryResponse = await fetch(originalRequest.url, retryOptions);
          return handleResponse<T>(retryResponse);
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/login";
        }
      }
    }
  }

  let errorData: any = {};

  try {
    errorData = await response.json();
  } catch (error) {
    // ignore non-JSON bodies
  }

  if (errorData && typeof errorData === "object") {
    const fieldErrors: string[] = [];

    if (errorData.username) fieldErrors.push(`Username: ${errorData.username[0]}`);
    if (errorData.email) fieldErrors.push(`Email: ${errorData.email[0]}`);
    if (errorData.password) fieldErrors.push(`Password: ${errorData.password[0]}`);
    if (errorData.confirmPassword) fieldErrors.push(`Confirm Password: ${errorData.confirmPassword[0]}`);

    if (fieldErrors.length) {
      throw new Error(fieldErrors.join(". "));
    }

    if (errorData.detail) {
      throw new Error(errorData.detail);
    }

    if (errorData.non_field_errors) {
      throw new Error(errorData.non_field_errors[0]);
    }
  }

  throw new Error(response.statusText || "An unexpected error occurred.");
};

const fetchWithAuth = async <T>(endpoint: string, options: RequestOptions): Promise<T> => {
  const url = buildUrl(endpoint);
  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
    ...getAuthHeader(),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse<T>(response, { url, options: { ...options, headers } });
};

const apiService = {
  get: <T = any>(endpoint: string) =>
    fetchWithAuth<T>(endpoint, {
      method: "GET",
    }),

  post: <T = any>(endpoint: string, data: unknown) =>
    fetchWithAuth<T>(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data ?? {}),
    }),

  uploadPostImage: <T = any>(file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetchWithAuth<T>("api/upload-image/", {
      method: "POST",
      body: formData,
    });
  },

  put: <T = any>(endpoint: string, data: unknown) =>
    fetchWithAuth<T>(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data ?? {}),
    }),

  delete: <T = any>(endpoint: string) =>
    fetchWithAuth<T>(endpoint, {
      method: "DELETE",
    }),

  getCurrentUser: <T = any>() =>
    fetchWithAuth<T>("users/me/", {
      method: "GET",
    }),

  patchCurrentUser: <T = any>(data: unknown) =>
    fetchWithAuth<T>("users/me/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data ?? {}),
    }),
};

export type ApiService = typeof apiService;

export default apiService;

