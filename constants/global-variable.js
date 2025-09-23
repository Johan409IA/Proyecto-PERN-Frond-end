// Usar variable de entorno si está disponible, sino usar la URL por defecto
const baseUrl =
  import.meta.env.VITE_API_URL ||
  "https://backend-production-33a8.up.railway.app/api/employee";

export { baseUrl };
