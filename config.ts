// Vite pone 'development' cuando corres npm run dev 
// y 'production' cuando corres npm run build
const isDev = import.meta.env.MODE === 'development';

export const APP_BASENAME = isDev 
  ? '/' 
  : '/presupuesto/';
