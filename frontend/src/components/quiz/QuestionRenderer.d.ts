import React from 'react';
import type { QuizQuestion } from '../../types/quiz.js';
interface QuestionRendererProps {
    question: QuizQuestion;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    quizType?: 'QUIZ' | 'SURVEY';
    error?: string | undefined;
    disabled?: boolean | undefined;
}
declare const QuestionRenderer: React.FC<QuestionRendererProps>;
interface QuizFormProps {
    questions: QuizQuestion[];
    answers: Record<string, string | string[]>;
    errors: Record<string, string>;
    onChange: (questionId: string, value: string | string[]) => void;
    quizType?: 'QUIZ' | 'SURVEY';
    disabled?: boolean | undefined;
}
export declare const QuizForm: React.FC<QuizFormProps>;
export declare const validateQuizAnswers: (questions: QuizQuestion[], answers: Record<string, string | string[]>) => Record<string, string>;
export default QuestionRenderer;
//# sourceMappingURL=QuestionRenderer.d.ts.map