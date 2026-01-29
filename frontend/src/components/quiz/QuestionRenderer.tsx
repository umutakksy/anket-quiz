import React from 'react';
import type { QuizQuestion } from '../../types/quiz.js';
import { Label } from '../FormElements.js';
import { Triangle, Square, Circle, Diamond } from 'lucide-react';

// --- Types ---

interface QuestionRendererProps {
    question: QuizQuestion;
    value: string | string[];
    onChange: (value: string | string[]) => void;
    quizType?: 'QUIZ' | 'SURVEY';
    error?: string | undefined;
    disabled?: boolean | undefined;
}

// --- Constants ---

const KAHOOT_COLORS = [
    { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', active: 'bg-rose-700', text: 'text-white', icon: Triangle },
    { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', active: 'bg-indigo-700', text: 'text-white', icon: Diamond },
    { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', active: 'bg-amber-700', text: 'text-white', icon: Circle },
    { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', active: 'bg-emerald-700', text: 'text-white', icon: Square },
];

// --- Component ---

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    question,
    value,
    onChange,
    quizType = 'QUIZ',
    error,
    disabled = false
}) => {
    // Handle text input change
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    // Handle single choice (radio) change
    const handleSingleChoiceChange = (option: string) => {
        onChange(option);
    };

    // Handle multiple choice (checkbox) change
    const handleMultipleChoiceChange = (option: string, checked: boolean) => {
        const currentValue = Array.isArray(value) ? value : [];
        if (checked) {
            if (!currentValue.includes(option)) {
                onChange([...currentValue, option]);
            }
        } else {
            onChange(currentValue.filter(v => v !== option));
        }
    };

    // Render based on question type
    const renderInput = () => {
        switch (question.type) {
            case 'TEXT':
                return (
                    <textarea
                        className={`
                            w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl border
                            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'}
                            focus:outline-none focus:ring-4 transition-all duration-200
                            placeholder:text-gray-400 font-bold text-lg tracking-wide
                            p-6 min-h-[150px] resize-y shadow-inner
                        `}
                        placeholder="Cevabınızı buraya yazın..."
                        value={typeof value === 'string' ? value : ''}
                        onChange={handleTextChange}
                        disabled={disabled}
                        required={question.required}
                    />
                );

            case 'SINGLE_CHOICE':
                if (quizType === 'SURVEY') {
                    return (
                        <div className="flex flex-col gap-1.5">
                            {question.options?.map((option, index) => {
                                const isSelected = value === option;
                                return (
                                    <div
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!disabled) handleSingleChoiceChange(option);
                                        }}
                                        className={`
                                            flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-150 text-left cursor-pointer
                                            ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
                                            ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                        `}>
                                            <div className={`w-1.5 h-1.5 bg-white rounded-full transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                                        </div>
                                        <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {question.options?.map((option, index) => {
                            const config = KAHOOT_COLORS[index % KAHOOT_COLORS.length]!;
                            const isSelected = value === option;
                            const Icon = config.icon;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!disabled) handleSingleChoiceChange(option);
                                    }}
                                    disabled={disabled}
                                    className={`
                                        flex items-center gap-4 p-6 rounded-2xl transition-all duration-200 text-left relative overflow-hidden group
                                        ${config.bg} ${config.hover}
                                        ${isSelected ? 'ring-8 ring-indigo-200 shadow-2xl scale-[1.02] z-10' : 'opacity-90 hover:opacity-100 shadow-lg'}
                                        ${disabled ? 'cursor-not-allowed opacity-50 grayscale-[0.5]' : 'cursor-pointer'}
                                    `}
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                                        <Icon size={24} fill="currentColor" />
                                    </div>
                                    <span className="text-xl font-black text-white drop-shadow-sm flex-1">
                                        {option}
                                    </span>
                                    {isSelected && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <div className="w-3 h-3 bg-indigo-600 rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                );

            case 'MULTIPLE_CHOICE':
                const selectedValues = Array.isArray(value) ? value : [];
                if (quizType === 'SURVEY') {
                    return (
                        <div className="flex flex-col gap-1.5">
                            {question.options?.map((option, index) => {
                                const isChecked = selectedValues.includes(option);
                                return (
                                    <div
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!disabled) handleMultipleChoiceChange(option, !isChecked);
                                        }}
                                        className={`
                                            flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-150 text-left cursor-pointer
                                            ${isChecked
                                                ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
                                            ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className={`
                                            w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                                            ${isChecked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                        `}>
                                            {isChecked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <span className={`text-sm font-semibold transition-colors ${isChecked ? 'text-indigo-900' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {question.options?.map((option, index) => {
                            const config = KAHOOT_COLORS[index % KAHOOT_COLORS.length]!;
                            const isChecked = selectedValues.includes(option);
                            const Icon = config.icon;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (!disabled) handleMultipleChoiceChange(option, !isChecked);
                                    }}
                                    disabled={disabled}
                                    className={`
                                        flex items-center gap-4 p-6 rounded-2xl transition-all duration-200 text-left relative overflow-hidden group
                                        ${config.bg} ${config.hover}
                                        ${isChecked ? 'ring-8 ring-indigo-200 shadow-2xl scale-[1.02] z-10' : 'opacity-90 hover:opacity-100 shadow-lg'}
                                        ${disabled ? 'cursor-not-allowed opacity-50 grayscale-[0.5]' : 'cursor-pointer'}
                                    `}
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                                        <Icon size={24} fill="currentColor" />
                                    </div>
                                    <span className="text-xl font-black text-white drop-shadow-sm flex-1">
                                        {option}
                                    </span>
                                    {isChecked && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                );

            default:
                return <div className="text-slate-500">Desteklenmeyen soru tipi</div>;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className={`font-black text-slate-800 leading-tight ${quizType === 'SURVEY' ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
                {question.text}
                {question.required && <span className="text-rose-500 ml-2">*</span>}
            </h2>

            <div className={quizType === 'SURVEY' ? 'pt-1' : 'pt-4'}>
                {renderInput()}
            </div>

            {error && (
                <p className="text-sm font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-center gap-2 animate-fadeIn">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    {error}
                </p>
            )}
        </div>
    );
};

// --- Quiz Form Component ---

interface QuizFormProps {
    questions: QuizQuestion[];
    answers: Record<string, string | string[]>;
    errors: Record<string, string>;
    onChange: (questionId: string, value: string | string[]) => void;
    quizType?: 'QUIZ' | 'SURVEY';
    disabled?: boolean | undefined;
}

export const QuizForm: React.FC<QuizFormProps> = ({
    questions,
    answers,
    errors,
    onChange,
    quizType = 'QUIZ',
    disabled = false
}) => {
    // Sort questions by order
    const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-8">
            {sortedQuestions.map((question, index) => (
                <div
                    key={question.id}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <QuestionRenderer
                                question={question}
                                value={answers[question.id] || (question.type === 'MULTIPLE_CHOICE' ? [] : '')}
                                onChange={(value) => onChange(question.id, value)}
                                quizType={quizType}
                                error={errors[question.id]}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Validation Helper ---

export const validateQuizAnswers = (
    questions: QuizQuestion[],
    answers: Record<string, string | string[]>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    questions.forEach(question => {
        if (question.required) {
            const answer = answers[question.id];

            if (question.type === 'TEXT') {
                if (!answer || (typeof answer === 'string' && !answer.trim())) {
                    errors[question.id] = 'Bu alan zorunludur.';
                }
            } else if (question.type === 'SINGLE_CHOICE') {
                if (!answer) {
                    errors[question.id] = 'Lütfen bir seçenek seçin.';
                }
            } else if (question.type === 'MULTIPLE_CHOICE') {
                if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                    errors[question.id] = 'Lütfen en az bir seçenek seçin.';
                }
            }
        }
    });

    return errors;
};

export default QuestionRenderer;
