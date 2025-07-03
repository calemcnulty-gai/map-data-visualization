import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Authentication error page
 * Displayed when users try to sign in with unauthorized email domains
 */
export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-nextgen-purple to-nextgen-purple-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-destructive">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base">
            Authentication failed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              This application is restricted to authorized NextGen Academy staff only.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Access is limited to users with email addresses ending in:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              <li>@esports.school</li>
              <li>@superbuilders.school</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If you believe you should have access, please contact your administrator.
            </p>
            <Link href="/" className="block">
              <Button className="w-full" variant="outline">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 