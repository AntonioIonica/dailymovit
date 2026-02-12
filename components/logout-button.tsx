"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    window.location.reload();
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={logout}
      className="text-white font-bold hover:scale-110 hover:opacity-90"
    >
      Logout
    </Button>
  );
}
