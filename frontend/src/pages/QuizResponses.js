import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// QUIZ RESPONSES PAGE
// ============================================================================
// Displays all responses for a quiz with basic analytics.
// Shows individual responses and aggregate statistics.
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card.js';
import { ArrowLeft, BarChart3, Users, Calendar, Download, Eye, ChevronDown, ChevronUp, Type, List, CheckSquare, Clock } from 'lucide-react';
import { quizService } from '../services/quizService.js';
// --- Question Type Icon ---
const getQuestionTypeIcon = (type) => {
    switch (type) {
        case 'TEXT': return Type;
        case 'SINGLE_CHOICE': return List;
        case 'MULTIPLE_CHOICE': return CheckSquare;
        default: return Type;
    }
};
const StatCard = ({ label, value, icon: Icon, color }) => (_jsx("div", { className: "bg-white rounded-xl border border-slate-200 p-5 shadow-sm", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `p-3 rounded-xl ${color}`, children: _jsx(Icon, { size: 22 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-500 font-medium", children: label }), _jsx("p", { className: "text-2xl font-bold text-slate-900", children: value })] })] }) }));
const ResponseCard = ({ response, quiz, isExpanded, onToggle }) => {
    // Create a map of question ID to question for easy lookup
    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", children: [_jsxs("button", { onClick: onToggle, className: "w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm", children: (response.respondentName || response.respondentEmail)?.[0]?.toUpperCase() || '#' }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-slate-900", children: response.respondentName || response.respondentEmail || 'Anonim Katilimci' }), response.respondentName && response.respondentEmail && (_jsx("p", { className: "text-xs text-slate-400 font-medium -mt-0.5", children: response.respondentEmail })), _jsxs("p", { className: "text-sm text-slate-500 flex items-center gap-1.5 mt-0.5", children: [_jsx(Clock, { size: 12 }), new Date(response.submittedAt).toLocaleString('tr-TR')] })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "hidden sm:flex items-center gap-4", children: [quiz.type === 'QUIZ' && response.score !== undefined && (_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[10px] font-black text-indigo-400 uppercase tracking-widest", children: "Puan" }), _jsxs("p", { className: "text-sm font-bold text-indigo-600", children: ["%", response.score.toFixed(0)] })] })), response.completingTime !== undefined && (_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "S\u00FCre" }), _jsxs("p", { className: "text-sm font-bold text-slate-600", children: [Math.floor(response.completingTime / 60), ":", (response.completingTime % 60).toString().padStart(2, '0')] })] }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-sm text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg", children: [response.answers.length, " yanit"] }), isExpanded ? (_jsx(ChevronUp, { size: 20, className: "text-slate-400" })) : (_jsx(ChevronDown, { size: 20, className: "text-slate-400" }))] })] })] }), isExpanded && (_jsx("div", { className: "border-t border-slate-100 p-5 space-y-4 bg-slate-50/50 animate-fadeIn", children: response.answers.map((answer, index) => {
                    const question = questionMap.get(answer.questionId);
                    if (!question)
                        return null;
                    const Icon = getQuestionTypeIcon(question.type);
                    return (_jsx("div", { className: "bg-white rounded-lg p-4 border border-slate-100", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: _jsx(Icon, { size: 16, className: "text-slate-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-slate-700 mb-2", children: question.text }), _jsx("div", { className: "text-slate-900", children: Array.isArray(answer.value) ? (_jsx("div", { className: "flex flex-wrap gap-2", children: answer.value.map((v, i) => (_jsx("span", { className: "px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium", children: v }, i))) })) : (_jsx("p", { className: "text-sm", children: answer.value || '-' })) })] })] }) }, index));
                }) }))] }));
};
const QuestionStatsCard = ({ questionText, distribution, totalResponses }) => {
    const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const maxCount = Math.max(...entries.map(([, count]) => count));
    return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-5 shadow-sm", children: [_jsx("h4", { className: "font-semibold text-slate-900 mb-4", children: questionText }), _jsx("div", { className: "space-y-3", children: entries.map(([option, count]) => {
                    const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
                    const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [_jsx("span", { className: "text-slate-700 font-medium truncate max-w-[70%]", children: option }), _jsxs("span", { className: "text-slate-500", children: [count, " (", percentage.toFixed(0), "%)"] })] }), _jsx("div", { className: "h-2 bg-slate-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500", style: { width: `${barWidth}%` } }) })] }, option));
                }) })] }));
};
// --- Main Component ---
// --- Main Component ---
const QuizResponses = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [responses, setResponses] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedResponse, setExpandedResponse] = useState(null);
    const [activeTab, setActiveTab] = useState('responses');
    // Fetch data on mount
    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);
    const fetchData = async (quizId) => {
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
        }
        catch (error) {
            console.error('Failed to fetch data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const averageScore = responses.length > 0 && quiz?.type === 'QUIZ'
        ? responses.reduce((acc, curr) => acc + (curr.score || 0), 0) / responses.length
        : null;
    // Export responses as CSV
    const handleExport = () => {
        if (!quiz || responses.length === 0)
            return;
        // Build CSV content
        const headers = ['Tarih', 'Ad Soyad', 'E-posta', 'Sure (sn)', 'Puan (%)', ...quiz.questions.map(q => q.text)];
        const rows = responses.map(response => {
            const row = [
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
                }
                else {
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
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" }) }));
    }
    if (!quiz) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen", children: [_jsx("p", { className: "text-slate-500", children: "I\u00E7erik bulunamad\u0131" }), _jsx("button", { onClick: () => navigate('/'), className: "mt-4 text-indigo-600 hover:text-indigo-800 font-semibold", children: "Ana Sayfaya D\u00F6n" })] }));
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("button", { onClick: () => navigate('/'), className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-xl font-bold text-slate-900", children: quiz.title }), _jsx("p", { className: "text-sm text-slate-500", children: quiz.type === 'QUIZ' ? 'Quiz Yanıtları' : 'Anket Yanıtları' })] }), _jsxs("button", { onClick: handleExport, disabled: responses.length === 0, className: "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50", children: [_jsx(Download, { size: 16 }), "CSV Indir"] })] }), _jsxs("div", { className: `grid grid-cols-1 ${quiz.type === 'QUIZ' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`, children: [_jsx(StatCard, { label: "Toplam Yanit", value: responses.length, icon: Users, color: "bg-indigo-100 text-indigo-600" }), quiz.type === 'QUIZ' && averageScore !== null && (_jsx(StatCard, { label: "Ortalama Puan", value: `%${averageScore.toFixed(0)}`, icon: BarChart3, color: "bg-amber-100 text-amber-600" })), _jsx(StatCard, { label: "Soru Sayisi", value: quiz.questions.length, icon: BarChart3, color: "bg-emerald-100 text-emerald-600" }), _jsx(StatCard, { label: "Son Yanit", value: responses.length > 0 && responses[0]
                            ? new Date(responses[0].submittedAt).toLocaleDateString('tr-TR')
                            : '-', icon: Calendar, color: "bg-purple-100 text-purple-600" })] }), _jsxs("div", { className: "flex gap-2 border-b border-slate-200 pb-4", children: [_jsxs("button", { onClick: () => setActiveTab('responses'), className: `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === 'responses'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: [_jsx(Eye, { size: 16 }), "Yanitlar (", responses.length, ")"] }), _jsxs("button", { onClick: () => setActiveTab('analytics'), className: `flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${activeTab === 'analytics'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: [_jsx(BarChart3, { size: 16 }), "Analiz"] })] }), activeTab === 'responses' ? (_jsx("div", { className: "space-y-4", children: responses.length === 0 ? (_jsxs(Card, { className: "p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Users, { size: 32, className: "text-slate-400" }) }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: "Henuz yanit yok" }), _jsxs("p", { className: "text-sm text-slate-500", children: [quiz.type === 'QUIZ' ? 'Quiziniz' : 'Anketiniz', " yay\u0131nland\u0131ktan sonra yan\u0131tlar burada g\u00F6r\u00FCnecektir."] })] })) : (responses.map(response => (_jsx(ResponseCard, { response: response, quiz: quiz, isExpanded: expandedResponse === response.id, onToggle: () => setExpandedResponse(expandedResponse === response.id ? null : response.id) }, response.id)))) })) : (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [stats?.questionStats.map(qs => (_jsx(QuestionStatsCard, { questionId: qs.questionId, questionText: qs.questionText, distribution: qs.answerDistribution, totalResponses: stats.totalResponses }, qs.questionId))), (!stats || stats.questionStats.length === 0) && (_jsxs(Card, { className: "col-span-full p-12 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(BarChart3, { size: 32, className: "text-slate-400" }) }), _jsx("h3", { className: "text-lg font-bold text-slate-900 mb-2", children: "Analiz verisi yok" }), _jsx("p", { className: "text-sm text-slate-500", children: "Yanit toplandikca istatistikler burada gorunecektir." })] }))] }))] }));
};
export default QuizResponses;
//# sourceMappingURL=QuizResponses.js.map