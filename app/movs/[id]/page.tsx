import MovsClient from "@/components/MovsClient";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function GetUserMovs({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  const id = (await params).id;
  const paramsUserId = id;

  const { data: workouts, error: workoutsError } = await supabase.from("workouts").select("name").eq("user_id", userId);


  return (<div>{!workoutsError ? (< Suspense fallback={null}>
    <MovsClient userId={userId} paramsUserId={paramsUserId} workouts={workouts} />
  </Suspense>) : (<div>There are no workouts</div>)}

  </div >)
}
