import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function ProfileId() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return <h1>Your profile is: {profile.user_name ?? "not set yet"}</h1>;
}

export default async function Dashboard() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileId />
      </Suspense>
    </div>
  );
}
