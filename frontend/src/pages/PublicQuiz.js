import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// PUBLIC QUIZ PAGE
// ============================================================================
// Public-facing quiz page for respondents (no authentication required).
// Renders quiz dynamically from JSON and handles response submission.
// Similar to the "/basvuru" (JobApplication) pattern.
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/Card.js';
import { QuizForm, validateQuizAnswers, QuestionRenderer } from '../components/quiz/index.js';
import { ClipboardList, CheckCircle2, AlertCircle, XCircle, Loader2, Send, ChevronLeft, ChevronRight, Clock as ClockIcon, Timer, Trophy } from 'lucide-react';
import { quizService } from '../services/quizService.js';
// --- Main Component ---
const PublicQuizPage = () => {
    const { slug } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [respondentName, setRespondentName] = useState('');
    const [respondentEmail, setRespondentEmail] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const autoAdvanceTimeoutRef = React.useRef(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 for info step, 0+ for questions
    useEffect(() => {
        if (slug) {
            const hasSubmitted = localStorage.getItem(`quiz_submitted_${slug}`);
            if (hasSubmitted) {
                setError('Bu quize daha önce katıldınız. Her kullanıcının sadece bir kez katılım hakkı vardır.');
                setIsLoading(false);
            }
            else {
                fetchQuiz(slug);
            }
        }
    }, [slug]);
    useEffect(() => {
        if (quiz && currentQuestionIndex === -1 && quiz.anonymous) {
            setCurrentQuestionIndex(0);
            if (quiz.timeLimit && quiz.timeLimit > 0) {
                setStartTime(Date.now());
            }
        }
    }, [quiz]);
    const fetchQuiz = async (quizSlug) => {
        try {
            setIsLoading(true);
            const data = await quizService.getPublicQuizBySlug(quizSlug);
            setQuiz(data);
            if (data.timeLimit && data.timeLimit > 0) {
                const totalSeconds = data.timeLimit * 60;
                setTimeLeft(totalSeconds);
            }
        }
        catch (err) {
            setError(`${quiz?.type === 'SURVEY' ? 'Anket' : 'Quiz'} bulunamadı veya artık yayında değil.`);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isSubmitted || isTimeUp || !startTime)
            return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev !== null && prev <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    handleAutoSubmit();
                    return 0;
                }
                return prev !== null ? prev - 1 : null;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted, isTimeUp, startTime]);
    const handleAutoSubmit = () => {
        handleSubmit();
    };
    const calculateScore = (questions, userAnswers) => {
        let correctCount = 0;
        const objectiveQuestions = questions.filter(q => q.type !== 'TEXT');
        const totalCount = objectiveQuestions.length;
        questions.forEach(q => {
            if (q.type === 'SINGLE_CHOICE') {
                if (userAnswers[q.id] === q.correctOption)
                    correctCount++;
            }
            else if (q.type === 'MULTIPLE_CHOICE') {
                const userAns = userAnswers[q.id] || [];
                const correctAns = q.correctOptions || [];
                if (userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val)))
                    correctCount++;
            }
        });
        const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
        return { score, correct: correctCount, total: totalCount };
    };
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
        if (validationErrors[questionId]) {
            setValidationErrors((prev) => {
                const updated = { ...prev };
                delete updated[questionId];
                return updated;
            });
        }
        // Auto-advance for single choice if it's not the last question and it's a QUIZ
        const question = quiz?.questions.find(q => q.id === questionId);
        if (quiz?.type === 'QUIZ' && question?.type === 'SINGLE_CHOICE' && currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            // Clear any existing timeout to prevent double-jumping
            if (autoAdvanceTimeoutRef.current) {
                clearTimeout(autoAdvanceTimeoutRef.current);
            }
            autoAdvanceTimeoutRef.current = setTimeout(() => {
                setCurrentQuestionIndex((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                autoAdvanceTimeoutRef.current = null;
            }, 400);
        }
    };
    const handleNext = () => {
        if (currentQuestionIndex === -1) {
            // Validate user info
            const personalErrors = {};
            if (!respondentName.trim())
                personalErrors.respondentName = 'Ad Soyad zorunludur.';
            if (!respondentEmail.trim())
                personalErrors.respondentEmail = 'E-posta adresi zorunludur.';
            if (Object.keys(personalErrors).length > 0) {
                setValidationErrors((prev) => ({ ...prev, ...personalErrors }));
                return;
            }
            // Start the timer when moving from info step to first question
            if (quiz?.timeLimit && quiz.timeLimit > 0 && !startTime) {
                setStartTime(Date.now());
            }
            setCurrentQuestionIndex(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const currentQuestion = quiz?.questions[currentQuestionIndex];
        if (currentQuestion) {
            const errors = validateQuizAnswers([currentQuestion], answers);
            if (Object.keys(errors).length > 0) {
                setValidationErrors((prev) => ({ ...prev, ...errors }));
                return;
            }
        }
        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
        else if (currentQuestionIndex === 0 && !quiz?.anonymous) {
            setCurrentQuestionIndex(-1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleSubmit = async (e) => {
        if (e)
            e.preventDefault();
        if (!quiz)
            return;
        // Validate current question before submit
        const currentQuestion = quiz.questions[currentQuestionIndex];
        if (currentQuestion) {
            const errors = validateQuizAnswers([currentQuestion], answers);
            if (Object.keys(errors).length > 0) {
                setValidationErrors((prev) => ({ ...prev, ...errors }));
                return;
            }
        }
        const answersArray = quiz.questions.map((q) => ({
            questionId: q.id,
            value: answers[q.id] || (q.type === 'MULTIPLE_CHOICE' ? [] : '')
        }));
        const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        const result = calculateScore(quiz.questions, answers);
        try {
            setIsSubmitting(true);
            await quizService.submitQuizResponse(slug, {
                answers: answersArray,
                respondentName: quiz.anonymous ? undefined : respondentName.trim(),
                respondentEmail: quiz.anonymous ? undefined : respondentEmail.trim(),
                completingTime: timeTaken,
                score: result.score
            });
            localStorage.setItem(`quiz_submitted_${slug}`, 'true');
            setQuizResult({ ...result, timeTaken });
            setIsSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        catch (err) {
            setError('Yanıt gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const totalSteps = quiz?.questions.length || 0;
    const progress = currentQuestionIndex === -1 ? 0 : ((currentQuestionIndex + 1) / totalSteps) * 100;
    if (isLoading)
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-slate-600 font-bold", children: "Y\u00FCkleniyor..." })] }) }));
    if (error && !quiz)
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: _jsxs(Card, { className: "max-w-md w-full text-center p-12 border-t-8 border-rose-500", children: [_jsx("div", { className: "w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(AlertCircle, { size: 40 }) }), _jsx("h2", { className: "text-2xl font-black text-slate-900 mb-2", children: "Daha \u00D6nce Kat\u0131ld\u0131n\u0131z" }), _jsx("p", { className: "text-slate-500 font-medium", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg", children: "Tekrar Dene" })] }) }));
    if (quiz?.status === 'CLOSED')
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: _jsxs(Card, { className: "max-w-md w-full text-center p-12 border-t-8 border-slate-400", children: [_jsx("div", { className: "w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(XCircle, { size: 40 }) }), _jsxs("h2", { className: "text-2xl font-black text-slate-900 mb-2", children: [quiz.type === 'QUIZ' ? 'Quiz' : 'Anket', " Kapand\u0131"] }), _jsxs("p", { className: "text-slate-500 font-medium", children: ["Bu ", quiz.type === 'QUIZ' ? 'quiz' : 'anket', " art\u0131k yan\u0131t kabul etmemektedir. Kat\u0131l\u0131m\u0131n\u0131z i\u00E7in te\u015Fekk\u00FCrler."] })] }) }));
    if (isSubmitted)
        return (_jsx("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: _jsxs(Card, { className: "max-w-md w-full text-center p-12 space-y-8 animate-fadeIn border-t-8 border-indigo-600", children: [_jsx("div", { className: "w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100", children: _jsx(CheckCircle2, { size: 48 }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-black text-slate-900", children: "Tebrikler!" }), _jsx("p", { className: "text-slate-500 font-bold mt-1", children: quiz?.type === 'QUIZ' ? 'Quiz Başarıyla Tamamlandı' : 'Anket Yanıtlarınız Kaydedildi' })] }), _jsx("p", { className: "text-slate-600 font-medium leading-relaxed", children: "Yan\u0131tlar\u0131n\u0131z g\u00FCvenli bir \u015Fekilde kaydedildi. Kat\u0131l\u0131m\u0131n\u0131z i\u00E7in te\u015Fekk\u00FCr ederiz." })] }) }));
    return (_jsx("div", { className: "min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans", children: _jsxs("div", { className: "max-w-xl mx-auto space-y-5 animate-fadeIn", children: [_jsxs("div", { className: "text-center space-y-3 pb-2", children: [_jsx("div", { className: "w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 border border-slate-100", children: _jsx(ClipboardList, { size: 32, className: "text-indigo-600" }) }), _jsx("h1", { className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase", children: quiz?.title }), quiz?.description && _jsx("p", { className: "text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-medium", children: quiz.description })] }), _jsx("div", { className: "relative h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-8", children: _jsx("div", { className: "absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500 ease-out", style: { width: `${progress}%` } }) }), timeLeft !== null && timeLeft >= 0 && (_jsx("div", { className: "sticky top-4 z-40 mb-6 group", children: _jsxs("div", { className: `
                            flex items-center justify-between gap-4 px-6 py-4 rounded-3xl border-2 shadow-2xl transition-all duration-500
                            ${timeLeft < 60
                            ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                            : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'}
                        `, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-2 rounded-xl ${timeLeft < 60 ? 'bg-white/20' : 'bg-indigo-500/20 text-indigo-400'}`, children: _jsx(ClockIcon, { size: 24 }) }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-widest opacity-60", children: "Kalan S\u00FCreniz" }), _jsx("p", { className: "text-2xl font-black tabular-nums", children: formatTime(timeLeft) })] })] }), _jsxs("div", { className: "hidden sm:flex flex-col items-end", children: [_jsx("div", { className: `px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${timeLeft < 60 ? 'bg-white/20' : 'bg-indigo-500/20 text-indigo-400'}`, children: timeLeft < 60 ? 'ACELE EDİN!' : 'SÜRE İŞLİYOR' }), _jsx("div", { className: "mt-1 h-1.5 w-24 bg-white/10 rounded-full overflow-hidden", children: _jsx("div", { className: `h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-white' : 'bg-indigo-500'}`, style: { width: `${(timeLeft / (quiz?.timeLimit ? quiz.timeLimit * 60 : 1)) * 100}%` } }) })] })] }) })), _jsx("div", { className: "min-h-[400px]", children: currentQuestionIndex === -1 ? (_jsxs(Card, { className: "p-6 border-indigo-100 bg-white/50 backdrop-blur-sm shadow-lg animate-slideInRight", children: [_jsx("h3", { className: "text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2", children: "Bilgileriniz" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-black text-slate-500 uppercase ml-1", children: "Ad Soyad" }), _jsx("input", { type: "text", value: respondentName, onChange: (e) => { setRespondentName(e.target.value); if (validationErrors.respondentName)
                                                    setValidationErrors((prev) => { const upd = { ...prev }; delete upd.respondentName; return upd; }); }, placeholder: "Ad\u0131n\u0131z\u0131 giriniz...", className: `w-full bg-white border-2 border-slate-100 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all p-3 font-bold text-sm ${validationErrors.respondentName ? 'border-rose-200 bg-rose-50' : ''}` }), validationErrors.respondentName && _jsx("p", { className: "text-[10px] font-bold text-rose-500 ml-1", children: validationErrors.respondentName })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-[10px] font-black text-slate-500 uppercase ml-1", children: "E-posta" }), _jsx("input", { type: "email", value: respondentEmail, onChange: (e) => { setRespondentEmail(e.target.value); if (validationErrors.respondentEmail)
                                                    setValidationErrors((prev) => { const upd = { ...prev }; delete upd.respondentEmail; return upd; }); }, placeholder: "E-posta adresiniz...", className: `w-full bg-white border-2 border-slate-100 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all p-3 font-bold text-sm ${validationErrors.respondentEmail ? 'border-rose-200 bg-rose-50' : ''}` }), validationErrors.respondentEmail && _jsx("p", { className: "text-[10px] font-bold text-rose-500 ml-1", children: validationErrors.respondentEmail })] })] })] })) : (_jsx("div", { className: "space-y-4 animate-slideInRight", children: quiz && quiz.questions[currentQuestionIndex] && (_jsxs("div", { className: "p-6 bg-white rounded-2xl border border-slate-100 shadow-lg", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("span", { className: "px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider", children: ["Soru ", currentQuestionIndex + 1, " / ", totalSteps] }) }), (() => {
                                    const q = quiz.questions[currentQuestionIndex];
                                    return (_jsx(QuestionRenderer, { question: q, value: answers[q.id] || (q.type === 'MULTIPLE_CHOICE' ? [] : ''), onChange: (value) => handleAnswerChange(q.id, value), quizType: quiz?.type, error: validationErrors[q.id], disabled: isSubmitting }));
                                })()] })) })) }), _jsxs("div", { className: "flex gap-3 pt-6", children: [(currentQuestionIndex > 0 || (currentQuestionIndex === 0 && !quiz?.anonymous)) && (_jsxs("button", { type: "button", onClick: handleBack, disabled: isSubmitting, className: "flex-1 flex items-center justify-center gap-2 py-4 text-base font-black text-slate-600 bg-white border-2 border-slate-100 hover:bg-slate-50 rounded-2xl shadow-md transition-all", children: [_jsx(ChevronLeft, { size: 20 }), "GER\u0130"] })), currentQuestionIndex < totalSteps - 1 ? (_jsxs("button", { type: "button", onClick: handleNext, disabled: isSubmitting, className: "flex-[2] group relative flex items-center justify-center gap-2 py-4 text-lg font-black text-white bg-indigo-600 hover:bg-slate-900 rounded-2xl shadow-lg transition-all", children: ["SONRAK\u0130", _jsx(ChevronRight, { size: 20, className: "group-hover:translate-x-1 transition-transform" })] })) : (_jsx("button", { type: "button", onClick: () => handleSubmit(), disabled: isSubmitting, id: "submit-quiz-btn", className: "flex-[2] group relative flex items-center justify-center gap-2 py-4 text-lg font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-100 transition-all", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 20, className: "animate-spin" }), "G\u00D6NDER\u0130L\u0130YOR..."] })) : (_jsxs(_Fragment, { children: [quiz?.type === 'QUIZ' ? 'TAMAMLA' : 'GÖNDER', _jsx(Send, { size: 20, className: "group-hover:translate-x-1 transition-transform" })] })) }))] })] }) }));
};
export default PublicQuizPage;
//# sourceMappingURL=PublicQuiz.js.map