// Configuración de la URL del backend
const getBaseUrl = () => {
  // Primero intentar usar la variable de entorno VITE_API_URL
  if (import.meta.env.VITE_API_URL) {
    console.log('Usando VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Si no está definida, usar la URL por defecto
  const defaultUrl = "https://backend-production-33a8.up.railway.app/api/employee";
  console.log('Usando URL por defecto:', defaultUrl);
  return defaultUrl;
};

const baseUrl = getBaseUrl();

// Debug: mostrar información del entorno
console.log("=== Configuración de API ===");
console.log("Entorno:", import.meta.env.MODE);
console.log("Es producción:", import.meta.env.PROD);
console.log("API URL configurada:", baseUrl);
console.log("Variable VITE_API_URL:", import.meta.env.VITE_API_URL || "No definida");
console.log("============================");

export { baseUrl };
