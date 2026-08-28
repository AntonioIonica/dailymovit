import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  console.log(user);

  if (!user?.id) {
    console.log("No user session yet!");
    return;
  }
  
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
