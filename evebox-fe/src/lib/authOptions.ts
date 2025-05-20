/* Package System */
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: AuthOptions = {
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false,
        domain: 'localhost'
      }
    }
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        if (!credentials) {
          return null;
        }
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data.data;

          if (user && credentials.email) {
            return {
              id: user.id,
              email: credentials.email,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
            };
          }

          return null;
        } catch (error) {
          console.error("Error logging in:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.userId as string,
          email: token.email as string,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
        };
      }

      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
}