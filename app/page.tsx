"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Landing page with authentication
 * Redirects to dashboard if already authenticated
 */
export default function HomePage() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-nextgen-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 bg-gradient-to-br from-nextgen-purple via-nextgen-purple-light to-nextgen-purple">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        {/* Content */}
        <div className="relative flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md animate-fade-in shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-nextgen-green to-nextgen-green-light shadow-lg">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">
                MAP Data Visualization
              </CardTitle>
              <CardDescription className="text-base">
                Transform student data into compelling visual insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Authorized NextGen Academy staff only
                </p>
                <p className="text-xs text-muted-foreground">
                  @esports.school • @superbuilders.school
                </p>
              </div>
              
              <Button
                onClick={() => signIn("google")}
                className="w-full h-11 px-8 bg-gradient-to-r from-nextgen-green to-nextgen-green-light hover:from-nextgen-green-dark hover:to-nextgen-green"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
              
              <div className="space-y-2 rounded-lg bg-muted/50 p-4">
                <h3 className="text-sm font-semibold">What you can do:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2 text-nextgen-green">✓</span>
                    Generate professional visualizations from MAP test data
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-nextgen-green">✓</span>
                    Show improvement projections with tutoring packages
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-nextgen-green">✓</span>
                    Export high-quality images for parent communications
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
