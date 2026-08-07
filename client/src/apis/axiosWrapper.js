import axios from "axios";

export const axiosWrapper = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosWrapper.interceptors.request.use((config) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
        config.headers["X-User-Id"] = userId;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});