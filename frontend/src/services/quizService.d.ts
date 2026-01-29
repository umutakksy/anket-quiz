import type { Quiz, QuizQuestion, QuizResponse, CreateQuizRequest, UpdateQuizRequest, AddQuestionRequest, UpdateQuestionRequest, SubmitResponseRequest, PublishQuizResponse, QuizListResponse, QuizStatsResponse, PublicQuiz } from '../types/quiz';
export declare const getQuizzes: (page?: number, pageSize?: number, status?: string, department?: string) => Promise<QuizListResponse>;
export declare const getQuizById: (id: string) => Promise<Quiz>;
export declare const createQuiz: (data: CreateQuizRequest) => Promise<Quiz>;
export declare const updateQuiz: (id: string, data: UpdateQuizRequest) => Promise<Quiz>;
export declare const deleteQuiz: (id: string) => Promise<void>;
export declare const addQuestion: (quizId: string, data: AddQuestionRequest) => Promise<QuizQuestion>;
export declare const updateQuestion: (quizId: string, questionId: string, data: UpdateQuestionRequest) => Promise<QuizQuestion>;
export declare const deleteQuestion: (quizId: string, questionId: string) => Promise<void>;
export declare const reorderQuestions: (quizId: string, questionIds: string[]) => Promise<Quiz>;
export declare const publishQuiz: (quizId: string) => Promise<PublishQuizResponse>;
export declare const closeQuiz: (quizId: string) => Promise<Quiz>;
export declare const getPublicQuizBySlug: (slug: string) => Promise<PublicQuiz>;
export declare const submitQuizResponse: (slug: string, data: SubmitResponseRequest) => Promise<QuizResponse>;
export declare const getQuizResponses: (quizId: string, page?: number, pageSize?: number) => Promise<{
    responses: QuizResponse[];
    total: number;
}>;
export declare const getQuizStats: (quizId: string) => Promise<QuizStatsResponse>;
export declare const quizService: {
    getQuizzes: (page?: number, pageSize?: number, status?: string, department?: string) => Promise<QuizListResponse>;
    getQuizById: (id: string) => Promise<Quiz>;
    createQuiz: (data: CreateQuizRequest) => Promise<Quiz>;
    updateQuiz: (id: string, data: UpdateQuizRequest) => Promise<Quiz>;
    deleteQuiz: (id: string) => Promise<void>;
    addQuestion: (quizId: string, data: AddQuestionRequest) => Promise<QuizQuestion>;
    updateQuestion: (quizId: string, questionId: string, data: UpdateQuestionRequest) => Promise<QuizQuestion>;
    deleteQuestion: (quizId: string, questionId: string) => Promise<void>;
    reorderQuestions: (quizId: string, questionIds: string[]) => Promise<Quiz>;
    publishQuiz: (quizId: string) => Promise<PublishQuizResponse>;
    closeQuiz: (quizId: string) => Promise<Quiz>;
    getPublicQuizBySlug: (slug: string) => Promise<PublicQuiz>;
    submitQuizResponse: (slug: string, data: SubmitResponseRequest) => Promise<QuizResponse>;
    getQuizResponses: (quizId: string, page?: number, pageSize?: number) => Promise<{
        responses: QuizResponse[];
        total: number;
    }>;
    getQuizStats: (quizId: string) => Promise<QuizStatsResponse>;
};
export declare const surveyService: {
    getQuizzes: (page?: number, pageSize?: number, status?: string, department?: string) => Promise<QuizListResponse>;
    getQuizById: (id: string) => Promise<Quiz>;
    createQuiz: (data: CreateQuizRequest) => Promise<Quiz>;
    updateQuiz: (id: string, data: UpdateQuizRequest) => Promise<Quiz>;
    deleteQuiz: (id: string) => Promise<void>;
    addQuestion: (quizId: string, data: AddQuestionRequest) => Promise<QuizQuestion>;
    updateQuestion: (quizId: string, questionId: string, data: UpdateQuestionRequest) => Promise<QuizQuestion>;
    deleteQuestion: (quizId: string, questionId: string) => Promise<void>;
    reorderQuestions: (quizId: string, questionIds: string[]) => Promise<Quiz>;
    publishQuiz: (quizId: string) => Promise<PublishQuizResponse>;
    closeQuiz: (quizId: string) => Promise<Quiz>;
    getPublicQuizBySlug: (slug: string) => Promise<PublicQuiz>;
    submitQuizResponse: (slug: string, data: SubmitResponseRequest) => Promise<QuizResponse>;
    getQuizResponses: (quizId: string, page?: number, pageSize?: number) => Promise<{
        responses: QuizResponse[];
        total: number;
    }>;
    getQuizStats: (quizId: string) => Promise<QuizStatsResponse>;
};
//# sourceMappingURL=quizService.d.ts.map