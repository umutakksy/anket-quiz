import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizList from './pages/QuizList';
import QuizDesigner from './pages/QuizDesigner';
import QuizResponses from './pages/QuizResponses';
import PublicQuizPage from './pages/PublicQuiz';
import QuizPreview from './pages/QuizPreview';
import './index.css';

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4 mb-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold text-indigo-600">Quiz Modülü</h1>
                <div className="space-x-4">
                    <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium">Quizlerim</a>
                </div>
            </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 pb-8">
            {children}
        </main>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/quiz/:slug" element={<PublicQuizPage />} />
                <Route path="/quiz/preview/:id" element={<QuizPreview />} />

                <Route path="/" element={<Layout><QuizList /></Layout>} />
                <Route path="/quiz/:id/duzenle" element={<Layout><QuizDesigner /></Layout>} />
                <Route path="/quiz/:id/yanitlar" element={<Layout><QuizResponses /></Layout>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
