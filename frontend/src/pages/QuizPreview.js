import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// QUIZ PREVIEW PAGE
// ============================================================================
// Internal preview page for the quiz designer.
// Allows creators to see how the quiz looks before publishing.
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/Card.js';
import { QuizForm } from '../components/quiz/index.js';
import { ClipboardList, AlertCircle, Eye } from 'lucide-react';
import { quizService } from '../services/quizService.js';
const QuizPreview = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Form state (for preview only, no submission)
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    useEffect(() => {
        if (id) {
            fetchQuiz(id);
        }
    }, [id]);
    const fetchQuiz = async (quizId) => {
        try {
            setIsLoading(true);
            const data = await quizService.getQuizById(quizId);
            setQuiz(data);
            if (data.timeLimit && data.timeLimit > 0) {
                setTimeLeft(data.timeLimit * 60);
            }
        }
        catch (err) {
            setError('Quiz önizlemesi yüklenemedi.');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0)
            return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: _jsx("div", { className: "w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) }));
    }
    if (error || !quiz) {
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: _jsxs(Card, { className: "max-w-md w-full text-center p-12", children: [_jsx("div", { className: "w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(AlertCircle, { size: 32 }) }), _jsx("h2", { className: "text-xl font-bold text-slate-900 mb-2", children: "Hata" }), _jsx("p", { className: "text-slate-500 mb-6", children: error || 'Quiz bulunamadı.' }), _jsx("button", { onClick: () => window.close(), className: "text-indigo-600 font-semibold hover:underline", children: "Pencereyi Kapat" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans", children: _jsxs("div", { className: "max-w-3xl mx-auto space-y-8 animate-fadeIn", children: [_jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 text-amber-800", children: [_jsx(Eye, { size: 18 }), _jsx("span", { className: "text-sm font-bold tracking-wide", children: "\u00D6N\u0130ZLEME MODU" })] }), _jsx("button", { onClick: () => window.close(), className: "text-amber-800/60 hover:text-amber-800 text-xs font-bold uppercase transition-colors", children: "Kapat" })] }), _jsxs("div", { className: "text-center space-y-4 pb-8 border-b border-slate-100", children: [_jsx("div", { className: "w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm", children: _jsx(ClipboardList, { size: 32 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900", children: quiz.title }), _jsx("div", { className: "w-20 h-1.5 bg-indigo-600 rounded-full mx-auto mt-4" })] }), quiz.description && (_jsx("p", { className: "text-slate-600 max-w-xl mx-auto leading-relaxed", children: quiz.description }))] }), timeLeft !== null && (_jsx("div", { className: "sticky top-20 z-40 mb-6", children: _jsxs("div", { className: "flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-white/20 rounded-lg", children: _jsx(Eye, { size: 20, className: "text-amber-400" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest opacity-60", children: "\u00D6nizleme S\u00FCresi" }), _jsx("p", { className: "text-xl font-black", children: formatTime(timeLeft) })] })] }), _jsx("div", { className: "text-xs font-bold bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full", children: "Zaman S\u0131n\u0131r\u0131 Aktif" })] }) })), _jsx(QuizForm, { questions: quiz.questions, answers: answers, errors: {}, onChange: (id, val) => setAnswers(prev => ({ ...prev, [id]: val })), quizType: quiz.type }), _jsx(Card, { className: "bg-slate-100 border-slate-200", children: _jsxs("div", { className: "p-6 text-center text-slate-500 space-y-2", children: [_jsx("p", { className: "text-sm font-medium", children: "Bu bir \u00F6nizlemedir." }), _jsx("p", { className: "text-xs", children: "Yan\u0131tlar sisteme kaydedilmez." })] }) })] }) }));
};
export default QuizPreview;
//# sourceMappingURL=QuizPreview.js.map