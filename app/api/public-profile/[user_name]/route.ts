import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  //   params, cache, etc. are now async so must await
  { params }: { params: Promise<{ user_name: string }> },
) {
  const { user_name } = await params;
  const supabase = createClient();

  const { data: userData, error: userError } = await (await supabase)
    .from("profiles")
    .select("id, user_name, display_name, avatar_url")
    .eq("user_name", user_name)
    .single();

  if (!userData) {
    return NextResponse.json(
      { success: false, message: `User not found | ${userError}` },
      { status: 404 },
    );
  }

  const { data: workoutData, error: workoutError } = await (await supabase)
    .from("workouts")
    .select(
      "id, duration, completed_at, name, exercises (id, name, notes, sets (id, set_number, reps, duration, weight, rest_time, rpe))",
    )
    .order("completed_at", { ascending: false })
    .eq("user_id", userData?.id)
    .eq("public", true);

  if (workoutError) {
    return NextResponse.json(
      {
        success: false,
        message: "There is no workout data for this specific user!",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { success: true, data: { userData, workoutData } },
    { status: 200 },
  );
}
