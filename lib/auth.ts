import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the current user session on the server
 * @returns The user session or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Require authentication for a server component or route
 * Redirects to sign-in page if not authenticated
 * @returns The authenticated user
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/");
  }
  
  return user;
}

/**
 * Check if a user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
} 