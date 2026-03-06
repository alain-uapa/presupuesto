// Vite pone 'development' cuando corres npm run dev 
// y 'production' cuando corres npm run build
const isDev = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDev 
  ? '' 
  : '/presupuesto';

export const APP_BASENAME = isDev 
  ? '/' 
  : '/presupuesto';
