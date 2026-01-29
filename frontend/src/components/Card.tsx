import React, { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: ReactNode;
    icon?: LucideIcon;
    iconColor?: string;
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    noPadding?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    title,
    subtitle,
    action,
    icon: Icon,
    iconColor = '#4F46E5',
    variant = 'default',
    noPadding = false,
    onClick
}) => {
    const variantClasses = {
        default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
        elevated: 'bg-white border-0 shadow-lg hover:shadow-xl ring-1 ring-gray-100',
        outlined: 'bg-white border-2 border-gray-200 shadow-none hover:border-indigo-200',
        glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg'
    };

    return (
        <div
            onClick={onClick}
            className={`rounded-xl transition-all duration-300 ${variantClasses[variant]} ${noPadding ? '' : 'p-4'} ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {(title || action || Icon) && (
                <div className={`flex items-start justify-between ${noPadding ? 'px-4 pt-4' : ''} ${title || Icon ? 'mb-3 pb-3 border-b border-gray-100' : ''}`}>
                    {(title || Icon) && (
                        <div className="flex items-center gap-2">
                            {Icon && (
                                <div
                                    className="p-1.5 rounded-lg"
                                    style={{
                                        backgroundColor: `${iconColor}12`,
                                        color: iconColor
                                    }}
                                >
                                    <Icon size={16} strokeWidth={2.5} />
                                </div>
                            )}
                            <div>
                                {title && <h3 className="font-bold text-sm text-gray-900 tracking-tight">{title}</h3>}
                                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                            </div>
                        </div>
                    )}
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            )}
            <div className={`text-gray-600 leading-relaxed ${noPadding && !title && !Icon ? '' : ''}`}>
                {children}
            </div>
        </div>
    );
};

// Modern Section Header Component
export const SectionHeader: React.FC<{
    title: string;
    subtitle?: string;
    action?: ReactNode;
    icon?: LucideIcon;
    iconColor?: string;
}> = ({ title, subtitle, action, icon: Icon, iconColor = '#4F46E5' }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            {Icon && (
                <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${iconColor}12`, color: iconColor }}
                >
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            )}
            <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);

// Stats Card for Dashboard & Reports
export const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color: string;
    onClick?: () => void;
}> = ({ title, value, icon: Icon, trend, trendUp = true, color, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group ${onClick ? 'cursor-pointer hover:border-indigo-200' : ''}`}
    >
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{value}</h3>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${trendUp ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        {trend}
                    </div>
                )}
            </div>
            <div
                className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: `${color}12`, color }}
            >
                <Icon size={28} strokeWidth={2} />
            </div>
        </div>
    </div>
);

// Empty State Component
export const EmptyState: React.FC<{
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-300">
            <Icon size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
        {action}
    </div>
);

// Data Table Wrapper
export const DataTable: React.FC<{
    children: ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-sm text-left">
            {children}
        </table>
    </div>
);

export const TableHead: React.FC<{ children: ReactNode }> = ({ children }) => (
    <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
        {children}
    </thead>
);

export const TableBody: React.FC<{ children: ReactNode }> = ({ children }) => (
    <tbody className="divide-y divide-gray-100 bg-white">
        {children}
    </tbody>
);
