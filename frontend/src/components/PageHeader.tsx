import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    icon?: LucideIcon;
    iconColor?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, icon: Icon, iconColor = '#3b82f6' }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 fade-in">
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div
                            className="p-2 rounded-xl"
                            style={{
                                backgroundColor: `${iconColor}10`,
                                color: iconColor
                            }}
                        >
                            <Icon size={22} strokeWidth={2.5} />
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
                        {description && (
                            <p className="text-gray-500 text-xs mt-0.5 font-medium">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-3 flex-shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
};
