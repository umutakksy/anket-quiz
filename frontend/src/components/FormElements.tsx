import React, { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

// --- Types ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    error?: string;
    helperText?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: string[] | { value: string; label: string }[];
    icon?: LucideIcon;
    error?: string;
    helperText?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

// --- Components ---

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
        {children}
    </div>
);

export const CardHeader: React.FC<{
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, action }) => (
    <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-white/50 backdrop-blur-sm rounded-t-2xl">
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm ring-1 ring-indigo-100">
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            )}
            <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">{title}</h3>
                {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; required?: boolean }> = ({ children, htmlFor, required }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
        {children}
        {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
    </label>
);

export const Input: React.FC<InputProps> = ({
    label,
    className = '',
    icon: Icon,
    iconPosition = 'left',
    error,
    helperText,
    required,
    ...props
}) => (
    <div className="w-full group">
        {label && <Label required={required}>{label}</Label>}
        <div className="relative isolate transition-all duration-200">
            {Icon && iconPosition === 'left' && (
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10" size={18} strokeWidth={2} />
            )}
            <input
                className={`
                    w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border
                    ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                    focus:outline-none focus:ring-4 transition-all duration-200
                    placeholder:text-gray-400 font-medium text-[0.95rem] tracking-wide
                    py-3 shadow-sm
                    ${Icon && iconPosition === 'left' ? 'pl-11' : 'pl-4'} 
                    ${Icon && iconPosition === 'right' ? 'pr-11' : 'pr-4'} 
                    ${className}
                `}
                {...props}
            />
            {Icon && iconPosition === 'right' && (
                <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors z-10" size={18} strokeWidth={2} />
            )}
        </div>
        {helperText && !error && <p className="mt-2 text-xs font-medium text-gray-500 ml-1">{helperText}</p>}
        {error && <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5 ml-1 animate-fadeIn">{error}</p>}
    </div>
);

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    onChange,
    icon: Icon,
    error,
    helperText,
    required,
    ...props
}) => (
    <div className="w-full group">
        {label && <Label required={required}>{label}</Label>}
        <div className="relative isolate">
            {Icon && (
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 z-10 transition-colors" size={18} strokeWidth={2} />
            )}
            <select
                className={`
                    w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border appearance-none cursor-pointer
                    ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                    focus:outline-none focus:ring-4 transition-all duration-200
                    font-medium text-[0.95rem] tracking-wide py-3 pr-10 shadow-sm
                    ${Icon ? 'pl-11' : 'pl-4'}
                `}
                value={value}
                onChange={onChange}
                {...props}
            >
                {options.map((opt, i) => {
                    const val = typeof opt === 'string' ? opt : opt.value;
                    const lbl = typeof opt === 'string' ? opt : opt.label;
                    return <option key={i} value={val}>{lbl}</option>;
                })}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-indigo-600 transition-colors">
                <ChevronDown size={18} strokeWidth={2.5} />
            </div>
        </div>
        {helperText && !error && <p className="mt-2 text-xs font-medium text-gray-500 ml-1">{helperText}</p>}
        {error && <p className="mt-2 text-xs font-semibold text-rose-600 ml-1 animate-fadeIn">{error}</p>}
    </div>
);

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', error, helperText, required, ...props }) => (
    <div className="w-full group">
        {label && <Label required={required}>{label}</Label>}
        <textarea
            className={`
                w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl border 
                ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50' : 'hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white'} 
                focus:outline-none focus:ring-4 transition-all duration-200
                placeholder:text-gray-400 font-medium text-[0.95rem] tracking-wide
                p-4 min-h-[120px] resize-y shadow-sm
                ${className}
            `}
            {...props}
        />
        {helperText && !error && <p className="mt-2 text-xs font-medium text-gray-500 ml-1">{helperText}</p>}
        {error && <p className="mt-2 text-xs font-semibold text-rose-600 ml-1 animate-fadeIn">{error}</p>}
    </div>
);
