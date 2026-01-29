import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, {} from 'react';
import { ChevronDown } from 'lucide-react';
// --- Components ---
export const Card = ({ children, className = '' }) => (_jsx("div", { className: `bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`, children: children }));
export const CardHeader = ({ title, subtitle, icon: Icon, action }) => (_jsxs("div", { className: "px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-white/50 backdrop-blur-sm rounded-t-2xl", children: [_jsxs("div", { className: "flex items-center gap-3", children: [Icon && (_jsx("div", { className: "p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm ring-1 ring-indigo-100", children: _jsx(Icon, { size: 20, strokeWidth: 2.5 }) })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 leading-tight tracking-tight", children: title }), subtitle && _jsx("p", { className: "text-sm font-medium text-gray-500 mt-1", children: subtitle })] })] }), action && _jsx("div", { children: action })] }));
export const Label = ({ children, htmlFor, required }) => (_jsxs("label", { htmlFor: htmlFor, className: "block text-sm font-semibold text-gray-700 mb-2 ml-1", children: [children, required && _jsx("span", { className: "text-rose-500 ml-1 font-bold", children: "*" })] }));
export const Input = ({ label, className = '', icon: Icon, iconPosition = 'left', error, helperText, required, ...props }) => (_jsxs("div", { className: "w-full group", children: [label && _jsx(Label, { required: required, children: label }), _jsxs("div", { className: "relative isolate transition-all duration-200", children: [Icon && iconPosition === 'left' && (_jsx(Icon, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10", size: 18, strokeWidth: 2 })), _jsx("input", { className: `
                    w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border
                    ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                    focus:outline-none focus:ring-4 transition-all duration-200
                    placeholder:text-gray-400 font-medium text-[0.95rem] tracking-wide
                    py-3 shadow-sm
                    ${Icon && iconPosition === 'left' ? 'pl-11' : 'pl-4'} 
                    ${Icon && iconPosition === 'right' ? 'pr-11' : 'pr-4'} 
                    ${className}
                `, ...props }), Icon && iconPosition === 'right' && (_jsx(Icon, { className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10", size: 18, strokeWidth: 2 }))] }), helperText && !error && _jsx("p", { className: "mt-2 text-xs font-medium text-gray-500 ml-1", children: helperText }), error && _jsx("p", { className: "mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5 ml-1 animate-fadeIn", children: error })] }));
export const Select = ({ label, options, value, onChange, icon: Icon, error, helperText, required, ...props }) => (_jsxs("div", { className: "w-full group", children: [label && _jsx(Label, { required: required, children: label }), _jsxs("div", { className: "relative isolate", children: [Icon && (_jsx(Icon, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 z-10 transition-colors", size: 18, strokeWidth: 2 })), _jsx("select", { className: `
                    w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border appearance-none cursor-pointer
                    ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                    focus:outline-none focus:ring-4 transition-all duration-200
                    font-medium text-[0.95rem] tracking-wide py-3 pr-10 shadow-sm
                    ${Icon ? 'pl-11' : 'pl-4'}
                `, value: value, onChange: onChange, ...props, children: options.map((opt, i) => {
                        const val = typeof opt === 'string' ? opt : opt.value;
                        const lbl = typeof opt === 'string' ? opt : opt.label;
                        return _jsx("option", { value: val, children: lbl }, i);
                    }) }), _jsx("div", { className: "absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-indigo-600 transition-colors", children: _jsx(ChevronDown, { size: 18, strokeWidth: 2.5 }) })] }), helperText && !error && _jsx("p", { className: "mt-2 text-xs font-medium text-gray-500 ml-1", children: helperText }), error && _jsx("p", { className: "mt-2 text-xs font-semibold text-rose-600 ml-1 animate-fadeIn", children: error })] }));
export const TextArea = ({ label, className = '', error, helperText, required, ...props }) => (_jsxs("div", { className: "w-full group", children: [label && _jsx(Label, { required: required, children: label }), _jsx("textarea", { className: `
                w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border 
                ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                focus:outline-none focus:ring-4 transition-all duration-200
                placeholder:text-gray-400 font-medium text-[0.95rem] tracking-wide
                p-4 min-h-[120px] resize-y shadow-sm
                ${className}
            `, ...props }), helperText && !error && _jsx("p", { className: "mt-2 text-xs font-medium text-gray-500 ml-1", children: helperText }), error && _jsx("p", { className: "mt-2 text-xs font-semibold text-rose-600 ml-1 animate-fadeIn", children: error })] }));
//# sourceMappingURL=FormElements.js.map