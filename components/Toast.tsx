
import React, { useEffect, useState } from 'react';
import { ToastType } from '../types';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<{ toast: ToastType; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(remaining);
      
      if (elapsed >= toast.duration) {
        clearInterval(interval);
        onRemove(toast.id);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [toast, onRemove]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-600';
      case 'error': return 'bg-rose-600';
      default: return 'bg-[#003B71]';
    }
  };

  return (
    <div className="relative group w-80 bg-white shadow-2xl rounded-xl border border-slate-100 overflow-hidden animate-slide-in-right mb-3">
      <div className="p-4 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${getStyle()}`}>
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-sm font-semibold text-[#333333]">{toast.message}</p>
        <button 
          onClick={() => onRemove(toast.id)}
          className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
        <div 
          className={`h-full transition-all duration-100 ease-linear ${getStyle()}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
