import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/* =========================================
   🔄 REFRESH TOKEN LOGIC
========================================= */
async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.accessToken) {
      throw new Error("Refresh failed");
    }

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min
      error: undefined,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

/* =========================================
   🔐 NEXT AUTH CONFIG
========================================= */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!data.success || !data.accessToken) return null;

         

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
    async signIn({ user }) {
      return true;
    },
    /* =========================================
       JWT CALLBACK (REFRESH HERE)
    ========================================= */
    async jwt({ token, user }) {
      // 1. First login
      if (user) {
        return {
          ...token,
          id: (user as any).id,
          role: (user as any).role,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min
        };
      }

      // 2. Still valid
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      // 3. Expired → refresh
      return await refreshAccessToken(token);
    },

    /* =========================================
       SESSION
    ========================================= */
    async session({ session, token }) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 min session
  },

  secret: process.env.NEXTAUTH_SECRET,
};