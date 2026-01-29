import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// QUIZ LIST PAGE
// ============================================================================
// Displays all quizzes for the current user with CRUD operations.
// Entry point for quiz management in the admin panel.
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card.js';
import { Input } from '../components/FormElements.js';
import { PageHeader } from '../components/PageHeader.js';
import { ClipboardList, Plus, Search, Edit3, Trash2, Eye, ExternalLink, BarChart3, FileText, Send, MoreVertical, Calendar, CheckCircle2, Clock, XCircle, ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { quizService } from '../services/quizService.js';
import { authService } from '../services/authService.js';
// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const config = {
        DRAFT: { label: 'Taslak', icon: FileText, className: 'bg-slate-100 text-slate-700 border-slate-200' },
        PUBLISHED: { label: 'Yayında', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        CLOSED: { label: 'Kapalı', icon: XCircle, className: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    const { label, icon: Icon, className } = config[status];
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${className}`, children: [_jsx(Icon, { size: 12 }), " ", label] }));
};
const QuizCard = ({ quiz, onEdit, onDelete, onViewResponses, onPublish, onCloseQuiz, onCopyLink }) => {
    const [showMenu, setShowMenu] = useState(false);
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group", children: [_jsx("div", { className: "p-6 border-b border-slate-100", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(StatusBadge, { status: quiz.status }), _jsxs("span", { className: "text-xs text-slate-400 flex items-center gap-1 font-medium", children: [_jsx(Calendar, { size: 12 }), " ", new Date(quiz.createdAt).toLocaleDateString('tr-TR')] })] }), _jsx("h3", { className: "text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors", children: quiz.title }), quiz.description && _jsx("p", { className: "text-sm text-slate-500 mt-1 line-clamp-2", children: quiz.description }), _jsx("div", { className: "mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400", children: quiz.type === 'QUIZ' ? 'QUIZ' : 'ANKET' })] }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors", children: _jsx(MoreVertical, { size: 18 }) }), showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowMenu(false) }), _jsxs("div", { className: "absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 animate-fadeIn origin-top-right", children: [_jsxs("button", { onClick: () => { onEdit(); setShowMenu(false); }, className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors", children: [_jsx(Edit3, { size: 16, className: "text-slate-400" }), " D\u00FCzenle"] }), quiz.status === 'PUBLISHED' && _jsxs("button", { onClick: () => { onCopyLink(); setShowMenu(false); }, className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors", children: [_jsx(ExternalLink, { size: 16, className: "text-slate-400" }), " Linki Kopyala"] }), _jsxs("button", { onClick: () => { onViewResponses(); setShowMenu(false); }, className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors", children: [_jsx(BarChart3, { size: 16, className: "text-slate-400" }), " Yan\u0131tlar\u0131 G\u00F6r"] }), quiz.status === 'PUBLISHED' && _jsxs("button", { onClick: () => { onCloseQuiz(); setShowMenu(false); }, className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors", children: [_jsx(XCircle, { size: 16 }), " ", quiz.type === 'QUIZ' ? 'Quizi' : 'Anketi', " Kapat"] }), _jsx("hr", { className: "my-2 border-slate-100" }), _jsxs("button", { onClick: () => { onDelete(); setShowMenu(false); }, className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors", children: [_jsx(Trash2, { size: 16 }), " Sil"] })] })] }))] })] }) }), _jsxs("div", { className: "px-6 py-4 bg-slate-50/50 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-6 text-sm font-medium", children: [_jsxs("span", { className: "flex items-center gap-2 text-slate-600", children: [_jsx(ClipboardList, { size: 16, className: "text-slate-400" }), " ", quiz.questions.length, " Soru"] }), quiz.status === 'PUBLISHED' && quiz.publishedAt && _jsxs("span", { className: "flex items-center gap-2 text-slate-600", children: [_jsx(Clock, { size: 16, className: "text-slate-400" }), " ", new Date(quiz.publishedAt).toLocaleDateString('tr-TR')] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [quiz.status === 'DRAFT' && _jsxs("button", { onClick: onPublish, className: "flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95", children: [_jsx(Send, { size: 14 }), " Yay\u0131nla"] }), quiz.status === 'PUBLISHED' && _jsxs("button", { onClick: onViewResponses, className: "flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all", children: [_jsx(Eye, { size: 14 }), " Yan\u0131tlar"] }), quiz.status === 'PUBLISHED' && _jsxs("button", { onClick: onCloseQuiz, className: "flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-white border border-rose-100 hover:bg-rose-50 rounded-xl transition-all", title: quiz.type === 'QUIZ' ? 'Quizi Kapat' : 'Anketi Kapat', children: [_jsx(XCircle, { size: 14 }), " Kapat"] })] })] })] }));
};
const CreateQuizModal = ({ isOpen, onClose, onCreate, isLoading }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('QUIZ');
    const [anonymous, setAnonymous] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = () => {
        if (!title.trim())
            return setError('Başlık zorunludur.');
        onCreate(title, description, anonymous, type);
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn", children: [_jsxs("div", { className: "p-8 bg-indigo-600 text-white", children: [_jsxs("h2", { className: "text-2xl font-bold", children: ["Yeni ", type === 'QUIZ' ? 'Quiz' : 'Anket', " Olu\u015Ftur"] }), _jsx("p", { className: "text-indigo-100 mt-1 opacity-80", children: type === 'QUIZ'
                                    ? 'Bilgi ölçmek için puanlı ve süreli bir quiz oluşturun.'
                                    : 'Geribildirim toplamak için normal bir anket oluşturun.' })] }), _jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex p-1 bg-slate-100 rounded-2xl", children: [_jsx("button", { onClick: () => setType('QUIZ'), className: `flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${type === 'QUIZ' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`, children: "Quiz" }), _jsx("button", { onClick: () => setType('SURVEY'), className: `flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${type === 'SURVEY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`, children: "Anket" })] }), _jsx(Input, { label: `${type === 'QUIZ' ? 'Quiz' : 'Anket'} Başlığı`, placeholder: type === 'QUIZ' ? 'Örn: Python Giriş Seviyesi' : 'Örn: Çalışan Memnuniyet Anketi', value: title, onChange: (e) => { setTitle(e.target.value); setError(''); }, error: error, required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold text-slate-700 mb-2 ml-1", children: "A\u00E7\u0131klama (Opsiyonel)" }), _jsx("textarea", { className: "w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl border hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:outline-none transition-all font-medium text-sm p-4 min-h-[100px] resize-none", placeholder: "K\u0131sa bir a\u00E7\u0131klama...", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("label", { className: "flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group transition-colors hover:bg-indigo-50/50", children: [_jsx("input", { type: "checkbox", checked: anonymous, onChange: (e) => setAnonymous(e.target.checked), className: "w-5 h-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500" }), _jsx("span", { className: "text-sm font-bold text-slate-700 select-none", children: "Anonim (\u0130sim sormadan)" })] })] }), _jsxs("div", { className: "p-8 bg-slate-50 border-t border-slate-100 flex gap-3", children: [_jsx("button", { onClick: onClose, className: "flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors", disabled: isLoading, children: "\u0130ptal" }), _jsxs("button", { onClick: handleSubmit, disabled: isLoading, className: "flex-[2] flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50", children: [isLoading ? _jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : _jsx(Plus, { size: 18 }), " Olu\u015Ftur"] })] })] })] }));
};
// --- Main Component ---
const QuizList = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    useEffect(() => { fetchQuizzes(); }, []);
    const fetchQuizzes = async () => {
        try {
            setIsLoading(true);
            const userDept = authService.getUserDepartment();
            const response = await quizService.getQuizzes(1, 100, undefined, userDept);
            setQuizzes(response.quizzes);
        }
        catch (error) {
            console.error('Failed to fetch quizzes:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const filteredQuizzes = quizzes
        .filter((q) => {
        const match = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMatch = statusFilter === 'all' || q.status === statusFilter;
        const typeMatch = typeFilter === 'all' || q.type === typeFilter;
        return match && statusMatch && typeMatch;
    })
        .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'title') {
            comparison = a.title.localeCompare(b.title);
        }
        else {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });
    const handleCreateQuiz = async (title, description, anonymous, type) => {
        try {
            setIsCreating(true);
            const newQuiz = await quizService.createQuiz({
                title, description, anonymous, type, creatorDepartment: authService.getUserDepartment()
            });
            setShowCreateModal(false);
            navigate(`/quiz/${newQuiz.id}/duzenle`);
        }
        catch (error) {
            console.error('Failed to create quiz:', error);
        }
        finally {
            setIsCreating(false);
        }
    };
    const handleDeleteQuiz = async (id) => {
        if (confirm('Bu quizi silmek istediginizden emin misiniz?')) {
            try {
                await quizService.deleteQuiz(id);
                setQuizzes((prev) => prev.filter((q) => q.id !== id));
            }
            catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };
    const handlePublishQuiz = async (quiz) => {
        if (!quiz.questions.length)
            return alert('Yayinlamak icin en az bir soru eklemelisiniz.');
        try {
            const result = await quizService.publishQuiz(quiz.id);
            setQuizzes((prev) => prev.map((q) => q.id === quiz.id ? result.quiz : q));
            navigator.clipboard.writeText(result.publicUrl);
            alert('Quiz yayinlandi! Link kopyalandi.');
        }
        catch (error) {
            console.error('Publish failed:', error);
        }
    };
    const handleCloseQuiz = async (id) => {
        if (confirm('Bu quizi kapatmak istediginizden emin misiniz?')) {
            try {
                const updated = await quizService.closeQuiz(id);
                setQuizzes((prev) => prev.map((q) => q.id === id ? updated : q));
            }
            catch (error) {
                console.error('Close failed:', error);
            }
        }
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx(PageHeader, { title: "Anket & Quizler", description: "Anket ve quizlerinizi y\u00F6netin ve sonu\u00E7lar\u0131 analiz edin", actions: _jsxs("button", { onClick: () => setShowCreateModal(true), className: "flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95", children: [_jsx(Plus, { size: 18 }), " Yeni"] }) }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start lg:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative z-20", children: [_jsxs("div", { className: "flex-1 max-w-sm w-full relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400", size: 18 }), _jsx("input", { placeholder: "Ara...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl border-2 transition-all outline-none text-sm font-medium" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 w-full lg:w-auto", children: [_jsx("div", { className: "flex bg-slate-100 p-1 rounded-xl", children: ['all', 'QUIZ', 'SURVEY'].map(t => (_jsx("button", { onClick: () => setTypeFilter(t), className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${typeFilter === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`, children: t === 'all' ? 'Tümü' : t === 'QUIZ' ? 'Quiz' : 'Anket' }, t))) }), _jsx("div", { className: "flex bg-slate-100 p-1 rounded-xl", children: ['all', 'DRAFT', 'PUBLISHED', 'CLOSED'].map(s => (_jsx("button", { onClick: () => setStatusFilter(s), className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`, children: s === 'all' ? 'Tümü' : s === 'DRAFT' ? 'Taslak' : s === 'PUBLISHED' ? 'Yayında' : 'Kapalı' }, s))) }), _jsxs("div", { className: "relative ml-auto lg:ml-0", children: [_jsxs("button", { onClick: () => setShowSortMenu(!showSortMenu), className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all", children: [_jsx(ArrowUpDown, { size: 16, className: "text-slate-400" }), "S\u0131rala", _jsx(ChevronDown, { size: 14, className: `text-slate-400 transition-transform ${showSortMenu ? 'rotate-180' : ''}` })] }), showSortMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowSortMenu(false) }), _jsxs("div", { className: "absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 animate-fadeIn", children: [_jsx("div", { className: "px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "\u00D6l\u00E7\u00FCt" }), _jsxs("button", { onClick: () => { setSortBy('createdAt'); setShowSortMenu(false); }, className: `w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-slate-50 ${sortBy === 'createdAt' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`, children: ["Tarih ", sortBy === 'createdAt' && _jsx(Check, { size: 14 })] }), _jsxs("button", { onClick: () => { setSortBy('title'); setShowSortMenu(false); }, className: `w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-slate-50 ${sortBy === 'title' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`, children: ["\u0130sim ", sortBy === 'title' && _jsx(Check, { size: 14 })] }), _jsx("hr", { className: "my-2 border-slate-100" }), _jsx("div", { className: "px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest", children: "D\u00FCzen" }), _jsxs("button", { onClick: () => { setSortOrder('desc'); setShowSortMenu(false); }, className: `w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-slate-50 ${sortOrder === 'desc' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`, children: ["Yeniden Eskiye ", sortOrder === 'desc' && _jsx(Check, { size: 14 })] }), _jsxs("button", { onClick: () => { setSortOrder('asc'); setShowSortMenu(false); }, className: `w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-slate-50 ${sortOrder === 'asc' ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`, children: ["Eskiden Yeniye ", sortOrder === 'asc' && _jsx(Check, { size: 14 })] })] })] }))] })] })] }), isLoading ? (_jsx("div", { className: "flex justify-center py-20", children: _jsx("div", { className: "w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" }) })) : filteredQuizzes.length === 0 ? (_jsxs(Card, { className: "p-12 text-center border-dashed border-2", children: [_jsx(ClipboardList, { size: 40, className: "text-slate-300 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-bold text-slate-900", children: searchQuery || statusFilter !== 'all' ? 'Quiz bulunamadı' : 'Henüz quiz yok' }), _jsx("p", { className: "text-sm text-slate-500 mt-2 mb-6", children: searchQuery ? 'Arama kriterlerinizi değiştirin.' : 'İlk quizinizi oluşturarak başlayın.' }), !searchQuery && _jsx("button", { onClick: () => setShowCreateModal(true), className: "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl", children: "Quiz Olu\u015Ftur" })] })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredQuizzes.map(q => (_jsx(QuizCard, { quiz: q, onEdit: () => navigate(`/quiz/${q.id}/duzenle`), onDelete: () => handleDeleteQuiz(q.id), onViewResponses: () => navigate(`/quiz/${q.id}/yanitlar`), onPublish: () => handlePublishQuiz(q), onCloseQuiz: () => handleCloseQuiz(q.id), onCopyLink: () => { navigator.clipboard.writeText(`${window.location.origin}/quiz/${q.slug}`); alert('Kopyalandı!'); } }, q.id))) })), _jsx(CreateQuizModal, { isOpen: showCreateModal, onClose: () => setShowCreateModal(false), onCreate: handleCreateQuiz, isLoading: isCreating })] }));
};
export default QuizList;
//# sourceMappingURL=QuizList.js.map