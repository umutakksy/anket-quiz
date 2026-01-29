// ============================================================================
// QUIZ SYSTEM - TYPE DEFINITIONS
// ============================================================================
// This module defines the core data models for the quiz system.
// All types are designed to be compatible with a backend REST API.
// ============================================================================

// --- Enums ---

export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT';

// --- Question Model ---

/**
 * Represents a single question within a quiz.
 * Questions can be of different types and may include options for choice-based questions.
 */
export interface QuizQuestion {
    /** Unique identifier for the question */
    id: string;
    /** The question text displayed to respondents */
    text: string;
    /** Type of question determines the input control rendered */
    type: QuestionType;
    /** Whether this question must be answered */
    required: boolean;
    /** Options for SINGLE_CHOICE and MULTIPLE_CHOICE questions */
    options?: string[];
    /** Correct option for SINGLE_CHOICE */
    correctOption?: string;
    /** Correct options for MULTIPLE_CHOICE */
    correctOptions?: string[];
    /** Display order within the quiz (1-indexed) */
    order: number;
}

// --- Quiz Model ---

/**
 * Represents a quiz entity.
 * Quizzes contain questions and can be published to generate a public URL.
 */
export interface Quiz {
    /** Unique identifier for the quiz */
    id: string;
    /** Quiz title displayed to respondents */
    title: string;
    /** Optional description/instructions for the quiz */
    description?: string;
    /** Current status of the quiz */
    status: QuizStatus;
    /** URL-friendly slug for public access (generated on publish) */
    slug?: string;
    /** If true, quiz is anonymous (no name/email collected) */
    anonymous: boolean;
    /** ISO 8601 timestamp of creation */
    createdAt: string;
    /** ISO 8601 timestamp of last update */
    updatedAt: string;
    /** ISO 8601 timestamp when quiz was published */
    publishedAt?: string;
    /** ID of the user who created the quiz */
    createdBy: string;
    /** Department of the creator */
    creatorDepartment?: string;
    /** Departments that can see/participate in this quiz */
    targetDepartments?: string[];
    /** Time limit in minutes */
    timeLimit?: number;
    /** Type of the entity: QUIZ or SURVEY */
    type: 'QUIZ' | 'SURVEY';
    /** All questions in this quiz */
    questions: QuizQuestion[];
}

// --- Response Models ---

/**
 * Represents an answer to a single question.
 */
export interface QuestionAnswer {
    /** ID of the question being answered */
    questionId: string;
    /** The answer value */
    value: string | string[];
}

/**
 * Represents a complete quiz response (submission).
 * Contains all answers from a single respondent.
 */
export interface QuizResponse {
    /** Unique identifier for this response */
    id: string;
    /** ID of the quiz this response belongs to */
    quizId: string;
    /** All answers provided by the respondent */
    answers: QuestionAnswer[];
    /** ISO 8601 timestamp of submission */
    submittedAt: string;
    /** Optional respondent email (if collected) */
    respondentEmail?: string;
    /** Optional respondent name (if collected) */
    respondentName?: string;
    /** Client IP address (for analytics/spam prevention) */
    respondentIp?: string;
    /** Completion time in seconds */
    completingTime?: number;
    /** Quiz score */
    score?: number;
}

// --- API Request/Response Contracts ---

/**
 * Request payload for creating a new quiz.
 */
export interface CreateQuizRequest {
    title: string;
    description?: string;
    anonymous?: boolean;
    creatorDepartment?: string;
    targetDepartments?: string[];
    timeLimit?: number;
    type: 'QUIZ' | 'SURVEY';
}

/**
 * Request payload for updating a quiz.
 */
export interface UpdateQuizRequest {
    title?: string;
    description?: string;
    slug?: string;
    anonymous?: boolean;
    targetDepartments?: string[];
    timeLimit?: number;
    questions?: Omit<QuizQuestion, 'id'>[];
}

/**
 * Request payload for adding a question to a quiz.
 */
export interface AddQuestionRequest {
    text: string;
    type: QuestionType;
    required: boolean;
    options?: string[];
    order?: number;
}

/**
 * Request payload for updating an existing question.
 */
export interface UpdateQuestionRequest {
    text?: string;
    type?: QuestionType;
    required?: boolean;
    options?: string[];
    order?: number;
}

/**
 * Request payload for submitting a quiz response.
 */
export interface SubmitResponseRequest {
    answers: QuestionAnswer[];
    respondentEmail?: string;
    respondentName?: string;
    completingTime?: number;
    score?: number;
}

/**
 * Response from publishing a quiz.
 */
export interface PublishQuizResponse {
    quiz: Quiz;
    publicUrl: string;
}

/**
 * Paginated list response for quizzes.
 */
export interface QuizListResponse {
    quizzes: Quiz[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * Response containing quiz response statistics.
 */
export interface QuizStatsResponse {
    quizId: string;
    totalResponses: number;
    questionStats: {
        questionId: string;
        questionText: string;
        answerDistribution: Record<string, number>;
    }[];
}

// --- Helper Types ---

/**
 * Form state for the quiz designer.
 */
export interface QuizFormState {
    title: string;
    description: string;
    questions: QuizQuestion[];
}

/**
 * Form state for a single question in the designer.
 */
export interface QuestionFormState {
    text: string;
    type: QuestionType;
    required: boolean;
    options: string[];
    correctOption?: string;
    correctOptions?: string[];
}

/**
 * Public quiz data (minimal for unauthenticated access).
 */
export interface PublicQuiz {
    id: string;
    title: string;
    description?: string;
    anonymous: boolean;
    status: QuizStatus;
    questions: QuizQuestion[];
    timeLimit?: number;
    type: 'QUIZ' | 'SURVEY';
}

