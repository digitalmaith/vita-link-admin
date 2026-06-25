export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials?: string;
}

export type UserRole = "Super Admin" | "Admin" | "Manager" | "Viewer";

export interface UserSession {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}