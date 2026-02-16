
import React from 'react';
import { Role } from '../types';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#003B71] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
          <span className="text-white font-bold text-4xl">U</span>
        </div>
        
        <h2 className="text-2xl font-bold text-[#333333] mb-2">Bienvenido a UAPA</h2>
        <p className="text-slate-500 text-center mb-10">
          Accede al portal de gestión presupuestaria utilizando tu cuenta institucional.
        </p>

        <div className="space-y-4 w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Acceso Rápido (Demo)</p>
          
          <button 
            onClick={() => onLogin(Role.COLABORADOR)}
            className="w-full flex items-center justify-center gap-3 bg-[#ff8300] hover:bg-[#e67600] text-white py-3 px-6 rounded-xl font-bold transition-all shadow-md shadow-orange-100"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span>Entrar como Colaborador</span>
          </button>

          <button 
            onClick={() => onLogin(Role.ADMINISTRADOR)}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-[#003B71] hover:bg-[#F8F9FA] text-[#333333] py-3 px-6 rounded-xl font-medium transition-all group"
          >
            <div className="w-6 h-6 bg-slate-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 group-hover:text-[#003B71]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span>Entrar como Administrador</span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 w-full text-center">
          <p className="text-slate-400 text-sm">
            Autenticación segura vía Google Workspace
          </p>
        </div>
      </div>

      <div className="mt-8 text-center bg-blue-50/50 border border-blue-100 rounded-xl p-4 max-w-md w-full">
        <p className="text-sm text-slate-600 font-medium">
          <span className="text-[#003B71] font-bold">¿Necesitas asistencia?</span>
          <br />
          Llama a la sede <span className="text-[#ff8300] font-bold">Ext. 378</span> o Flota: <span className="text-[#ff8300] font-bold">829-901-2885</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
