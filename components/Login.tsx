
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { User, Role } from '../types';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onLoginError: (error: string) => void;
  returnTo?: string;
}

function LoginPage({ onLoginSuccess, onLoginError, returnTo }: LoginProps) {
  const navigate = useNavigate();
  useGoogleAuth({
    title:     'Bienvenido a UAPA',
    subtitle:  'Accede al portal de gestión presupuestaria utilizando tu cuenta institucional de Google.',
    onSuccess: async (token, _user) => {
      console.log("Google Login Token:", token);
      try {
        const loginData = await authService.googleLogin(token);
        
        // Normalizamos el rol a Mayúsculas para que coincida con el Enum Role
        const normalizedRole = loginData.user.role.toUpperCase() as Role;

        const user: User = {
          id: loginData.user.id,
          name: `${loginData.user.first_name} ${loginData.user.last_name}`,
          email: loginData.user.email,
          role: normalizedRole,
          picture: loginData.user.picture || `https://api.dicebear.com/7.x/personas/svg?seed=${loginData.user.email}&backgroundColor=003B71`
        };
        authService.saveSession(token, user);
        onLoginSuccess(user);
        
        // Redirigir a la URL original o al dashboard
        const redirectUrl = returnTo && returnTo !== '/' ? returnTo : '/';
        navigate(redirectUrl, { replace: true });
      } catch (error: any) {
        console.error("Google Login Error:", error);
        onLoginError(error.message || "Error al autenticar con Google");
      }
    }
  });

  return <div>Conectando con Google...</div>;
}
export default LoginPage;