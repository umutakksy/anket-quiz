import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, {} from 'react';
import {} from 'lucide-react';
export const Card = ({ children, className = '', title, subtitle, action, icon: Icon, iconColor = '#4F46E5', variant = 'default', noPadding = false, onClick }) => {
    const variantClasses = {
        default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
        elevated: 'bg-white border-0 shadow-lg hover:shadow-xl ring-1 ring-gray-100',
        outlined: 'bg-white border-2 border-gray-200 shadow-none hover:border-indigo-200',
        glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg'
    };
    return (_jsxs("div", { onClick: onClick, className: `rounded-xl transition-all duration-300 ${variantClasses[variant]} ${noPadding ? '' : 'p-4'} ${className} ${onClick ? 'cursor-pointer' : ''}`, children: [(title || action || Icon) && (_jsxs("div", { className: `flex items-start justify-between ${noPadding ? 'px-4 pt-4' : ''} ${title || Icon ? 'mb-3 pb-3 border-b border-gray-100' : ''}`, children: [(title || Icon) && (_jsxs("div", { className: "flex items-center gap-2", children: [Icon && (_jsx("div", { className: "p-1.5 rounded-lg", style: {
                                    backgroundColor: `${iconColor}12`,
                                    color: iconColor
                                }, children: _jsx(Icon, { size: 16, strokeWidth: 2.5 }) })), _jsxs("div", { children: [title && _jsx("h3", { className: "font-bold text-sm text-gray-900 tracking-tight", children: title }), subtitle && _jsx("p", { className: "text-xs text-gray-500", children: subtitle })] })] })), action && _jsx("div", { className: "flex-shrink-0", children: action })] })), _jsx("div", { className: `text-gray-600 leading-relaxed ${noPadding && !title && !Icon ? '' : ''}`, children: children })] }));
};
// Modern Section Header Component
export const SectionHeader = ({ title, subtitle, action, icon: Icon, iconColor = '#4F46E5' }) => (_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [Icon && (_jsx("div", { className: "p-2 rounded-xl", style: { backgroundColor: `${iconColor}12`, color: iconColor }, children: _jsx(Icon, { size: 20, strokeWidth: 2.5 }) })), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: title }), subtitle && _jsx("p", { className: "text-sm text-gray-500", children: subtitle })] })] }), action && _jsx("div", { children: action })] }));
// Stats Card for Dashboard & Reports
export const StatCard = ({ title, value, icon: Icon, trend, trendUp = true, color, onClick }) => (_jsx("div", { onClick: onClick, className: `bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-500 mb-2", children: title }), _jsx("h3", { className: "text-3xl font-bold text-gray-900 tracking-tight mb-2", children: value }), trend && (_jsxs("div", { className: `flex items-center gap-1.5 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`, children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${trendUp ? 'bg-emerald-500' : 'bg-rose-500'}` }), trend] }))] }), _jsx("div", { className: "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", style: { backgroundColor: `${color}12`, color }, children: _jsx(Icon, { size: 28, strokeWidth: 2 }) })] }) }));
// Empty State Component
export const EmptyState = ({ icon: Icon, title, description, action }) => (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-300", children: _jsx(Icon, { size: 36, strokeWidth: 1.5 }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-500 max-w-md mb-6", children: description }), action] }));
// Data Table Wrapper
export const DataTable = ({ children, className = '' }) => (_jsx("div", { className: `overflow-x-auto ${className}`, children: _jsx("table", { className: "w-full text-sm text-left", children: children }) }));
export const TableHead = ({ children }) => (_jsx("thead", { className: "bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200", children: children }));
export const TableBody = ({ children }) => (_jsx("tbody", { className: "divide-y divide-gray-100 bg-white", children: children }));
//# sourceMappingURL=Card.js.map