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
import {
    ClipboardList,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2,
    Send,
    ChevronLeft,
    ChevronRight,
    Clock as ClockIcon,
    Timer,
    Trophy
} from 'lucide-react';
import { quizService } from '../services/quizService.js';
import type { PublicQuiz, QuestionAnswer, QuizQuestion } from '../types/quiz.js';

// --- Main Component ---

const PublicQuizPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [respondentName, setRespondentName] = useState('');
    const [respondentEmail, setRespondentEmail] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const autoAdvanceTimeoutRef = React.useRef<any>(null);

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [quizResult, setQuizResult] = useState<{ score: number; correct: number; total: number; timeTaken: number } | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 for info step, 0+ for questions

    useEffect(() => {
        if (slug) {
            const hasSubmitted = localStorage.getItem(`quiz_submitted_${slug}`);
            if (hasSubmitted) {
                setError('Bu quize daha önce katıldınız. Her kullanıcının sadece bir kez katılım hakkı vardır.');
                setIsLoading(false);
            } else {
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

    const fetchQuiz = async (quizSlug: string) => {
        try {
            setIsLoading(true);
            const data = await quizService.getPublicQuizBySlug(quizSlug);
            setQuiz(data);
            if (data.timeLimit && data.timeLimit > 0) {
                const totalSeconds = data.timeLimit * 60;
                setTimeLeft(totalSeconds);
            }
        } catch (err) {
            setError(`${quiz?.type === 'SURVEY' ? 'Anket' : 'Quiz'} bulunamadı veya artık yayında değil.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isSubmitted || isTimeUp || !startTime) return;
        const timer = setInterval(() => {
            setTimeLeft((prev: number | null) => {
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

    const calculateScore = (questions: QuizQuestion[], userAnswers: Record<string, string | string[]>) => {
        let correctCount = 0;
        const objectiveQuestions = questions.filter(q => q.type !== 'TEXT');
        const totalCount = objectiveQuestions.length;

        questions.forEach(q => {
            if (q.type === 'SINGLE_CHOICE') {
                if (userAnswers[q.id] === q.correctOption) correctCount++;
            } else if (q.type === 'MULTIPLE_CHOICE') {
                const userAns = (userAnswers[q.id] as string[]) || [];
                const correctAns = q.correctOptions || [];
                if (userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val))) correctCount++;
            }
        });

        const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
        return { score, correct: correctCount, total: totalCount };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionId: string, value: string | string[]) => {
        setAnswers((prev: Record<string, string | string[]>) => ({ ...prev, [questionId]: value }));
        if (validationErrors[questionId]) {
            setValidationErrors((prev: Record<string, string>) => {
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
                setCurrentQuestionIndex((prev: number) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                autoAdvanceTimeoutRef.current = null;
            }, 400);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex === -1) {
            // Validate user info
            const personalErrors: Record<string, string> = {};
            if (!respondentName.trim()) personalErrors.respondentName = 'Ad Soyad zorunludur.';
            if (!respondentEmail.trim()) personalErrors.respondentEmail = 'E-posta adresi zorunludur.';
            if (Object.keys(personalErrors).length > 0) {
                setValidationErrors((prev: Record<string, string>) => ({ ...prev, ...personalErrors }));
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
                setValidationErrors((prev: Record<string, string>) => ({ ...prev, ...errors }));
                return;
            }
        }

        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex((prev: number) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev: number) => prev - 1);
        } else if (currentQuestionIndex === 0 && !quiz?.anonymous) {
            setCurrentQuestionIndex(-1);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!quiz) return;

        // Validate current question before submit
        const currentQuestion = quiz.questions[currentQuestionIndex];
        if (currentQuestion) {
            const errors = validateQuizAnswers([currentQuestion], answers);
            if (Object.keys(errors).length > 0) {
                setValidationErrors((prev: Record<string, string>) => ({ ...prev, ...errors }));
                return;
            }
        }

        const answersArray: QuestionAnswer[] = quiz.questions.map((q: QuizQuestion) => ({
            questionId: q.id,
            value: answers[q.id] || (q.type === 'MULTIPLE_CHOICE' ? [] : '')
        }));

        const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        const result = calculateScore(quiz.questions, answers);

        try {
            setIsSubmitting(true);
            await quizService.submitQuizResponse(slug!, {
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
        } catch (err) {
            setError('Yanıt gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSteps = quiz?.questions.length || 0;
    const progress = currentQuestionIndex === -1 ? 0 : ((currentQuestionIndex + 1) / totalSteps) * 100;

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-bold">Yükleniyor...</p>
            </div>
        </div>
    );

    if (error && !quiz) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center p-12 border-t-8 border-rose-500">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Daha Önce Katıldınız</h2>
                <p className="text-slate-500 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">Tekrar Dene</button>
            </Card>
        </div>
    );

    if (quiz?.status === 'CLOSED') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center p-12 border-t-8 border-slate-400">
                <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6"><XCircle size={40} /></div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">{quiz.type === 'QUIZ' ? 'Quiz' : 'Anket'} Kapandı</h2>
                <p className="text-slate-500 font-medium">Bu {quiz.type === 'QUIZ' ? 'quiz' : 'anket'} artık yanıt kabul etmemektedir. Katılımınız için teşekkürler.</p>
            </Card>
        </div>
    );

    if (isSubmitted) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center p-12 space-y-8 animate-fadeIn border-t-8 border-indigo-600">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100"><CheckCircle2 size={48} /></div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Tebrikler!</h2>
                    <p className="text-slate-500 font-bold mt-1">{quiz?.type === 'QUIZ' ? 'Quiz Başarıyla Tamamlandı' : 'Anket Yanıtlarınız Kaydedildi'}</p>
                </div>

                <p className="text-slate-600 font-medium leading-relaxed">Yanıtlarınız güvenli bir şekilde kaydedildi. Katılımınız için teşekkür ederiz.</p>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto space-y-5 animate-fadeIn">
                <div className="text-center space-y-3 pb-2">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 border border-slate-100"><ClipboardList size={32} className="text-indigo-600" /></div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">{quiz?.title}</h1>
                    {quiz?.description && <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">{quiz.description}</p>}
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-8">
                    <div
                        className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Timer Section (Sticky) */}
                {timeLeft !== null && timeLeft >= 0 && (
                    <div className="sticky top-4 z-40 mb-6 group">
                        <div className={`
                            flex items-center justify-between gap-4 px-6 py-4 rounded-3xl border-2 shadow-2xl transition-all duration-500
                            ${timeLeft < 60
                                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                                : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                            }
                        `}>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl ${timeLeft < 60 ? 'bg-white/20' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    <ClockIcon size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Kalan Süreniz</p>
                                    <p className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</p>
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-col items-end">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${timeLeft < 60 ? 'bg-white/20' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    {timeLeft < 60 ? 'ACELE EDİN!' : 'SÜRE İŞLİYOR'}
                                </div>
                                <div className="mt-1 h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-white' : 'bg-indigo-500'}`}
                                        style={{ width: `${(timeLeft / (quiz?.timeLimit ? quiz.timeLimit * 60 : 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="min-h-[400px]">
                    {currentQuestionIndex === -1 ? (
                        <Card className="p-6 border-indigo-100 bg-white/50 backdrop-blur-sm shadow-lg animate-slideInRight">
                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">Bilgileriniz</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Ad Soyad</label>
                                    <input type="text" value={respondentName} onChange={(e) => { setRespondentName(e.target.value); if (validationErrors.respondentName) setValidationErrors((prev: Record<string, string>) => { const upd = { ...prev }; delete upd.respondentName; return upd; }); }} placeholder="Adınızı giriniz..." className={`w-full bg-white border-2 border-slate-100 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all p-3 font-bold text-sm ${validationErrors.respondentName ? 'border-rose-200 bg-rose-50' : ''}`} />
                                    {validationErrors.respondentName && <p className="text-[10px] font-bold text-rose-500 ml-1">{validationErrors.respondentName}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">E-posta</label>
                                    <input type="email" value={respondentEmail} onChange={(e) => { setRespondentEmail(e.target.value); if (validationErrors.respondentEmail) setValidationErrors((prev: Record<string, string>) => { const upd = { ...prev }; delete upd.respondentEmail; return upd; }); }} placeholder="E-posta adresiniz..." className={`w-full bg-white border-2 border-slate-100 text-slate-900 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all p-3 font-bold text-sm ${validationErrors.respondentEmail ? 'border-rose-200 bg-rose-50' : ''}`} />
                                    {validationErrors.respondentEmail && <p className="text-[10px] font-bold text-rose-500 ml-1">{validationErrors.respondentEmail}</p>}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4 animate-slideInRight">
                            {quiz && quiz.questions[currentQuestionIndex] && (
                                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            Soru {currentQuestionIndex + 1} / {totalSteps}
                                        </span>
                                    </div>
                                    {(() => {
                                        const q = quiz.questions[currentQuestionIndex]!;
                                        return (
                                            <QuestionRenderer
                                                question={q}
                                                value={answers[q.id] || (q.type === 'MULTIPLE_CHOICE' ? [] : '')}
                                                onChange={(value: string | string[]) => handleAnswerChange(q.id, value)}
                                                quizType={quiz?.type}
                                                error={validationErrors[q.id]}
                                                disabled={isSubmitting}
                                            />
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Controls */}
                <div className="flex gap-3 pt-6">
                    {(currentQuestionIndex > 0 || (currentQuestionIndex === 0 && !quiz?.anonymous)) && (
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="flex-1 flex items-center justify-center gap-2 py-4 text-base font-black text-slate-600 bg-white border-2 border-slate-100 hover:bg-slate-50 rounded-2xl shadow-md transition-all"
                        >
                            <ChevronLeft size={20} />
                            GERİ
                        </button>
                    )}

                    {currentQuestionIndex < totalSteps - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="flex-[2] group relative flex items-center justify-center gap-2 py-4 text-lg font-black text-white bg-indigo-600 hover:bg-slate-900 rounded-2xl shadow-lg transition-all"
                        >
                            SONRAKİ
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                            id="submit-quiz-btn"
                            className="flex-[2] group relative flex items-center justify-center gap-2 py-4 text-lg font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-100 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    GÖNDERİLİYOR...
                                </>
                            ) : (
                                <>
                                    {quiz?.type === 'QUIZ' ? 'TAMAMLA' : 'GÖNDER'}
                                    <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicQuizPage;
