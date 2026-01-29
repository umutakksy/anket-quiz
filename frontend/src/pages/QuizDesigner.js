import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// QUIZ DESIGNER PAGE
// ============================================================================
// Full-featured quiz editor with question management.
// Allows adding, editing, deleting, and reordering questions.
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card.js';
import { Input } from '../components/FormElements.js';
import { QuizForm, validateQuizAnswers } from '../components/quiz/index.js';
import { ArrowLeft, Save, Send, Plus, Edit3, Trash2, GripVertical, Eye, Settings, Type, List, CheckSquare, AlertCircle, CheckCircle2, ExternalLink, BarChart3 } from 'lucide-react';
import { quizService } from '../services/quizService.js';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { QuestionEditor } from '../components/quiz/index.js';
// --- Question Type Icon Helper ---
const getQuestionTypeIcon = (type) => {
    switch (type) {
        case 'TEXT': return Type;
        case 'SINGLE_CHOICE': return List;
        case 'MULTIPLE_CHOICE': return CheckSquare;
        default: return Type;
    }
};
const getQuestionTypeLabel = (type) => {
    switch (type) {
        case 'TEXT': return 'Metin';
        case 'SINGLE_CHOICE': return 'Tekli Secim';
        case 'MULTIPLE_CHOICE': return 'Coklu Secim';
        default: return type;
    }
};
const QuestionCard = ({ question, index, onEdit, onDelete, dragHandleProps }) => {
    const Icon = getQuestionTypeIcon(question.type);
    return (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group", children: _jsxs("div", { className: "flex items-start gap-4 p-5", children: [_jsx("div", { ...dragHandleProps, className: "text-slate-300 cursor-grab hover:text-slate-400 mt-1 active:cursor-grabbing", title: "Siralamak icin surukleyin", children: _jsx(GripVertical, { size: 20 }) }), _jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm", children: index + 1 }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium", children: [_jsx(Icon, { size: 12 }), getQuestionTypeLabel(question.type)] }), question.required && (_jsx("span", { className: "inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium", children: "Zorunlu" }))] }), _jsx("p", { className: "text-slate-900 font-medium leading-relaxed", children: question.text }), question.options && question.options.length > 0 && (_jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [question.options.slice(0, 3).map((opt, i) => (_jsx("span", { className: "px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-sm border border-slate-100", children: opt }, i))), question.options.length > 3 && (_jsxs("span", { className: "px-3 py-1 text-slate-400 text-sm", children: ["+", question.options.length - 3, " daha"] }))] }))] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: onEdit, className: "p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors", title: "Duzenle", children: _jsx(Edit3, { size: 16 }) }), _jsx("button", { onClick: onDelete, className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors", title: "Sil", children: _jsx(Trash2, { size: 16 }) })] })] }) }));
};
// --- Main Component ---
const QuizDesigner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [timeLimit, setTimeLimit] = useState(0);
    useEffect(() => { if (id)
        fetchQuiz(id); }, [id]);
    const fetchQuiz = async (quizId) => {
        try {
            setIsLoading(true);
            const data = await quizService.getQuizById(quizId);
            setQuiz(data);
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug || '');
            setAnonymous(data.anonymous || false);
            setTimeLimit(data.timeLimit || 0);
        }
        catch (error) {
            console.error('Fetch failed:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleUpdateQuizLocally = (updates) => setQuiz((prev) => prev ? { ...prev, ...updates } : null);
    const handleSaveDetails = async () => {
        if (!quiz || !title.trim())
            return;
        try {
            setIsSaving(true);
            const updated = await quizService.updateQuiz(quiz.id, {
                title: title.trim(),
                description: description.trim() || undefined,
                slug: slug.trim() || undefined,
                anonymous,
                timeLimit,
                targetDepartments: quiz.targetDepartments
            });
            setQuiz(updated);
            setSlug(updated.slug || '');
            showSaveMessage('success', 'Degisiklikler kaydedildi.');
        }
        catch (error) {
            showSaveMessage('error', 'Kaydetme basarisiz oldu.');
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleAddQuestion = async (data) => {
        if (!quiz)
            return;
        try {
            const newQuestion = await quizService.addQuestion(quiz.id, { ...data, order: quiz.questions.length + 1 });
            setQuiz((prev) => prev ? { ...prev, questions: [...prev.questions, newQuestion] } : null);
            setIsAddingQuestion(false);
            showSaveMessage('success', 'Soru eklendi.');
        }
        catch (error) {
            showSaveMessage('error', 'Soru eklenemedi.');
        }
    };
    const handleUpdateQuestion = async (data) => {
        if (!quiz || !editingQuestion)
            return;
        try {
            const updated = await quizService.updateQuestion(quiz.id, editingQuestion.id, data);
            setQuiz((prev) => prev ? { ...prev, questions: prev.questions.map((q) => q.id === editingQuestion.id ? updated : q) } : null);
            setEditingQuestion(null);
            showSaveMessage('success', 'Soru guncellendi.');
        }
        catch (error) {
            showSaveMessage('error', 'Soru guncellenemedi.');
        }
    };
    const handleDeleteQuestion = async (questionId) => {
        if (!quiz || !confirm('Bu soruyu silmek istediginizden emin misiniz?'))
            return;
        try {
            await quizService.deleteQuestion(quiz.id, questionId);
            setQuiz((prev) => prev ? { ...prev, questions: prev.questions.filter((q) => q.id !== questionId) } : null);
            showSaveMessage('success', 'Soru silindi.');
        }
        catch (error) {
            showSaveMessage('error', 'Soru silinemedi.');
        }
    };
    const handlePublish = async () => {
        if (!quiz)
            return;
        if (!quiz.questions.length)
            return showSaveMessage('error', 'Yayinlamak icin en az bir soru ekleyin.');
        if (!confirm('Yayına alıyorsunuz, emin misiniz?'))
            return;
        try {
            setIsPublishing(true);
            // Save current details first to ensure timeLimit etc. are synced
            await handleSaveDetails();
            const result = await quizService.publishQuiz(quiz.id);
            setQuiz(result.quiz);
            navigator.clipboard.writeText(result.publicUrl);
            showSaveMessage('success', 'Quiz yayınlandı! Link kopyalandı.');
        }
        catch (error) {
            showSaveMessage('error', 'Yayınlama başarısız.');
        }
        finally {
            setIsPublishing(false);
        }
    };
    const showSaveMessage = (type, text) => {
        setSaveMessage({ type, text });
        setTimeout(() => setSaveMessage(null), 3000);
    };
    const handleDragEnd = async (result) => {
        if (!result.destination || !quiz)
            return;
        const items = Array.from(quiz.questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        if (!reorderedItem)
            return;
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedQuestions = items.map((q, idx) => ({ ...q, order: idx + 1 }));
        setQuiz({ ...quiz, questions: updatedQuestions });
        try {
            await quizService.reorderQuestions(quiz.id, updatedQuestions.map((q) => q.id));
            showSaveMessage('success', 'Siralamama kaydedildi.');
        }
        catch (error) {
            showSaveMessage('error', 'Siralama kaydedilemedi.');
            fetchQuiz(quiz.id);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) });
    if (!quiz)
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen", children: [_jsx(AlertCircle, { size: 48, className: "text-slate-400 mb-4" }), _jsx("h2", { className: "text-xl font-bold text-slate-900", children: "Quiz bulunamad\u0131" }), _jsx("button", { onClick: () => navigate('/'), className: "mt-4 text-indigo-600 font-bold", children: "Geri D\u00F6n" })] }));
    const isEditable = quiz.status === 'DRAFT';
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 pb-20", children: [_jsx("div", { className: "sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200", children: _jsxs("div", { className: "max-w-5xl mx-auto px-6 py-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-lg font-bold text-slate-900", children: quiz.title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${quiz.status === 'DRAFT' ? 'bg-slate-400' : quiz.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-rose-500'}` }), _jsx("span", { className: "text-xs font-bold text-slate-500 uppercase tracking-wider", children: quiz.status === 'DRAFT' ? 'Taslak' : quiz.status === 'PUBLISHED' ? 'Yayında' : 'Kapalı' })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [saveMessage && (_jsxs("div", { className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-fadeIn ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`, children: [saveMessage.type === 'success' ? _jsx(CheckCircle2, { size: 16 }) : _jsx(AlertCircle, { size: 16 }), " ", saveMessage.text] })), isEditable && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setShowSettings(!showSettings), className: `p-2.5 rounded-xl transition-all ${showSettings ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`, children: _jsx(Settings, { size: 20 }) }), _jsxs("button", { onClick: handleSaveDetails, disabled: isSaving, className: "flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all", children: [isSaving ? _jsx("div", { className: "w-4 h-4 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" }) : _jsx(Save, { size: 18 }), " Kaydet"] }), _jsxs("button", { onClick: handlePublish, disabled: isPublishing || !quiz.questions.length, className: "flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50", children: [_jsx(Send, { size: 18 }), " Yay\u0131nla"] })] })), quiz.status === 'PUBLISHED' && quiz.slug && (_jsxs("a", { href: `/quiz/${quiz.slug}`, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all", children: [_jsx(ExternalLink, { size: 18 }), " ", quiz.type === 'QUIZ' ? 'Quizi' : 'Anketi', " G\u00F6r"] }))] })] }) }), _jsx("div", { className: "max-w-5xl mx-auto px-6 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [showSettings && isEditable && (_jsx(Card, { className: "animate-fadeIn border-indigo-100", children: _jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("h3", { className: "text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4", children: [quiz.type === 'QUIZ' ? 'Quiz' : 'Anket', " Ayarlar\u0131"] }), _jsx(Input, { label: `${quiz.type === 'QUIZ' ? 'Quiz' : 'Anket'} Başlığı`, value: title, onChange: (e) => setTitle(e.target.value), required: true }), _jsx(Input, { label: "\u00D6zel Link (Slug)", value: slug, onChange: (e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')), placeholder: "\u00F6rn: genel-kultur", helperText: "Bo\u015F b\u0131rak\u0131l\u0131rsa otomatik \u00FCretilir." }), _jsxs("label", { className: "flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition-colors", children: [_jsx("input", { type: "checkbox", checked: anonymous, onChange: (e) => setAnonymous(e.target.checked), className: "w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" }), _jsxs("span", { className: "text-sm font-bold text-slate-700", children: ["Anonim ", quiz.type === 'QUIZ' ? 'Quiz' : 'Anket', " (\u0130sim sormadan)"] })] }), quiz.type === 'QUIZ' && (_jsx(Input, { label: "S\u00FCre S\u0131n\u0131r\u0131 (Dakika)", type: "number", value: timeLimit, onChange: (e) => setTimeLimit(parseInt(e.target.value) || 0), helperText: "0 ise s\u0131n\u0131rs\u0131zd\u0131r." })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2 ml-1", children: "Hedef Departmanlar" }), _jsx("div", { className: "flex flex-wrap gap-2", children: ['Yazılım', 'HR', 'Finans', 'Pazarlama', 'Satış', 'Operasyon'].map((dept) => (_jsx("button", { type: "button", onClick: () => {
                                                                const current = quiz.targetDepartments || [];
                                                                const updated = current.includes(dept) ? current.filter((d) => d !== dept) : [...current, dept];
                                                                handleUpdateQuizLocally({ targetDepartments: updated });
                                                            }, className: `px-4 py-2 rounded-xl text-xs font-bold border transition-all ${(quiz.targetDepartments || []).includes(dept) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`, children: dept }, dept))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2 ml-1", children: "A\u00E7\u0131klama" }), _jsx("textarea", { className: "w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-medium text-sm p-4 min-h-[100px] resize-none", placeholder: "Kat\u0131l\u0131mc\u0131lara g\u00F6sterilecek mesaj...", value: description, onChange: (e) => setDescription(e.target.value) })] })] }) })), _jsxs("div", { className: "space-y-4", children: [quiz.questions.length === 0 ? (_jsxs(Card, { className: "p-16 text-center border-dashed border-2", children: [_jsx(Type, { size: 48, className: "text-slate-300 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Hen\u00FCz soru eklenmemi\u015F" }), _jsx("p", { className: "text-sm text-slate-500 mt-2 mb-8", children: "Haydi, ilk sorunuzu ekleyerek ba\u015Flay\u0131n!" }), isEditable && _jsx("button", { onClick: () => setIsAddingQuestion(true), className: "inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-lg", children: "Soru Ekle" })] })) : (_jsxs(_Fragment, { children: [_jsx(DragDropContext, { onDragEnd: handleDragEnd, children: _jsx(Droppable, { droppableId: "questions", isDropDisabled: !isEditable, children: (provided) => (_jsxs("div", { ...provided.droppableProps, ref: provided.innerRef, className: "space-y-4", children: [quiz.questions.slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((question, index) => (_jsx(Draggable, { draggableId: question.id, index: index, isDragDisabled: !isEditable, children: (provided) => (_jsx("div", { ref: provided.innerRef, ...provided.draggableProps, children: _jsx(QuestionCard, { question: question, index: index, onEdit: () => isEditable && setEditingQuestion(question), onDelete: () => isEditable && handleDeleteQuestion(question.id), dragHandleProps: provided.dragHandleProps }) })) }, question.id))), provided.placeholder] })) }) }), isEditable && !isAddingQuestion && !editingQuestion && (_jsx("button", { onClick: () => setIsAddingQuestion(true), className: "w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-2xl transition-all font-bold", children: "+ Yeni Soru" }))] })), (isAddingQuestion || editingQuestion) && isEditable && (_jsx(QuestionEditor, { question: editingQuestion || undefined, isNew: isAddingQuestion, quizType: quiz.type, onSave: editingQuestion ? handleUpdateQuestion : handleAddQuestion, onCancel: () => { setIsAddingQuestion(false); setEditingQuestion(null); } }))] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "p-6", children: [_jsxs("h3", { className: "font-bold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(BarChart3, { size: 18, className: "text-indigo-600" }), " ", quiz.type === 'QUIZ' ? 'Quiz' : 'Anket', " Bilgileri"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-50", children: [_jsx("span", { className: "text-sm text-slate-500", children: "Soru Say\u0131s\u0131" }), _jsx("span", { className: "text-sm font-bold text-slate-900", children: quiz.questions.length })] }), quiz.type === 'QUIZ' && (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-slate-50", children: [_jsx("span", { className: "text-sm text-slate-500", children: "S\u00FCre S\u0131n\u0131r\u0131" }), _jsx("span", { className: "text-sm font-bold text-slate-900", children: (quiz.timeLimit || 0) > 0 ? `${quiz.timeLimit} Dakika` : 'Sınırsız' })] })), _jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsx("span", { className: "text-sm text-slate-500", children: "Olu\u015Fturulma" }), _jsx("span", { className: "text-sm font-bold text-slate-900", children: new Date(quiz.createdAt).toLocaleDateString('tr-TR') })] })] })] }), _jsxs(Card, { className: "p-6", children: [_jsxs("h3", { className: "font-bold text-slate-900 mb-4 flex items-center gap-2", children: [_jsx(Eye, { size: 18, className: "text-indigo-600" }), " \u00D6nizleme"] }), _jsx("p", { className: "text-xs text-slate-500 mb-6", children: "Quiz yay\u0131nland\u0131\u011F\u0131nda nas\u0131l g\u00F6r\u00FCnece\u011Fini merak ediyor musunuz?" }), _jsx("button", { onClick: () => window.open(`/quiz/preview/${quiz.id}`, '_blank'), className: "w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all", children: "G\u00F6z At" })] })] })] }) })] }));
};
export default QuizDesigner;
//# sourceMappingURL=QuizDesigner.js.map