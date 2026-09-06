import axios from "axios";

export const axiosWrapper = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // send refreshToken cookie automatically
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach access token to every request
axiosWrapper.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// On 401 — try refreshing the access token once, then retry
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

axiosWrapper.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh for 401s that haven't already been retried
        // and are NOT the refresh-token call itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh-token")
        ) {
            if (isRefreshing) {
                // Queue the request until the ongoing refresh is done
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return axiosWrapper(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axiosWrapper.post("/auth/refresh-token");
                const newToken = data.accessToken;
                localStorage.setItem("accessToken", newToken);
                axiosWrapper.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return axiosWrapper(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                // Do NOT use window.location.href here — it causes a full page reload
                // which re-triggers useLoadUser → 401 → refresh → fail → redirect → infinite loop.
                // The app's PrivateRoute will handle redirecting unauthenticated users to "/".
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);