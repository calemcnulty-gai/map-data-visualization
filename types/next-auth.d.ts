import { DefaultSession } from "next-auth";

/**
 * Module augmentation for NextAuth types
 * Extends the default session to include user ID
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
} 