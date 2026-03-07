import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-api-for-tl-task.onrender.com/api/auth",
});

// get all users
export const getUsers = () => API.get("/admin/users");