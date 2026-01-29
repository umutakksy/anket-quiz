// ============================================================================
// QUIZ DESIGNER PAGE
// ============================================================================
// Full-featured quiz editor with question management.
// Allows adding, editing, deleting, and reordering questions.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/FormElements';
import { QuizForm, validateQuizAnswers } from '../components/quiz';
import {
    ArrowLeft,
    Save,
    Send,
    Plus,
    Edit3,
    Trash2,
    GripVertical,
    Eye,
    Settings,
    Type,
    List,
    CheckSquare,
    AlertCircle,
    CheckCircle2,
    ExternalLink,
    BarChart3
} from 'lucide-react';
import { quizService } from '../services/quizService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Quiz, QuizQuestion, QuestionType } from '../types/quiz';
import { QuestionEditor } from '../components/quiz';

// --- Question Type Icon Helper ---

const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
        case 'TEXT': return Type;
        case 'SINGLE_CHOICE': return List;
        case 'MULTIPLE_CHOICE': return CheckSquare;
        default: return Type;
    }
};

const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
        case 'TEXT': return 'Metin';
        case 'SINGLE_CHOICE': return 'Tekli Secim';
        case 'MULTIPLE_CHOICE': return 'Coklu Secim';
        default: return type;
    }
};

// --- Question Card Component ---

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    onEdit,
    onDelete,
    dragHandleProps
}) => {
    const Icon = getQuestionTypeIcon(question.type);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start gap-4 p-5">
                {/* Drag Handle */}
                <div
                    {...dragHandleProps}
                    className="text-slate-300 cursor-grab hover:text-slate-400 mt-1 active:cursor-grabbing"
                    title="Siralamak icin surukleyin"
                >
                    <GripVertical size={20} />
                </div>

                {/* Question Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                    {index + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            <Icon size={12} />
                            {getQuestionTypeLabel(question.type)}
                        </span>
                        {question.required && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium">
                                Zorunlu
                            </span>
                        )}
                    </div>
                    <p className="text-slate-900 font-medium leading-relaxed">
                        {question.text}
                    </p>

                    {/* Options Preview */}
                    {question.options && question.options.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {question.options.slice(0, 3).map((opt, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-sm border border-slate-100">
                                    {opt}
                                </span>
                            ))}
                            {question.options.length > 3 && (
                                <span className="px-3 py-1 text-slate-400 text-sm">
                                    +{question.options.length - 3} daha
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Duzenle"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const QuizDesigner: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [timeLimit, setTimeLimit] = useState(0);

    useEffect(() => { if (id) fetchQuiz(id); }, [id]);

    const fetchQuiz = async (quizId: string) => {
        try {
            setIsLoading(true);
            const data = await quizService.getQuizById(quizId);
            setQuiz(data);
            setTitle(data.title);
            setDescription(data.description || '');
            setSlug(data.slug || '');
            setAnonymous(data.anonymous || false);
            setTimeLimit(data.timeLimit || 0);
        } catch (error) { console.error('Fetch failed:', error); }
        finally { setIsLoading(false); }
    };

    const handleUpdateQuizLocally = (updates: Partial<Quiz>) => setQuiz(prev => prev ? { ...prev, ...updates } : null);

    const handleSaveDetails = async () => {
        if (!quiz || !title.trim()) return;
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
        } catch (error) { showSaveMessage('error', 'Kaydetme basarisiz oldu.'); }
        finally { setIsSaving(false); }
    };

    const handleAddQuestion = async (data: any) => {
        if (!quiz) return;
        try {
            const newQuestion = await quizService.addQuestion(quiz.id, { ...data, order: quiz.questions.length + 1 });
            setQuiz(prev => prev ? { ...prev, questions: [...prev.questions, newQuestion] } : null);
            setIsAddingQuestion(false);
            showSaveMessage('success', 'Soru eklendi.');
        } catch (error) { showSaveMessage('error', 'Soru eklenemedi.'); }
    };

    const handleUpdateQuestion = async (data: any) => {
        if (!quiz || !editingQuestion) return;
        try {
            const updated = await quizService.updateQuestion(quiz.id, editingQuestion.id, data);
            setQuiz(prev => prev ? { ...prev, questions: prev.questions.map(q => q.id === editingQuestion.id ? updated : q) } : null);
            setEditingQuestion(null);
            showSaveMessage('success', 'Soru guncellendi.');
        } catch (error) { showSaveMessage('error', 'Soru guncellenemedi.'); }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!quiz || !confirm('Bu soruyu silmek istediginizden emin misiniz?')) return;
        try {
            await quizService.deleteQuestion(quiz.id, questionId);
            setQuiz(prev => prev ? { ...prev, questions: prev.questions.filter(q => q.id !== questionId) } : null);
            showSaveMessage('success', 'Soru silindi.');
        } catch (error) { showSaveMessage('error', 'Soru silinemedi.'); }
    };

    const handlePublish = async () => {
        if (!quiz) return;
        if (!quiz.questions.length) return showSaveMessage('error', 'Yayinlamak icin en az bir soru ekleyin.');
        if (!confirm('Yayına alıyorsunuz, emin misiniz?')) return;

        try {
            setIsPublishing(true);
            // Save current details first to ensure timeLimit etc. are synced
            await handleSaveDetails();

            const result = await quizService.publishQuiz(quiz.id);
            setQuiz(result.quiz);
            navigator.clipboard.writeText(result.publicUrl);
            showSaveMessage('success', 'Quiz yayınlandı! Link kopyalandı.');
        } catch (error) { showSaveMessage('error', 'Yayınlama başarısız.'); }
        finally { setIsPublishing(false); }
    };

    const showSaveMessage = (type: 'success' | 'error', text: string) => {
        setSaveMessage({ type, text });
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination || !quiz) return;
        const items = Array.from(quiz.questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedQuestions = items.map((q, idx) => ({ ...q, order: idx + 1 }));
        setQuiz({ ...quiz, questions: updatedQuestions });
        try {
            await quizService.reorderQuestions(quiz.id, updatedQuestions.map(q => q.id));
            showSaveMessage('success', 'Siralamama kaydedildi.');
        } catch (error) { showSaveMessage('error', 'Siralama kaydedilemedi.'); fetchQuiz(quiz.id); }
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;

    if (!quiz) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertCircle size={48} className="text-slate-400 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Quiz bulunamadı</h2>
            <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold">Geri Dön</button>
        </div>
    );

    const isEditable = quiz.status === 'DRAFT';

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><ArrowLeft size={20} /></button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{quiz.title}</h1>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${quiz.status === 'DRAFT' ? 'bg-slate-400' : quiz.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{quiz.status === 'DRAFT' ? 'Taslak' : quiz.status === 'PUBLISHED' ? 'Yayında' : 'Kapalı'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {saveMessage && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-fadeIn ${saveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                {saveMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {saveMessage.text}
                            </div>
                        )}

                        {isEditable && (
                            <>
                                <button onClick={() => setShowSettings(!showSettings)} className={`p-2.5 rounded-xl transition-all ${showSettings ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}><Settings size={20} /></button>
                                <button onClick={handleSaveDetails} disabled={isSaving} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">{isSaving ? <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" /> : <Save size={18} />} Kaydet</button>
                                <button onClick={handlePublish} disabled={isPublishing || !quiz.questions.length} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"><Send size={18} /> Yayınla</button>
                            </>
                        )}

                        {quiz.status === 'PUBLISHED' && quiz.slug && (
                            <a href={`/quiz/${quiz.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"><ExternalLink size={18} /> Quizi Gör</a>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {showSettings && isEditable && (
                            <Card className="animate-fadeIn border-indigo-100">
                                <div className="p-8 space-y-6">
                                    <h3 className="text-xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-4">Quiz Ayarları</h3>
                                    <Input label="Quiz Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    <Input label="Özel Link (Slug)" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="örn: genel-kultur" helperText="Boş bırakılırsa otomatik üretilir." />
                                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-indigo-50/50 transition-colors">
                                        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                                        <span className="text-sm font-bold text-slate-700">Anonim Quiz (İsim sormadan)</span>
                                    </label>
                                    <Input label="Süre Sınırı (Dakika)" type="number" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)} helperText="0 ise sınırsızdır." />

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Hedef Departmanlar</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Yazılım', 'HR', 'Finans', 'Pazarlama', 'Satış', 'Operasyon'].map(dept => (
                                                <button key={dept} type="button" onClick={() => {
                                                    const current = quiz.targetDepartments || [];
                                                    const updated = current.includes(dept) ? current.filter(d => d !== dept) : [...current, dept];
                                                    handleUpdateQuizLocally({ targetDepartments: updated });
                                                }} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${(quiz.targetDepartments || []).includes(dept) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>{dept}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Açıklama</label>
                                        <textarea className="w-full bg-slate-50 border-slate-200 text-slate-900 rounded-2xl border focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-medium text-sm p-4 min-h-[100px] resize-none" placeholder="Katılımcılara gösterilecek mesaj..." value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                </div>
                            </Card>
                        )}

                        <div className="space-y-4">
                            {quiz.questions.length === 0 ? (
                                <Card className="p-16 text-center border-dashed border-2">
                                    <Type size={48} className="text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900">Henüz soru eklenmemiş</h3>
                                    <p className="text-sm text-slate-500 mt-2 mb-8">Haydi, ilk sorunuzu ekleyerek başlayın!</p>
                                    {isEditable && <button onClick={() => setIsAddingQuestion(true)} className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-lg">Soru Ekle</button>}
                                </Card>
                            ) : (
                                <>
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="questions" isDropDisabled={!isEditable}>
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                                    {quiz.questions.slice().sort((a: any, b: any) => a.order - b.order).map((question, index) => (
                                                        <Draggable key={question.id} draggableId={question.id} index={index} isDragDisabled={!isEditable}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                                                    <QuestionCard question={question} index={index} onEdit={() => isEditable && setEditingQuestion(question)} onDelete={() => isEditable && handleDeleteQuestion(question.id)} dragHandleProps={provided.dragHandleProps} />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                    {isEditable && !isAddingQuestion && !editingQuestion && (
                                        <button onClick={() => setIsAddingQuestion(true)} className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-2xl transition-all font-bold">+ Yeni Soru</button>
                                    )}
                                </>
                            )}

                            {(isAddingQuestion || editingQuestion) && isEditable && (
                                <QuestionEditor question={editingQuestion || undefined} isNew={isAddingQuestion} onSave={editingQuestion ? handleUpdateQuestion : handleAddQuestion} onCancel={() => { setIsAddingQuestion(false); setEditingQuestion(null); }} />
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-600" /> Quiz Bilgileri</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm text-slate-500">Soru Sayısı</span>
                                    <span className="text-sm font-bold text-slate-900">{quiz.questions.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm text-slate-500">Süre Sınırı</span>
                                    <span className="text-sm font-bold text-slate-900">{(quiz.timeLimit || 0) > 0 ? `${quiz.timeLimit} Dakika` : 'Sınırsız'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-slate-500">Oluşturulma</span>
                                    <span className="text-sm font-bold text-slate-900">{new Date(quiz.createdAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Eye size={18} className="text-indigo-600" /> Önizleme</h3>
                            <p className="text-xs text-slate-500 mb-6">Quiz yayınlandığında nasıl görüneceğini merak ediyor musunuz?</p>
                            <button onClick={() => window.open(`/quiz/preview/${quiz.id}`, '_blank')} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">Göz At</button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default QuizDesigner;

