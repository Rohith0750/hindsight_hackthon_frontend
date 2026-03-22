import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://hindsight-hackthon-backend.onrender.com/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ✅ correct way
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers.set("Content-Type", "application/json");

  return config;
});

export default apiClient;