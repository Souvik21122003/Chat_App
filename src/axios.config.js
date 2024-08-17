import axios from "axios";
const my_axios = axios.create({
    baseURL: ' http://localhost:4000/api/v1/user',
    withCredentials: true
})

export {my_axios}