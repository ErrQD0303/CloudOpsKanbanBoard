import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log outgoing requests for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// catches errors globally before they crash UI components
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status}:`,
        error.response.data,
      );
    } else if (error.request) {
      console.error(
        `[API Network Error] No response received from server. Is backend running?`,
      );
    } else {
      console.error(`[API Setup Error]`, error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
