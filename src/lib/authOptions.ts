import axios from "axios";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/refresh-token`, {
      refresh_token: token.refreshToken,
    });

    const { access_token/* , refresh_token */ } = response.data.data;

    return {
      ...token,
      accessToken: access_token,
      // refreshToken: refresh_token,
      accessTokenExpires: process.env.JWT_EXPIRES_IN, 
    };
  } catch (error) {
    console.error("🚨 Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours - disable automatic session updates
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        domain: process.env.NEXT_PUBLIC_DOMAIN
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
      async authorize(credentials) {
        if (!credentials) return null;

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
    async jwt({ token, user, trigger }) {
      // Initial login
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email;
        token.accessTokenExpires = process.env.JWT_EXPIRES_IN
        return token;
      }
      
      // Chỉ check expiry khi có trigger từ SessionProvider
      if (trigger === 'update' || !token.accessTokenExpires) {
        return token;
      }
      
      // Check if access token is expired (with 5s buffer thay vì 10s)
      if (token.accessTokenExpires && Date.now() > (token.accessTokenExpires as number) - 5000) {
        console.log("🔄 JWT callback: Access token expired, attempting refresh...");
        return await refreshAccessToken(token);
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
        // Add error to session if refresh failed
        if (token.error) {
          (session as any).error = token.error;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
