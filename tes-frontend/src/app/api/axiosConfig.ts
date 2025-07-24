import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3001",
  withCredentials: true,
});

export default api;
