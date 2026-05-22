import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env
      .VITE_API_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  timeout: 120000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "codemind-token"
      );

    // Attach Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // Token Expired / Unauthorized
    if (
      error.response
        ?.status === 401
    ) {
      localStorage.removeItem(
        "codemind-user"
      );

      localStorage.removeItem(
        "codemind-token"
      );

      // Redirect to Login
      window.location.href =
        "/login";
    }

    // Network Error
    if (
      error.code ===
      "ECONNABORTED"
    ) {
      console.error(
        "Request Timeout"
      );
    }

    // Server Down
    if (
      !error.response
    ) {
      console.error(
        "Server Unreachable"
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default api;
