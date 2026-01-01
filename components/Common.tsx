
import React from 'react';

export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
                <h3 className="font-semibold text-slate-100">{title}</h3>
            </div>
        )}
        <div className="p-6">
            {children}
        </div>
    </div>
);

export const Button: React.FC<{ 
    children: React.ReactNode; 
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'; 
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit";
}> = ({ children, variant = 'primary', onClick, className = "", disabled, loading, type = "button" }) => {
    const variants = {
        primary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
        outline: 'border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white',
        danger: 'bg-red-600 hover:bg-red-500 text-white',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white'
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {loading && <i className="fa-solid fa-spinner animate-spin"></i>}
            {children}
        </button>
    );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
    const variants = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20',
        info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${variants[variant]}`}>
            {children}
        </span>
    );
};
