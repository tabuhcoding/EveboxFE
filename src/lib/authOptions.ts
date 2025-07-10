import axios from "axios";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth signin
      if (account?.provider === "google" && profile) {
        try {
          // Exchange Google profile with backend to get custom tokens
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/google/signin`, {
            email: profile.email,
            name: profile.name,
            googleId: profile.sub,
            avatar: (profile as any).picture || null,
            accessToken: account.access_token,
          });

          const userData = res.data.data;
          
          // Add custom tokens to user object for JWT callback
          user.accessToken = userData.access_token;
          user.refreshToken = userData.refresh_token;
          user.id = userData.id || user.id;
          
          return true;
        } catch (error) {
          console.error("Error during Google OAuth with backend:", error);
          return false;
        }
      }
      
      // Handle credentials signin (existing flow)
      return true;
    },
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
