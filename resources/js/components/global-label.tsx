import React from 'react';

interface GlobalLabelProps {
    text: string;
    className?: string; // Optional className for custom styling
}

export const GlobalLabel: React.FC<GlobalLabelProps> = ({ text, className }) => {
    return <span className={`text-sm font-semibold ${className}`}>{text}</span>;
};