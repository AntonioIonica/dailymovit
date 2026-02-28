"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const handleSignWithGoogle = async () => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback?next=/` ||
            `http://localhost:3000/auth/callback?next=/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="card glow">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl">
            Login with:
          </CardTitle>
          <CardDescription className="flex justify-center">
            (Soon to add more providers)
          </CardDescription>
          <CardContent>
            <div className="flex flex-col items-center justify-center pt-10">
              <Button onClick={handleSignWithGoogle}>
                <Image
                  src="/google_logo.svg"
                  alt="google login logo"
                  height={30}
                  width={30}
                />
                Sign with Google
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
