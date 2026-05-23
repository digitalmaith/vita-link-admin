// =============================================
// VITA-LINK ADMIN — API Proxy Configuration
// Centralise la configuration des URLs API
// =============================================

export const API_CONFIG = {
  // URL de base de l'API backend
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://vita-link-api.onrender.com/api",
  
  // URL de l'application (pour NextAuth)
  appURL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
};