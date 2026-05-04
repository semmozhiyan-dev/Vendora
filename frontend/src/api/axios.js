import axios from "axios";

let setLoadingGlobal = null;

export const setLoadingHandler = (setLoading) => {
  setLoadingGlobal = setLoading;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (setLoadingGlobal) setLoadingGlobal(true);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return response;
  },
  (error) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return Promise.reject(error);
  }
);

export default api;