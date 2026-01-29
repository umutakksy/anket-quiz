// Direct backend connection (development and production)
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://13.63.57.2:9080";
