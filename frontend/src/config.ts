// Backend API configuration
// Frontend: anket.seedhr.com.tr (Firebase)
// Backend: api.seedhr.com.tr (AWS)
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://api.seedhr.com.tr";
