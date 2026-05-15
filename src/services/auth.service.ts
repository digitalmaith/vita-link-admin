import { api } from "@/lib/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "DONOR" | "HEALTH_STRUCTURE";
  isStructureAdmin: boolean;
  healthStructureId: string | null;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),

  me: () =>
    api.get<{ success: boolean; user: AuthUser }>("/auth/me"),
};
