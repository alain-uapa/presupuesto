
import React from 'react';
import { User, Role } from '../types';
import Avatar from './Avatar';
import { APP_BASENAME } from '../config';
import logo from '../assets/logo-uapa.png';
interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">          
          <div>
            <img style={{ width: '100px', height: 'auto' }} src={logo} alt="Logo UAPA" />
            <p className="text-xs text-slate-500">Gestión de Presupuestos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">          
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#333333]">{user.name}</p>
            {user.role === Role.SUPERVISOR && (
              <a
                href={`${APP_BASENAME}admin/`}
                className="text-xs font-medium text-[#003B71] hover:text-[#004a8f] transition-colors"
              >
                Administrar
              </a>
            )}            
          </div>
          <div className="relative group cursor-pointer">
            <Avatar picture={user.picture} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
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
