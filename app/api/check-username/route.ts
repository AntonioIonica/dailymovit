import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) return NextResponse.json({ message: "You are not authorized!" });

  try {
    const { newUsername } = await req.json();

    const { data: usernameData, error: usernameError } = await (await supabase)
      .from("profiles")
      .select("user_name")
      .eq("user_name", newUsername);

    if (usernameError) {
      return NextResponse.json({ error: usernameError });
    }

    return NextResponse.json({
      checkUsername: usernameData,
    });
  } catch (error) {
    console.error(error);
  }
}
