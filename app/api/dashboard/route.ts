import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) {
    return NextResponse.json(
      { message: "The user is not authorized" },
      { status: 401 },
    );
  }

  const { error} = await (
    await supabase
  )
    .from("profiles")
    .update({
      avatar_url: body.avatar_url,
      user_name: body.user_name,
      display_name: body.display_name,
    })
    .eq("id", user.id);

  if (error && error?.code === "23505") {
    return NextResponse.json(
      { message: "The username is taken! Please choose another." },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { message: "Profile successfully updated!" },
    { status: 201 },
  );
}
