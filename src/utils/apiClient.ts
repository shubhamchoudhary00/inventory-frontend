import axios from 'axios';

const EXCLUDED_ENDPOINTS = ["/auth/login", "/auth/register"];

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // console.log("Request Config:", config);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token && !EXCLUDED_ENDPOINTS.includes(config.url ?? "")) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // console.log("Request Interceptor Error:", error);
        return Promise.reject(error); // Explicitly return the rejection
    }
);

// // Optional: Response Interceptor for better debugging
// apiClient.interceptors.response.use(
//     (response) => {
//         console.log("Response Data:", response.data);
//         return response;
//     },
//     (error) => {
//         console.error("Response Error:", error.response?.data || error.message);
//         return Promise.reject(error);
//     }
// );

export default apiClient;