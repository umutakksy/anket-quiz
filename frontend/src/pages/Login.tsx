import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await authService.login(username, password);
            if (!success) {
                setError('Geçersiz kullanıcı adı veya şifre.');
            } else {
                window.location.href = '/';
            }
        } catch (err) {
            setError('Giriş yapılırken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">GİRİŞ YAP</h1>
                    <p className="text-slate-500 font-medium mt-2">Devam etmek için kimlik bilgilerinizi girin</p>
                </div>

                <Card className="p-8 border-none shadow-2xl shadow-slate-200 bg-white/80 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-shake">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-bold text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>GİRİŞ YAP</span>
                                    <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </Card>

                <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    İS MERKEZİ &copy; 2024
                </p>
            </div>
        </div>
    );
};

export default Login;
