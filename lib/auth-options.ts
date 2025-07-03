import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * NextAuth configuration with Google OAuth provider
 * Restricts access to @esports.school and @superbuilders.school domains
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Domain restriction - only allow specific email domains
      const allowedDomains = ["@esports.school", "@superbuilders.school"];
      const email = user.email || "";
      
      const isAllowed = allowedDomains.some((domain) =>
        email.endsWith(domain)
      );
      
      if (!isAllowed) {
        console.log(`Authentication rejected for email: ${email}`);
        return false;
      }
      
      console.log(`Authentication successful for email: ${email}`);
      return true;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user data in JWT
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 