"use client";

import { Workouts } from "@/app/movs/[id]/page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileType = {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
};

export default function Profile() {
  const params = useParams<{ user_name: string }>();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await fetch(`/api/public-profile/${params.user_name}`);
      const data = await res.json();

      setProfile(data?.data?.userData || null);
      setWorkouts(data?.data?.workoutData || null);
    };

    fetchWorkouts();
  }, [params.user_name]);

  // Get the exercise name with the max rep in set
  const getMaxRepExercise = (
    workouts: Workouts,
  ): { maxRepsExercise: string | null; maxRep: number } => {
    let maxRep = 0;
    let maxRepsExercise = null;

    workouts?.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          // Biggest amount of reps
          if (set.reps > maxRep) {
            maxRep = set.reps;
            maxRepsExercise = exercise.name;
          }
        });
      });
    });

    return { maxRep, maxRepsExercise };
  };
  const { maxRep, maxRepsExercise } = getMaxRepExercise(workouts);

  // Get the exercise name with the maximum weight lifted
  const getMaxWeightExercise = (
    workouts: Workouts,
  ): { maxWeight: number; maxWeightExercise: string | null } => {
    let maxWeight = 0;
    let maxWeightExercise = "";

    workouts?.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.weight > maxWeight) {
            maxWeight = set.weight;
            maxWeightExercise = exercise.name;
          }
        });
      });
    });

    return { maxWeight, maxWeightExercise };
  };
  const { maxWeight, maxWeightExercise } = getMaxWeightExercise(workouts);

  return (
    <div className="flex max-h-screen w-screen p-10">
      <div className="flex h-full max-h-[78vh] w-full flex-col space-y-3">
        {/* Profile */}
        <div className="flex h-[20vh] w-full border-2 border-solid border-border bg-background">
          <div className="flex h-full w-full flex-col border-2 border-solid border-border">
            <div className="flex space-x-4">
              <div className="mr-10">{profile?.avatar_url || ""}</div>
              <div>Name: {profile?.display_name}</div>
            </div>

            <div className="text-sm flex flex-col space-y-0">
              <div>Public workouts</div>
              <div>
                Total reps:{" "}
                {workouts
                  ?.flatMap((workout) => workout.exercises)
                  .flatMap((exercise) => exercise.sets)
                  .reduce((sum, set) => sum + set.reps, 0)}
              </div>
              <div>
                Longest workout:{" "}
                {Math.max(
                  ...(workouts?.map((workout) => workout.duration) || []),
                ) ?? 0}
              </div>
              <div>
                Highest rep count: {maxRepsExercise}-{maxRep}
              </div>
              <div>
                Highest weight lifted: {maxWeightExercise}-{maxWeight} kg
              </div>
            </div>
          </div>
        </div>

        {/* Workouts */}
        <div className="flex h-[80vh] w-full border-2 border-solid border-border bg-background">
          <div className="h-full w-[35%] border-2 border-solid border-border">
            calendar
          </div>
          <div className="h-full w-[65%] border-2 border-solid border-border">
            workoutDetails
          </div>
        </div>
      </div>
    </div>
  );
}
