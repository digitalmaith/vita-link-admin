import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (
            !data.success ||
            !data.accessToken ||
            data.user.role !== "ADMIN"
          ) {
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.role = (user as any).role;
        token.id = (user as any).id;
      }

      return token;
    },

    async session({ session, token }) {
      (session.user as any).id = token.id;

      (session.user as any).role = token.role;

      (session as any).accessToken =
        token.accessToken;

      (session as any).refreshToken =
        token.refreshToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};