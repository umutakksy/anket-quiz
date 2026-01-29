import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import {} from 'lucide-react';
export const PageHeader = ({ title, description, actions, icon: Icon, iconColor = '#3b82f6' }) => {
    return (_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-6 fade-in", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3", children: [Icon && (_jsx("div", { className: "p-2 rounded-xl", style: {
                                backgroundColor: `${iconColor}10`,
                                color: iconColor
                            }, children: _jsx(Icon, { size: 22, strokeWidth: 2.5 }) })), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: title }), description && (_jsx("p", { className: "text-gray-500 text-xs mt-0.5 font-medium", children: description }))] })] }) }), actions && (_jsx("div", { className: "flex items-center gap-3 flex-shrink-0", children: actions }))] }));
};
//# sourceMappingURL=PageHeader.js.map