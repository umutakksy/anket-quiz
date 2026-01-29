// ============================================================================
// QUIZ LIST PAGE
// ============================================================================
// Displays all quizzes for the current user with CRUD operations.
// Entry point for quiz management in the admin panel.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/FormElements';
import { PageHeader } from '../components/PageHeader';
import {
    ClipboardList,
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    ExternalLink,
    BarChart3,
    FileText,
    Send,
    MoreVertical,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import { quizService } from '../services/quizService';
import { authService } from '../services/authService';
import type { Quiz, QuizStatus } from '../types/quiz';

// --- Status Badge Component ---

const StatusBadge: React.FC<{ status: QuizStatus }> = ({ status }) => {
    const config = {
        DRAFT: { label: 'Taslak', icon: FileText, className: 'bg-slate-100 text-slate-700 border-slate-200' },
        PUBLISHED: { label: 'Yayında', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        CLOSED: { label: 'Kapalı', icon: XCircle, className: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    const { label, icon: Icon, className } = config[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${className}`}>
            <Icon size={12} /> {label}
        </span>
    );
};

interface QuizCardProps {
    quiz: Quiz;
    onEdit: () => void;
    onDelete: () => void;
    onViewResponses: () => void;
    onPublish: () => void;
    onCloseQuiz: () => void;
    onCopyLink: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onEdit, onDelete, onViewResponses, onPublish, onCloseQuiz, onCopyLink }) => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={quiz.status} />
                            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Calendar size={12} /> {new Date(quiz.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                        {quiz.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{quiz.description}</p>}
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-20 animate-fadeIn origin-top-right">
                                    <button onClick={() => { onEdit(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><Edit3 size={16} className="text-slate-400" /> Düzenle</button>
                                    {quiz.status === 'PUBLISHED' && <button onClick={() => { onCopyLink(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><ExternalLink size={16} className="text-slate-400" /> Linki Kopyala</button>}
                                    <button onClick={() => { onViewResponses(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><BarChart3 size={16} className="text-slate-400" /> Yanıtları Gör</button>
                                    {quiz.status === 'PUBLISHED' && <button onClick={() => { onCloseQuiz(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"><XCircle size={16} /> Quizi Kapat</button>}
                                    <hr className="my-2 border-slate-100" />
                                    <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={16} /> Sil</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm font-medium">
                    <span className="flex items-center gap-2 text-slate-600"><ClipboardList size={16} className="text-slate-400" /> {quiz.questions.length} Soru</span>
                    {quiz.status === 'PUBLISHED' && <span className="flex items-center gap-2 text-slate-600"><Clock size={16} className="text-slate-400" /> {new Date(quiz.publishedAt!).toLocaleDateString('tr-TR')}</span>}
                </div>
                <div className="flex items-center gap-2">
                    {quiz.status === 'DRAFT' && <button onClick={onPublish} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"><Send size={14} /> Yayınla</button>}
                    {quiz.status === 'PUBLISHED' && <button onClick={onViewResponses} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 hover:bg-indigo-50 rounded-xl transition-all"><Eye size={14} /> Yanıtlar</button>}
                    {quiz.status === 'PUBLISHED' && <button onClick={onCloseQuiz} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-white border border-rose-100 hover:bg-rose-50 rounded-xl transition-all" title="Quizi Kapat"><XCircle size={14} /> Kapat</button>}
                </div>
            </div>
        </div>
    );
};

interface CreateQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string, anonymous: boolean) => void;
    isLoading: boolean;
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({ isOpen, onClose, onCreate, isLoading }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) return setError('Quiz başlığı zorunludur.');
        onCreate(title, description, anonymous);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
                <div className="p-8 bg-indigo-600 text-white">
                    <h2 className="text-2xl font-bold">Yeni Quiz Oluştur</h2>
                    <p className="text-indigo-100 mt-1 opacity-80">Quizi oluşturduktan sonra soruları ekleyebilirsiniz.</p>
                </div>
                <div className="p-8 space-y-6">
                    <Input label="Quiz Başlığı" placeholder="Örn: Python Giriş Seviyesi" value={title} onChange={(e) => { setTitle(e.target.value); setError(''); }} error={error} required />
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Açıklama (Opsiyonel)</label>
                        <textarea className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl border hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:outline-none transition-all font-medium text-sm p-4 min-h-[100px] resize-none" placeholder="Quiz hakkında kısa bir açıklama..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer group transition-colors hover:bg-indigo-50/50">
                        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-5 h-5 text-indigo-600 border-slate-300 rounded-lg focus:ring-indigo-500" />
                        <span className="text-sm font-bold text-slate-700 select-none">Anonim Quiz (İsim sormadan)</span>
                    </label>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors" disabled={isLoading}>İptal</button>
                    <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50">
                        {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={18} />} Oluştur
                    </button>
                </div>
            </div>
        </div>
    );
};



// --- Main Component ---

// --- Main Component ---

const QuizList: React.FC = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => { fetchQuizzes(); }, []);

    const fetchQuizzes = async () => {
        try {
            setIsLoading(true);
            const userDept = authService.getUserDepartment();
            const response = await quizService.getQuizzes(1, 100, undefined, userDept);
            setQuizzes(response.quizzes);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredQuizzes = quizzes.filter(q => {
        const match = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return match && (statusFilter === 'all' || q.status === statusFilter);
    });

    const handleCreateQuiz = async (title: string, description: string, anonymous: boolean) => {
        try {
            setIsCreating(true);
            const newQuiz = await quizService.createQuiz({
                title, description, anonymous, creatorDepartment: authService.getUserDepartment()
            });
            setShowCreateModal(false);
            navigate(`/quiz/${newQuiz.id}/duzenle`);
        } catch (error) {
            console.error('Failed to create quiz:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (confirm('Bu quizi silmek istediginizden emin misiniz?')) {
            try {
                await quizService.deleteQuiz(id);
                setQuizzes(prev => prev.filter(q => q.id !== id));
            } catch (error) { console.error('Delete failed:', error); }
        }
    };

    const handlePublishQuiz = async (quiz: Quiz) => {
        if (!quiz.questions.length) return alert('Yayinlamak icin en az bir soru eklemelisiniz.');
        try {
            const result = await quizService.publishQuiz(quiz.id);
            setQuizzes(prev => prev.map(q => q.id === quiz.id ? result.quiz : q));
            navigator.clipboard.writeText(result.publicUrl);
            alert('Quiz yayinlandi! Link kopyalandi.');
        } catch (error) { console.error('Publish failed:', error); }
    };

    const handleCloseQuiz = async (id: string) => {
        if (confirm('Bu quizi kapatmak istediginizden emin misiniz?')) {
            try {
                const updated = await quizService.closeQuiz(id);
                setQuizzes(prev => prev.map(q => q.id === id ? updated : q));
            } catch (error) { console.error('Close failed:', error); }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title="Quizler"
                description="Quizlerinizi yönetin ve sonuçları analiz edin"
                actions={
                    <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                        <Plus size={18} /> Yeni Quiz
                    </button>
                }
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-sm">
                    <Input placeholder="Quiz ara..." icon={Search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    {['all', 'DRAFT', 'PUBLISHED', 'CLOSED'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${statusFilter === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>
                            {s === 'all' ? 'Tümü' : s === 'DRAFT' ? 'Taslak' : s === 'PUBLISHED' ? 'Yayında' : 'Kapalı'}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" /></div>
            ) : filteredQuizzes.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2">
                    <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">{searchQuery || statusFilter !== 'all' ? 'Quiz bulunamadı' : 'Henüz quiz yok'}</h3>
                    <p className="text-sm text-slate-500 mt-2 mb-6">{searchQuery ? 'Arama kriterlerinizi değiştirin.' : 'İlk quizinizi oluşturarak başlayın.'}</p>
                    {!searchQuery && <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl">Yeni Quiz Oluştur</button>}
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredQuizzes.map(q => (
                        <QuizCard
                            key={q.id}
                            quiz={q}
                            onEdit={() => navigate(`/quiz/${q.id}/duzenle`)}
                            onDelete={() => handleDeleteQuiz(q.id)}
                            onViewResponses={() => navigate(`/quiz/${q.id}/yanitlar`)}
                            onPublish={() => handlePublishQuiz(q)}
                            onCloseQuiz={() => handleCloseQuiz(q.id)}
                            onCopyLink={() => { navigator.clipboard.writeText(`${window.location.origin}/quiz/${q.slug}`); alert('Kopyalandı!'); }}
                        />
                    ))}
                </div>
            )}

            <CreateQuizModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreateQuiz} isLoading={isCreating} />
        </div>
    );
};


export default QuizList;

