// ============================================================================
// QUIZ SERVICE
// ============================================================================
// Service layer for all quiz-related API operations.
// Provides clean abstraction over HTTP calls with typed request/response.
// ============================================================================

import { API_BASE_URL } from '../config';
import type {
    Quiz,
    QuizQuestion,
    QuizResponse,
    CreateQuizRequest,
    UpdateQuizRequest,
    AddQuestionRequest,
    UpdateQuestionRequest,
    SubmitResponseRequest,
    PublishQuizResponse,
    QuizListResponse,
    QuizStatsResponse,
    PublicQuiz
} from '../types/quiz';

// --- API Endpoints ---
const QUIZ_API = `${API_BASE_URL}/api/quizzes`;

// --- Helper Functions ---

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

// ============================================================================
// QUIZ CRUD OPERATIONS
// ============================================================================

export const getQuizzes = async (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    department?: string
): Promise<QuizListResponse> => {
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

    return handleResponse<QuizListResponse>(response);
};

export const getQuizById = async (id: string): Promise<Quiz> => {
    const response = await fetch(`${QUIZ_API}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    return handleResponse<Quiz>(response);
};

export const createQuiz = async (data: CreateQuizRequest): Promise<Quiz> => {
    const response = await fetch(QUIZ_API, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse<Quiz>(response);
};

export const updateQuiz = async (id: string, data: UpdateQuizRequest): Promise<Quiz> => {
    const response = await fetch(`${QUIZ_API}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse<Quiz>(response);
};

export const deleteQuiz = async (id: string): Promise<void> => {
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

export const addQuestion = async (
    quizId: string,
    data: AddQuestionRequest
): Promise<QuizQuestion> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse<QuizQuestion>(response);
};

export const updateQuestion = async (
    quizId: string,
    questionId: string,
    data: UpdateQuestionRequest
): Promise<QuizQuestion> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/${questionId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    return handleResponse<QuizQuestion>(response);
};

export const deleteQuestion = async (quizId: string, questionId: string): Promise<void> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Deletion failed' }));
        throw new Error(error.message);
    }
};

export const reorderQuestions = async (
    quizId: string,
    questionIds: string[]
): Promise<Quiz> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/questions/reorder`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionIds })
    });

    return handleResponse<Quiz>(response);
};

// ============================================================================
// PUBLISHING OPERATIONS
// ============================================================================

export const publishQuiz = async (quizId: string): Promise<PublishQuizResponse> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/publish`, {
        method: 'POST',
        headers: getAuthHeaders()
    });

    return handleResponse<PublishQuizResponse>(response);
};

export const closeQuiz = async (quizId: string): Promise<Quiz> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/close`, {
        method: 'POST',
        headers: getAuthHeaders()
    });

    return handleResponse<Quiz>(response);
};

// ============================================================================
// PUBLIC QUIZ ACCESS (NO AUTH REQUIRED)
// ============================================================================

export const getPublicQuizBySlug = async (slug: string): Promise<PublicQuiz> => {
    const response = await fetch(`${QUIZ_API}/public/${slug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    return handleResponse<PublicQuiz>(response);
};

export const submitQuizResponse = async (
    slug: string,
    data: SubmitResponseRequest
): Promise<QuizResponse> => {
    const response = await fetch(`${QUIZ_API}/public/${slug}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    return handleResponse<QuizResponse>(response);
};

// ============================================================================
// RESPONSE/ANALYTICS OPERATIONS
// ============================================================================

export const getQuizResponses = async (
    quizId: string,
    page: number = 1,
    pageSize: number = 50
): Promise<{ responses: QuizResponse[]; total: number }> => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
    });

    const response = await fetch(`${QUIZ_API}/${quizId}/responses?${params}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    return handleResponse<{ responses: QuizResponse[]; total: number }>(response);
};

export const getQuizStats = async (quizId: string): Promise<QuizStatsResponse> => {
    const response = await fetch(`${QUIZ_API}/${quizId}/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    return handleResponse<QuizStatsResponse>(response);
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

