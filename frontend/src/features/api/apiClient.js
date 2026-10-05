import axios from "axios";

const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL: `${apiBase}/api`,
  withCredentials: true,
});
