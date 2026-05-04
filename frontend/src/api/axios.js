import axios from "axios";

let setLoadingGlobal = null;

export const setLoadingHandler = (setLoading) => {
  setLoadingGlobal = setLoading;
};

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (setLoadingGlobal && !config.headers['X-Skip-Loading']) {
    setLoadingGlobal(true);
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (setLoadingGlobal && !response.config.headers['X-Skip-Loading']) {
      setLoadingGlobal(false);
    }
    return response;
  },
  (error) => {
    if (setLoadingGlobal && !error.config?.headers['X-Skip-Loading']) {
      setLoadingGlobal(false);
    }
    return Promise.reject(error);
  }
);

export default api;