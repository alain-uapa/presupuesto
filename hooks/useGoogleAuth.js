// hooks/useGoogleAuth.js
import { useEffect, useRef } from 'react';
import { authService } from '../services/auth.service';
/**
 * Hook that handles Google authentication via the UAPA auth page.
 *
 * Flow:
 *  1. If the current URL already contains ?token= (redirect back from auth page),
 *     the token is extracted synchronously, the URL is cleaned, and onSuccess is
 *     called immediately — no script loading required.
 *  2. Otherwise the Netlify helper script is loaded and signInWithGoogle() is
 *     called to redirect the user to the auth page.
 *
 * The `calledRef` guard prevents React 18 StrictMode's double-invocation from
 * running the effect a second time after the cleanup, which would otherwise
 * find an empty URL (token already consumed) and trigger a second redirect.
 */
export function useGoogleAuth({ title, subtitle, onSuccess }) {
  const calledRef = useRef(false);

  useEffect(() => {
    // Prevent StrictMode double-invocation re-running the auth flow
    if (calledRef.current) return;
    calledRef.current = true;

    const user = authService.getSavedUser();
    const token = authService.getSavedToken();    
    if (user && token) {    
      // Si ya hay un usuario guardado, no cargamos el script y llamamos al callback directamente
      onSuccess(token, user);
      return;
    }

    // // ── Case 1: returning from the auth page with ?token= in the URL ──────────
    // const params = new URLSearchParams(window.location.search);
    // const urlToken = params.get('token');

    // if (urlToken) {
    //   // Clean the auth params from the URL before doing anything async
    //   history.replaceState(null, '', window.location.pathname);

    //   onSuccess(urlToken, {
    //     name:    params.get('name'),
    //     email:   params.get('email'),
    //     picture: params.get('picture'),
    //   });
    //   return; // No cleanup needed — no script was appended
    // }

    // ── Case 2: no token yet — load the helper and redirect to the auth page ──
    const script = document.createElement('script');
    script.src = 'https://uapa-auth.netlify.app/google-auth.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      window.signInWithGoogle({ title, subtitle, callback: onSuccess });
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
