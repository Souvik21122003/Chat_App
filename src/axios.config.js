import axios from "axios";
const my_axios = axios.create({
  baseURL: " https://chat-app-backend-z3xr.onrender.com/api/v1/user",
  withCredentials: true,
});

export { my_axios };
