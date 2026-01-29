import React, { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { type LucideIcon } from 'lucide-react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    error?: string | undefined;
    helperText?: string | undefined;
}
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: string[] | {
        value: string;
        label: string;
    }[];
    icon?: LucideIcon;
    error?: string | undefined;
    helperText?: string | undefined;
}
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string | undefined;
    helperText?: string | undefined;
}
export declare const Card: React.FC<{
    children: React.ReactNode;
    className?: string;
}>;
export declare const CardHeader: React.FC<{
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}>;
export declare const Label: React.FC<{
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean | undefined;
}>;
export declare const Input: React.FC<InputProps>;
export declare const Select: React.FC<SelectProps>;
export declare const TextArea: React.FC<TextAreaProps>;
export {};
//# sourceMappingURL=FormElements.d.ts.map