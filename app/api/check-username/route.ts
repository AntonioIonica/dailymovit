import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const { newUsername } = await req.json();

    const { data: usernameData, error: usernameError } = await supabase
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

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
