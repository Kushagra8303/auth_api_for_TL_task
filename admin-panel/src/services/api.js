// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://auth-api-for-tl-task.onrender.com/api/auth",
// });

// // get all users
// export const getUsers = () => API.get("/admin/users");


// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/auth"
// });

// export const getUsers = () => API.get("/admin/users");


import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-api-for-tl-task.onrender.com/api/auth"
});

export const getUsers = () => API.get("/admin/users");