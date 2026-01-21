import { createClient } from "@/lib/supabase/server";
import { NextResponse, NextRequest } from "next/server";

type setType = {
    reps: number,
    duration: number,
    rest_time: number,
    set_number: number,
    weight: number,
    rpe: number
    userId: string
}

export async function POST(req: NextRequest) {
    const supabase = createClient();

    const body = await req.json();

    const { data: { user } } = await (await supabase).auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "The user is not authorized" }, { status: 401 })
    };


    // Workouts
    const { data: workoutData, error: workoutError } = await (await supabase).from("workouts").insert({
        user_id: user.id,
        duration: body.workout.duration,
        name: body.workout.name,
        public: body.workout.public
    }).select("id").single();
    if (workoutError) return NextResponse.json({
        error: workoutError
    }, { status: 500 });
    const workoutId = workoutData.id;


    // Exercises
    for (const exercise of body.exercises) {
        const { data: exerciseData, error: exerciseError } = await (await supabase).from("exercises").insert({
            workout_id: workoutId,
            name: exercise.exerciseName,
            notes: exercise.notes,
            user_id: user.id
        }).select("id").single();
        if (exerciseError) return NextResponse.json({ error: exerciseError }, { status: 500 });
        const exerciseId = exerciseData!.id;

        const setsToInsert = exercise.sets.map((s: setType) => ({
            exercise_id: exerciseId,
            set_number: s.set_number,
            reps: s.reps,
            duration: s.duration,
            weight: s.weight,
            rest_time: s.rest_time,
            rpe: s.rpe,
            user_id: user.id
        }));

        const { error: setError } = await (await supabase).from("sets").insert(setsToInsert);
        if (setError) return NextResponse.json({ error: setError }, { status: 500 });
    }

    return NextResponse.json({ message: "The data has been received", received: body, userId: user.id }, { status: 201 });
};