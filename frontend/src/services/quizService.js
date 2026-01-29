// ============================================================================
// QUIZ SERVICE
// ============================================================================
// Service layer for all quiz-related API operations.
// Provides clean abstraction over HTTP calls with typed request/response.
// ============================================================================
import { API_BASE_URL } from '../config';
// --- API Endpoints ---
const QUIZ_API = `${API_BASE_URL}/api/quizzes`;
// --- Helper Functions ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};
// ============================================================================
// QUIZ CRUD OPERATIONS
// ============================================================================
export const getQuizzes = async (page = 1, pageSize = 10, status, department) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(status ? { status } : {}),
        ...(department ? { department } : {})
    });
    const response = await fetch(`${QUIZ_API}?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
export const getQuizById = async (id) => {
    const response = await fetch(`${QUIZ_API}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
export const createQuiz = async (data) => {
    const response = await fetch(QUIZ_API, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
export const updateQuiz = async (id, data) => {
    const response = await fetch(`${QUIZ_API}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
export const deleteQuiz = async (id) => {
    const response = await fetch(`${QUIZ_API}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Deletion failed' }));
        throw new Error(error.message);
    }
};
// ============================================================================
// QUESTION OPERATIONS
// ============================================================================
export const addQuestion = async (quizId, data) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
export const updateQuestion = async (quizId, questionId, data) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/${questionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
export const deleteQuestion = async (quizId, questionId) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Deletion failed' }));
        throw new Error(error.message);
    }
};
export const reorderQuestions = async (quizId, questionIds) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionIds })
    });
    return handleResponse(response);
};
// ============================================================================
// PUBLISHING OPERATIONS
// ============================================================================
export const publishQuiz = async (quizId) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/publish`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
export const closeQuiz = async (quizId) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/close`, {
        method: 'POST',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
// ============================================================================
// PUBLIC QUIZ ACCESS (NO AUTH REQUIRED)
// ============================================================================
export const getPublicQuizBySlug = async (slug) => {
    const response = await fetch(`${QUIZ_API}/public/${slug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};
export const submitQuizResponse = async (slug, data) => {
    const response = await fetch(`${QUIZ_API}/public/${slug}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return handleResponse(response);
};
// ============================================================================
// RESPONSE/ANALYTICS OPERATIONS
// ============================================================================
export const getQuizResponses = async (quizId, page = 1, pageSize = 50) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    });
    const response = await fetch(`${QUIZ_API}/${quizId}/responses?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
export const getQuizStats = async (quizId) => {
    const response = await fetch(`${QUIZ_API}/${quizId}/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return handleResponse(response);
};
// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================
export const quizService = {
    // Quiz CRUD
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    // Question operations
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    // Publishing
    publishQuiz,
    closeQuiz,
    // Public access
    getPublicQuizBySlug,
    submitQuizResponse,
    // Responses/Analytics
    getQuizResponses,
    getQuizStats
};
// Backward compatibility alias
export const surveyService = quizService;
//# sourceMappingURL=quizService.js.map