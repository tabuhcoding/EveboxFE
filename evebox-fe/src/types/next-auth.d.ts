import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
  }
}