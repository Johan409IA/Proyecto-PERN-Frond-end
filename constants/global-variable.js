// Usar variable de entorno si está disponible, sino usar la URL por defecto
const baseUrl =
  import.meta.env.VITE_API_URL ||
  "https://backend-production-33a8.up.railway.app/api/employee";

// Debug: mostrar la URL que se está usando
console.log("API URL configurada:", baseUrl);
console.log("Variable de entorno VITE_API_URL:", import.meta.env.VITE_API_URL);

export { baseUrl };
