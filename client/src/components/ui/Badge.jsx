import React from 'react';

export const Badge = ({
  children,
  variant = 'indigo',
  className = '',
  ...props
}) => {
  const variants = {
    indigo: 'bg-brand-50 text-brand-700 border-brand-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.indigo
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
