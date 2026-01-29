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
export declare const Card: React.FC<CardProps>;
export declare const SectionHeader: React.FC<{
    title: string;
    subtitle?: string;
    action?: ReactNode;
    icon?: LucideIcon;
    iconColor?: string;
}>;
export declare const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color: string;
    onClick?: () => void;
}>;
export declare const EmptyState: React.FC<{
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}>;
export declare const DataTable: React.FC<{
    children: ReactNode;
    className?: string;
}>;
export declare const TableHead: React.FC<{
    children: ReactNode;
}>;
export declare const TableBody: React.FC<{
    children: ReactNode;
}>;
export {};
//# sourceMappingURL=Card.d.ts.map