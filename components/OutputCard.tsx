import React from 'react';

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, icon, action, children }) => {
  return (
    <div className="bg-white/60 dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 w-full backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-4 text-blue-500">{icon}</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        {action}
      </div>
      <div className="text-slate-600 dark:text-slate-300 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default OutputCard;
