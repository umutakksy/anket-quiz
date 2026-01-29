import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// QUESTION EDITOR COMPONENT
// ============================================================================
// Provides UI for creating and editing individual survey questions.
// Used in the survey designer to manage question properties and options.
// ============================================================================
import React, { useState } from 'react';
import { TextArea } from '../FormElements.js';
import { Type, List, CheckSquare, Plus, Trash2, GripVertical, Save, X, CheckCircle2 } from 'lucide-react';
// --- Constants ---
const QUESTION_TYPES = [
    { value: 'TEXT', label: 'Metin Yaniti', icon: Type },
    { value: 'SINGLE_CHOICE', label: 'Tekli Secim (Radio)', icon: List },
    { value: 'MULTIPLE_CHOICE', label: 'Coklu Secim (Checkbox)', icon: CheckSquare }
];
// --- Component ---
const QuestionEditor = ({ question, onSave, onCancel, isNew = false, quizType = 'QUIZ' }) => {
    const [formState, setFormState] = useState({
        text: question?.text || '',
        type: question?.type || 'TEXT',
        required: question?.required ?? true,
        options: question?.options || [''],
        correctOption: question?.correctOption || '',
        correctOptions: question?.correctOptions || []
    });
    const [errors, setErrors] = useState({});
    // Check if current type needs options
    const needsOptions = formState.type === 'SINGLE_CHOICE' || formState.type === 'MULTIPLE_CHOICE';
    // Add a new option
    const addOption = () => {
        setFormState((prev) => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };
    // Remove an option
    const removeOption = (index) => {
        if (formState.options.length > 1) {
            setFormState((prev) => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };
    // Update an option
    const updateOption = (index, value) => {
        setFormState((prev) => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? value : opt)
        }));
    };
    // Validate form
    const validate = () => {
        const newErrors = {};
        if (!formState.text.trim()) {
            newErrors.text = 'Soru metni zorunludur.';
        }
        if (needsOptions) {
            const validOptions = formState.options.filter((opt) => opt.trim());
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
            const data = {
                text: formState.text.trim(),
                type: formState.type,
                required: formState.required,
                ...(needsOptions ? {
                    options: Array.from(new Set(formState.options.filter((opt) => opt.trim()))),
                    correctOption: formState.correctOption,
                    correctOptions: formState.correctOptions
                } : {})
            };
            onSave(data);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-fadeIn", children: [_jsxs("div", { className: "px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-slate-900", children: isNew ? 'Yeni Soru Ekle' : 'Soruyu Duzenle' }), _jsx("button", { onClick: onCancel, className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { children: _jsx(TextArea, { label: "Soru Metni", placeholder: "Sorunuzu buraya yazin...", value: formState.text, onChange: (e) => setFormState((prev) => ({ ...prev, text: e.target.value })), error: errors.text, required: true }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-3", children: "Soru Tipi" }), _jsx("div", { className: "space-y-2", children: QUESTION_TYPES.map(({ value, label, icon: Icon }) => (_jsxs("label", { className: `
                                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                        transition-all duration-200
                                        ${formState.type === value
                                                ? 'bg-indigo-50 border-indigo-300'
                                                : 'bg-white border-slate-200 hover:border-slate-300'}
                                    `, children: [_jsx("input", { type: "radio", name: "questionType", value: value, checked: formState.type === value, onChange: () => setFormState((prev) => ({ ...prev, type: value })), className: "sr-only" }), _jsx(Icon, { size: 18, className: formState.type === value ? 'text-indigo-600' : 'text-slate-400' }), _jsx("span", { className: `
                                        font-medium text-sm
                                        ${formState.type === value ? 'text-indigo-900' : 'text-slate-600'}
                                    `, children: label })] }, value))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-3", children: "Zorunluluk" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: `
                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                    transition-all duration-200
                                    ${formState.required
                                                    ? 'bg-indigo-50 border-indigo-300'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'}
                                `, children: [_jsx("input", { type: "radio", name: "required", checked: formState.required, onChange: () => setFormState((prev) => ({ ...prev, required: true })), className: "sr-only" }), _jsx("div", { className: `
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${formState.required ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                `, children: formState.required && _jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }), _jsx("span", { className: `font-medium text-sm ${formState.required ? 'text-indigo-900' : 'text-slate-600'}`, children: "Zorunlu" })] }), _jsxs("label", { className: `
                                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                                    transition-all duration-200
                                    ${!formState.required
                                                    ? 'bg-indigo-50 border-indigo-300'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'}
                                `, children: [_jsx("input", { type: "radio", name: "required", checked: !formState.required, onChange: () => setFormState((prev) => ({ ...prev, required: false })), className: "sr-only" }), _jsx("div", { className: `
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${!formState.required ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}
                                `, children: !formState.required && _jsx("div", { className: "w-2 h-2 bg-white rounded-full" }) }), _jsx("span", { className: `font-medium text-sm ${!formState.required ? 'text-indigo-900' : 'text-slate-600'}`, children: "Opsiyonel" })] })] })] })] }), needsOptions && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-700", children: ["Secenekler", _jsx("span", { className: "text-rose-500 ml-1", children: "*" })] }), _jsxs("button", { type: "button", onClick: addOption, className: "flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors", children: [_jsx(Plus, { size: 14 }), "Secenek Ekle"] })] }), _jsx("div", { className: "space-y-2", children: formState.options.map((option, index) => {
                                    const isCorrect = formState.type === 'SINGLE_CHOICE'
                                        ? formState.correctOption === option
                                        : (formState.correctOptions || []).includes(option);
                                    return (_jsxs("div", { className: `
                                            flex items-center gap-3 p-2 rounded-xl border transition-all duration-200 group relative
                                            ${quizType === 'QUIZ' && isCorrect ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}
                                        `, children: [_jsx("div", { className: "text-slate-300 cursor-grab pl-1", children: _jsx(GripVertical, { size: 16 }) }), quizType === 'QUIZ' && (_jsx("button", { type: "button", onClick: () => {
                                                    if (formState.type === 'SINGLE_CHOICE') {
                                                        setFormState((prev) => ({ ...prev, correctOption: option }));
                                                    }
                                                    else {
                                                        const current = formState.correctOptions || [];
                                                        const updated = current.includes(option)
                                                            ? current.filter((o) => o !== option)
                                                            : [...current, option];
                                                        setFormState((prev) => ({ ...prev, correctOptions: updated }));
                                                    }
                                                }, className: `
                                                    w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
                                                    ${isCorrect
                                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                                                    : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-400 group-hover:block hidden sm:flex'}
                                                `, title: "Do\u011Fru Cevap Olarak \u0130\u015Faretle", children: _jsx(CheckCircle2, { size: 16 }) })), _jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", value: option, onChange: (e) => updateOption(index, e.target.value), placeholder: `Secenek ${index + 1}`, className: `
                                                    w-full bg-transparent text-slate-900 border-none
                                                    focus:ring-0 focus:outline-none transition-all duration-200
                                                    font-medium text-sm py-1 px-1
                                                    ${quizType === 'QUIZ' && isCorrect ? 'placeholder:text-emerald-400' : 'placeholder:text-slate-400'}
                                                ` }) }), _jsx("div", { className: "flex items-center gap-1 pr-1", children: formState.options.length > 1 && (_jsx("button", { type: "button", onClick: () => removeOption(index), className: "p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100", children: _jsx(Trash2, { size: 16 }) })) })] }, index));
                                }) }), errors.options && (_jsx("p", { className: "mt-2 text-xs font-semibold text-rose-600 animate-fadeIn", children: errors.options }))] }))] }), _jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3", children: [_jsx("button", { type: "button", onClick: onCancel, className: "px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors", children: "Iptal" }), _jsxs("button", { type: "button", onClick: handleSave, className: "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors", children: [_jsx(Save, { size: 16 }), isNew ? 'Ekle' : 'Kaydet'] })] })] }));
};
export default QuestionEditor;
//# sourceMappingURL=QuestionEditor.js.map