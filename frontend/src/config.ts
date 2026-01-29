// Backend API configuration
// Production uses Nginx reverse proxy on port 80
// Development connects directly to local backend on port 8080
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://13.63.57.2";
