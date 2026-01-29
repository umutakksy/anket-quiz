// ============================================================================
// QUESTION EDITOR COMPONENT
// ============================================================================
// Provides UI for creating and editing individual survey questions.
// Used in the survey designer to manage question properties and options.
// ============================================================================

import React, { useState } from 'react';
import type { QuizQuestion, QuestionType, QuestionFormState } from '../../types/quiz';
import { TextArea } from '../FormElements';
import {
    Type,
    List,
    CheckSquare,
    Plus,
    Trash2,
    GripVertical,
    Save,
    X,
    CheckCircle2
} from 'lucide-react';

// --- Types ---

interface QuestionEditorProps {
    question?: QuizQuestion;
    onSave: (data: Omit<QuizQuestion, 'id' | 'order'>) => void;
    onCancel: () => void;
    isNew?: boolean;
}

// --- Constants ---

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ElementType }[] = [
    { value: 'TEXT', label: 'Metin Yaniti', icon: Type },
    { value: 'SINGLE_CHOICE', label: 'Tekli Secim (Radio)', icon: List },
    { value: 'MULTIPLE_CHOICE', label: 'Coklu Secim (Checkbox)', icon: CheckSquare }
];

// --- Component ---

const QuestionEditor: React.FC<QuestionEditorProps> = ({
    question,
    onSave,
    onCancel,
    isNew = false
}) => {
    const [formState, setFormState] = useState<QuestionFormState>({
        text: question?.text || '',
        type: question?.type || 'TEXT',
        required: question?.required ?? true,
        options: question?.options || [''],
        correctOption: question?.correctOption || '',
        correctOptions: question?.correctOptions || []
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Check if current type needs options
    const needsOptions = formState.type === 'SINGLE_CHOICE' || formState.type === 'MULTIPLE_CHOICE';

    // Add a new option
    const addOption = () => {
        setFormState(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    // Remove an option
    const removeOption = (index: number) => {
        if (formState.options.length > 1) {
            setFormState(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };

    // Update an option
    const updateOption = (index: number, value: string) => {
        setFormState(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? value : opt)
        }));
    };

    // Validate form
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formState.text.trim()) {
            newErrors.text = 'Soru metni zorunludur.';
        }

        if (needsOptions) {
            const validOptions = formState.options.filter(opt => opt.trim());
            if (validOptions.length < 2) {
                newErrors.options = 'En az 2 secenek gereklidir.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = () => {
        if (validate()) {
            const data: Omit<QuizQuestion, 'id' | 'order'> = {
                text: formState.text.trim(),
                type: formState.type,
                required: formState.required,
                ...(needsOptions ? {
                    options: formState.options.filter(opt => opt.trim()),
                    correctOption: formState.correctOption,
                    correctOptions: formState.correctOptions
                } : {})
            };
            onSave(data);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                    {isNew ? 'Yeni Soru Ekle' : 'Soruyu Duzenle'}
                </h3>
                <button
                    onClick={onCancel}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
                {/* Question Text */}
                <div>
                    <TextArea
                        label="Soru Metni"
                        placeholder="Sorunuzu buraya yazin..."
                        value={formState.text}
                        onChange={(e) => setFormState(prev => ({ ...prev, text: e.target.value }))}
                        error={errors.text}
                        required
                    />
                </div>

                {/* Question Type & Required */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Soru Tipi
                        </label>
                        <div className="space-y-2">
                            {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
                                <label
                                    key={value}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                        transition-all duration-200
                                        ${formState.type === value
                                            ? 'bg-indigo-50 border-indigo-300'
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <input
                                        type="radio"
                                        name="questionType"
                                        value={value}
                                        checked={formState.type === value}
                                        onChange={() => setFormState(prev => ({ ...prev, type: value }))}
                                        className="sr-only"
                                    />
                                    <Icon
                                        size={18}
                                        className={formState.type === value ? 'text-indigo-600' : 'text-slate-400'}
                                    />
                                    <span className={`
                                        font-medium text-sm
                                        ${formState.type === value ? 'text-indigo-900' : 'text-slate-600'}
                                    `}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Zorunluluk
                        </label>
                        <div className="space-y-2">
                            <label
                                className={`
                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                    transition-all duration-200
                                    ${formState.required
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="required"
                                    checked={formState.required}
                                    onChange={() => setFormState(prev => ({ ...prev, required: true }))}
                                    className="sr-only"
                                />
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${formState.required ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                `}>
                                    {formState.required && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`font-medium text-sm ${formState.required ? 'text-indigo-900' : 'text-slate-600'}`}>
                                    Zorunlu
                                </span>
                            </label>
                            <label
                                className={`
                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                    transition-all duration-200
                                    ${!formState.required
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="required"
                                    checked={!formState.required}
                                    onChange={() => setFormState(prev => ({ ...prev, required: false }))}
                                    className="sr-only"
                                />
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${!formState.required ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                `}>
                                    {!formState.required && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`font-medium text-sm ${!formState.required ? 'text-indigo-900' : 'text-slate-600'}`}>
                                    Opsiyonel
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Options Editor (for choice-based questions) */}
                {needsOptions && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Secenekler
                                <span className="text-rose-500 ml-1">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                <Plus size={14} />
                                Secenek Ekle
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formState.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="text-slate-300 cursor-grab">
                                        <GripVertical size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(index, e.target.value)}
                                            placeholder={`Secenek ${index + 1}`}
                                            className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border
                                                hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white
                                                focus:outline-none focus:ring-4 transition-all duration-200
                                                font-medium text-sm py-3 px-4 shadow-sm"
                                        />
                                    </div>

                                    {/* Correct Option Selector */}
                                    <div className="flex items-center gap-2">
                                        {formState.type === 'SINGLE_CHOICE' ? (
                                            <button
                                                type="button"
                                                onClick={() => setFormState(prev => ({ ...prev, correctOption: option }))}
                                                className={`p-2 rounded-lg border transition-all ${formState.correctOption === option
                                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                                                    }`}
                                                title="Dogru Cevap Olarak Isaretle"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = formState.correctOptions || [];
                                                    const updated = current.includes(option)
                                                        ? current.filter(o => o !== option)
                                                        : [...current, option];
                                                    setFormState(prev => ({ ...prev, correctOptions: updated }));
                                                }}
                                                className={`p-2 rounded-lg border transition-all ${(formState.correctOptions || []).includes(option)
                                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                                                    }`}
                                                title="Dogru Cevap Olarak Isaretle"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {formState.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {errors.options && (
                            <p className="mt-2 text-xs font-semibold text-rose-600 animate-fadeIn">
                                {errors.options}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Iptal
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                >
                    <Save size={16} />
                    {isNew ? 'Ekle' : 'Kaydet'}
                </button>
            </div>
        </div>
    );
};

export default QuestionEditor;
