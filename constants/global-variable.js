// Configuración de la URL del backend
const getBaseUrl = () => {
  // En producción (Vercel), usar la variable de entorno
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL ||
      "https://backend-production-33a8.up.railway.app/api/employee"
    );
  }
  // En desarrollo, usar la URL del backend directamente
  return "https://backend-production-33a8.up.railway.app/api/employee";
};

const baseUrl = getBaseUrl();

// Debug: mostrar la URL que se está usando
console.log("Entorno:", import.meta.env.MODE);
console.log("API URL configurada:", baseUrl);
console.log("Variable de entorno VITE_API_URL:", import.meta.env.VITE_API_URL);

export { baseUrl };
