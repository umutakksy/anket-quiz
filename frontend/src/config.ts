// Backend API configuration
// Production uses Nginx HTTPS reverse proxy
// Development connects directly to local backend on port 8080
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://13.63.57.2";
