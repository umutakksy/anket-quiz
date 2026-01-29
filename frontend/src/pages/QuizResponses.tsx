// ============================================================================
// QUIZ RESPONSES PAGE
// ============================================================================
// Displays all responses for a quiz with basic analytics.
// Shows individual responses and aggregate statistics.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import {
    ArrowLeft,
    BarChart3,
    Users,
    Calendar,
    Download,
    Eye,
    ChevronDown,
    ChevronUp,
    Type,
    List,
    CheckSquare,
    Clock
} from 'lucide-react';
import { quizService } from '../services/quizService';
import type { Quiz, QuizResponse, QuizStatsResponse, QuestionType } from '../types/quiz';

// --- Question Type Icon ---

const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
        case 'TEXT': return Type;
        case 'SINGLE_CHOICE': return List;
        case 'MULTIPLE_CHOICE': return CheckSquare;
        default: return Type;
    }
};

// --- Stats Card ---

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    </div>
);

// --- Response Card ---

interface ResponseCardProps {
    response: QuizResponse;
    quiz: Quiz;
    isExpanded: boolean;
    onToggle: () => void;
}

const ResponseCard: React.FC<ResponseCardProps> = ({
    response,
    quiz,
    isExpanded,
    onToggle
}) => {
    // Create a map of question ID to question for easy lookup
    const questionMap = new Map(quiz.questions.map((q: any) => [q.id, q]));

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {(response.respondentName || response.respondentEmail)?.[0]?.toUpperCase() || '#'}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">
                            {response.respondentName || response.respondentEmail || 'Anonim Katilimci'}
                        </p>
                        {response.respondentName && response.respondentEmail && (
                            <p className="text-xs text-slate-400 font-medium -mt-0.5">{response.respondentEmail}</p>
                        )}
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Clock size={12} />
                            {new Date(response.submittedAt).toLocaleString('tr-TR')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                        {response.answers.length} yanit
                    </span>
                    {isExpanded ? (
                        <ChevronUp size={20} className="text-slate-400" />
                    ) : (
                        <ChevronDown size={20} className="text-slate-400" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50 animate-fadeIn">
                    {response.answers.map((answer, index) => {
                        const question = questionMap.get(answer.questionId);
                        if (!question) return null;

                        const Icon = getQuestionTypeIcon(question.type);

                        return (
                            <div key={index} className="bg-white rounded-lg p-4 border border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Icon size={16} className="text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-700 mb-2">
                                            {question.text}
                                        </p>
                                        <div className="text-slate-900">
                                            {Array.isArray(answer.value) ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {answer.value.map((v, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                                                        >
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm">{answer.value || '-'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- Question Stats Card ---

interface QuestionStatsCardProps {
    questionId: string;
    questionText: string;
    distribution: Record<string, number>;
    totalResponses: number;
}

const QuestionStatsCard: React.FC<QuestionStatsCardProps> = ({
    questionText,
    distribution,
    totalResponses
}) => {
    const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const maxCount = Math.max(...entries.map(([, count]) => count));

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-4">{questionText}</h4>
            <div className="space-y-3">
                {entries.map(([option, count]) => {
                    const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                    const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

                    return (
                        <div key={option}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-700 font-medium truncate max-w-[70%]">
                                    {option}
                                </span>
                                <span className="text-slate-500">
                                    {count} ({percentage.toFixed(0)}%)
                                </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Component ---

// --- Main Component ---

const QuizResponses: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [responses, setResponses] = useState<QuizResponse[]>([]);
    const [stats, setStats] = useState<QuizStatsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'responses' | 'analytics'>('responses');

    // Fetch data on mount
    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (quizId: string) => {
        try {
            setIsLoading(true);
            const [quizData, responsesData, statsData] = await Promise.all([
                quizService.getQuizById(quizId),
                quizService.getQuizResponses(quizId),
                quizService.getQuizStats(quizId)
            ]);
            setQuiz(quizData);
            setResponses(responsesData.responses);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Export responses as CSV
    const handleExport = () => {
        if (!quiz || responses.length === 0) return;

        // Build CSV content
        const headers = ['Tarih', 'Ad Soyad', 'E-posta', 'Sure (sn)', 'Puan (%)', ...quiz.questions.map(q => q.text)];
        const rows = responses.map(response => {
            const row: string[] = [
                new Date(response.submittedAt).toLocaleString('tr-TR'),
                response.respondentName || 'Anonim',
                response.respondentEmail || '-',
                (response.completingTime || 0).toString(),
                (response.score || 0).toFixed(0)
            ];

            quiz.questions.forEach(question => {
                const answer = response.answers.find(a => a.questionId === question.id);
                if (answer) {
                    row.push(Array.isArray(answer.value) ? answer.value.join('; ') : answer.value);
                } else {
                    row.push('');
                }
            });

            return row;
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // Download
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${quiz.title}_yanitlar.csv`;
        link.click();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-slate-500">Quiz bulunamadi</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                    Quizlere Don
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-900">{quiz.title}</h1>
                    <p className="text-sm text-slate-500">Quiz Yanıtları</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={responses.length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                >
                    <Download size={16} />
                    CSV Indir
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Toplam Yanit"
                    value={responses.length}
                    icon={Users}
                    color="bg-indigo-100 text-indigo-600"
                />
                <StatCard
                    label="Soru Sayisi"
                    value={quiz.questions.length}
                    icon={BarChart3}
                    color="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                    label="Son Yanit"
                    value={responses.length > 0
                        ? new Date(responses[0].submittedAt).toLocaleDateString('tr-TR')
                        : '-'}
                    icon={Calendar}
                    color="bg-purple-100 text-purple-600"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-4">
                <button
                    onClick={() => setActiveTab('responses')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === 'responses'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Eye size={16} />
                    Yanitlar ({responses.length})
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === 'analytics'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <BarChart3 size={16} />
                    Analiz
                </button>
            </div>

            {/* Content */}
            {activeTab === 'responses' ? (
                <div className="space-y-4">
                    {responses.length === 0 ? (
                        <Card className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Henuz yanit yok
                            </h3>
                            <p className="text-sm text-slate-500">
                                Quiziniz yayınlandıktan sonra yanıtlar burada görünecektir.
                            </p>
                        </Card>
                    ) : (
                        responses.map(response => (
                            <ResponseCard
                                key={response.id}
                                response={response}
                                quiz={quiz}
                                isExpanded={expandedResponse === response.id}
                                onToggle={() => setExpandedResponse(
                                    expandedResponse === response.id ? null : response.id
                                )}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {stats?.questionStats.map(qs => (
                        <QuestionStatsCard
                            key={qs.questionId}
                            questionId={qs.questionId}
                            questionText={qs.questionText}
                            distribution={qs.answerDistribution}
                            totalResponses={stats.totalResponses}
                        />
                    ))}

                    {(!stats || stats.questionStats.length === 0) && (
                        <Card className="col-span-full p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Analiz verisi yok
                            </h3>
                            <p className="text-sm text-slate-500">
                                Yanit toplandikca istatistikler burada gorunecektir.
                            </p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizResponses;

