import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function ProfileId({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  return <>User profile is: {profile.email}</>;
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileId params={params} />
      </Suspense>
    </div>
  );
}
