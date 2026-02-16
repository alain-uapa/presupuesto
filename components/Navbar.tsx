
import React from 'react';
import { User, Role } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#003B71] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <div>
            <h1 className="font-bold text-[#333333] leading-tight">UAPA</h1>
            <p className="text-xs text-slate-500">Gestión de Presupuestos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[#333333]">{user.name}</p>
            <p className="text-[10px] uppercase font-bold text-[#003B71] tracking-wider">
              {user.role}
            </p>
          </div>
          <img 
            src={user.photoUrl} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border border-slate-200"
          />
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Cerrar Sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
