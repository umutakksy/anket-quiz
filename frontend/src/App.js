import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuizList from './pages/QuizList';
import QuizDesigner from './pages/QuizDesigner';
import QuizResponses from './pages/QuizResponses';
import PublicQuizPage from './pages/PublicQuiz';
import QuizPreview from './pages/QuizPreview';
import './index.css';
const Layout = ({ children }) => (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("nav", { className: "bg-white shadow-sm p-4 mb-8", children: _jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center", children: [_jsx("h1", { className: "text-xl font-bold text-indigo-600", children: "Anket & Quiz Mod\u00FCl\u00FC" }), _jsx("div", { className: "space-x-4", children: _jsx("a", { href: "/", className: "text-gray-600 hover:text-indigo-600 font-medium", children: "Anket & Quizlerim" }) })] }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 pb-8", children: children })] }));
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/quiz/:slug", element: _jsx(PublicQuizPage, {}) }), _jsx(Route, { path: "/quiz/preview/:id", element: _jsx(QuizPreview, {}) }), _jsx(Route, { path: "/", element: _jsx(Layout, { children: _jsx(QuizList, {}) }) }), _jsx(Route, { path: "/quiz/:id/duzenle", element: _jsx(Layout, { children: _jsx(QuizDesigner, {}) }) }), _jsx(Route, { path: "/quiz/:id/yanitlar", element: _jsx(Layout, { children: _jsx(QuizResponses, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map