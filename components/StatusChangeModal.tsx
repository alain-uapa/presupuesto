import React, { useState, useEffect } from 'react';

export interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
  isLoading?: boolean;
  title: string;
  description: string;
  confirmText: string;
  buttonColor?: 'rose' | 'blue';
  placeholder?: string;
  label?: string;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading,
  title,
  description,
  confirmText,
  buttonColor = 'rose',
  placeholder,
  label
}) => {
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (isOpen) {
      setComments('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(comments);
  };

  const isRose = buttonColor === 'rose';
  
  const bgClass = isRose ? 'bg-rose-50' : 'bg-blue-50';
  const borderClass = isRose ? 'border-rose-100' : 'border-blue-100';
  const iconBgClass = isRose ? 'bg-rose-100' : 'bg-blue-100';
  const iconClass = isRose ? 'text-rose-600' : 'text-blue-600';
  const textClass = isRose ? 'text-rose-900' : 'text-blue-900';
  const subtextClass = isRose ? 'text-rose-600' : 'text-blue-600';
  const buttonClass = isRose ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100';
  const focusClass = isRose ? 'focus:ring-rose-500 focus:border-rose-500' : 'focus:ring-blue-500 focus:border-blue-500';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className={`${bgClass} px-6 py-4 border-b ${borderClass}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${textClass}`}>{title}</h3>
              <p className={`text-xs ${subtextClass}`}>{description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-2">
            <label htmlFor="status-change-reason" className="text-sm font-bold text-slate-700">
              {label || 'Comentario'}
            </label>
            <textarea
              id="status-change-reason"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={placeholder || 'Escriba un comentario...'}
              className={`w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 ${focusClass} outline-none h-32 resize-none`}
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-[#F8F9FA] hover:bg-slate-100 text-slate-600 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!comments.trim() || isLoading}
              className={`flex-1 text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${buttonClass}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusChangeModal;
