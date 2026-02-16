
import React from 'react';
import { BudgetRequest, BudgetStatus } from '../types';

interface BudgetCardProps {
  request: BudgetRequest;
  onView: () => void;
  onEdit: () => void;
  isCollaborator: boolean;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ request, onView, onEdit, isCollaborator }) => {
  const getStatusStyle = (status: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.APPROVED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case BudgetStatus.REJECTED:
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formattedDate = new Intl.DateTimeFormat('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(request.requestDate));

  // Generamos un avatar de perfil consistente basado en el ID del usuario
  const requesterAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.userId}&backgroundColor=f1f5f9`;

  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(request.status)}`}>
            {request.status}
          </span>
          <span className="text-xs text-slate-400 font-medium">{formattedDate}</span>
        </div>

        <h3 className="font-bold text-[#333333] line-clamp-2 mb-2 group-hover:text-[#003B71] transition-colors">
          {request.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 mb-4">
          {request.description}
        </p>

        {!isCollaborator && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
               <img src={requesterAvatar} alt={request.userName} />
            </div>
            <span className="text-xs text-slate-600 font-medium">Por {request.userName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
        <button 
          onClick={onView}
          className="flex-grow bg-[#F8F9FA] hover:bg-slate-100 text-[#333333] py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Ver Detalles
        </button>
        {isCollaborator && request.status === BudgetStatus.PENDING && (
          <button 
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-[#003B71] hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar solicitud"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
