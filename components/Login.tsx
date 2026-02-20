
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { User, Role } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onLoginError: (error: string) => void;
  returnTo?: string;
}

const GOOGLE_CLIENT_ID = "478848519153-0tklbkp5d7252099relj297632eka3qg.apps.googleusercontent.com";

declare global {
  interface Window {
    google: any;
  }
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onLoginError, returnTo }) => {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
          shape: 'pill',
        });
      } else {
        setTimeout(initializeGoogle, 200);
      }
    };

    initializeGoogle();
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      const { credential } = response;
      const loginData = await authService.googleLogin(credential);
      
      // Normalizamos el rol a Mayúsculas para que coincida con el Enum Role
      const normalizedRole = loginData.user.role.toUpperCase() as Role;

      const user: User = {
        id: loginData.user.id,
        name: `${loginData.user.first_name} ${loginData.user.last_name}`,
        email: loginData.user.email,
        role: normalizedRole,
        photoUrl: loginData.user.photo_url || `https://api.dicebear.com/7.x/personas/svg?seed=${loginData.user.email}&backgroundColor=003B71`
      };

      authService.saveSession(loginData.token, user);
      onLoginSuccess(user);
      
      // Redirigir a la URL original o al dashboard
      const redirectUrl = returnTo && returnTo !== '/' ? returnTo : '/';
      navigate(redirectUrl, { replace: true });
    } catch (error: any) {
      console.error("Google Login Error:", error);
      onLoginError(error.message || "Error al autenticar con Google");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#003B71] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
          <span className="text-white font-bold text-4xl">U</span>
        </div>
        
        <h2 className="text-2xl font-bold text-[#333333] mb-2 text-center">Bienvenido a UAPA</h2>
        <p className="text-slate-500 text-center mb-10">
          Accede al portal de gestión presupuestaria utilizando tu cuenta institucional de Google.
        </p>

        <div className="w-full flex justify-center py-4">
          <div ref={googleButtonRef}></div>
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
