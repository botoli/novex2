import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // 👈 ТОЛЬКО "/api", без полного URL
});
