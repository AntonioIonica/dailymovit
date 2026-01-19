import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const body = await req.json();
    console.log(`Received data: ${JSON.stringify(body)}.`);

    const { data: { user } } = await (await supabase).auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "The user is not authorized" }, { status: 401 })
    };
    // const { data: supabaseData, error } = await (await supabase).from("workouts").insert({}).select().single();

    // if (error) {
    //     NextResponse.json({ error: "There was an error saving the data." }, { status: 400 })
    // }
    console.log(user.id);
    return NextResponse.json({ message: "The data has been received", received: body, userId: user.id }, { status: 201 });
};