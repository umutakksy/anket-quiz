// ============================================================================
// QUIZ PREVIEW PAGE
// ============================================================================
// Internal preview page for the quiz designer.
// Allows creators to see how the quiz looks before publishing.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { QuizForm } from '../components/quiz';
import {
    ClipboardList,
    AlertCircle,
    Eye
} from 'lucide-react';
import { quizService } from '../services/quizService';
import type { Quiz } from '../types/quiz';

const QuizPreview: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state (for preview only, no submission)
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (id) {
            fetchQuiz(id);
        }
    }, [id]);

    const fetchQuiz = async (quizId: string) => {
        try {
            setIsLoading(true);
            const data = await quizService.getQuizById(quizId);
            setQuiz(data);
            if (data.timeLimit && data.timeLimit > 0) {
                setTimeLeft(data.timeLimit * 60);
            }
        } catch (err) {
            setError('Quiz önizlemesi yüklenemedi.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-12">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Hata</h2>
                    <p className="text-slate-500 mb-6">{error || 'Quiz bulunamadı.'}</p>
                    <button
                        onClick={() => window.close()}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Pencereyi Kapat
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
                {/* Preview Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 text-amber-800">
                        <Eye size={18} />
                        <span className="text-sm font-bold tracking-wide">ÖNİZLEME MODU</span>
                    </div>
                    <button
                        onClick={() => window.close()}
                        className="text-amber-800/60 hover:text-amber-800 text-xs font-bold uppercase transition-colors"
                    >
                        Kapat
                    </button>
                </div>

                {/* Header */}
                <div className="text-center space-y-4 pb-8 border-b border-slate-100">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                            {quiz.title}
                        </h1>
                        <div className="w-20 h-1.5 bg-indigo-600 rounded-full mx-auto mt-4" />
                    </div>
                    {quiz.description && (
                        <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
                            {quiz.description}
                        </p>
                    )}
                </div>

                {/* Timer (if applicable) */}
                {timeLeft !== null && (
                    <div className="sticky top-20 z-40 mb-6">
                        <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Eye size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Önizleme Süresi</p>
                                    <p className="text-xl font-black">{formatTime(timeLeft)}</p>
                                </div>
                            </div>
                            <div className="text-xs font-bold bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full">
                                Zaman Sınırı Aktif
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Form */}
                <QuizForm
                    questions={quiz.questions}
                    answers={answers}
                    errors={{}}
                    onChange={(id, val) => setAnswers(prev => ({ ...prev, [id]: val }))}
                />

                {/* Preview Action */}
                <Card className="bg-slate-100 border-slate-200">
                    <div className="p-6 text-center text-slate-500 space-y-2">
                        <p className="text-sm font-medium">Bu bir önizlemedir.</p>
                        <p className="text-xs">Yanıtlar sisteme kaydedilmez.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default QuizPreview;
