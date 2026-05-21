import axios from "axios";

let setLoadingGlobal = null;

export const setLoadingHandler = (setLoading) => {
  setLoadingGlobal = setLoading;
};

const normalizeBaseURL = (value) => {
  if (!value) {
    return "/api/v1";
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(value)) {
    return "/api/v1";
  }

  return value;
};

const baseURL = normalizeBaseURL(import.meta.env.VITE_API_URL);

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