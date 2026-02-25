"use client";

import {
  DateValue,
  parseLocalTime,
  toggleExercises,
  toggleWorkouts,
  Workouts,
} from "@/app/movs/[id]/page";
import CalendarContainer from "@/components/CalendarContainer";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-timezone";
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

  const [dateValue, setDateValue] = useState<DateValue>(new Date());
  const [dayWorkouts, setDayWorkouts] = useState<Workouts | null>(null);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [openWorkout, setOpenWorkout] = useState<number | null>(null);
  const [openExercise, setOpenExercise] = useState<number | null>(null);

  const {
    // isPending,
    isFetching,
    data: fetchedData,
    // error,
  } = useQuery({
    queryKey: ["workoutsAndProfile"],
    queryFn: async (): Promise<{
      workoutData: Workouts;
      userData: ProfileType;
    }> => {
      const res = await fetch(`/api/public-profile/${params.user_name}`);
      const result = await res.json();

      return result.data;
    },
  });
  console.log(fetchedData);

  // Set the daily selected workouts
  useEffect(() => {
    setWorkoutsLoading(true);
    if (!dateValue) return;

    const dateString = moment(dateValue as Date).format("YYYY-MM-DD");

    try {
      if (!fetchedData?.workoutData) return;

      const data = fetchedData?.workoutData?.filter((workout) => {
        if (
          dateString ==
          moment(workout.completed_at.toString()).format("YYYY-MM-DD")
        ) {
          return workout;
        }
      });

      if (!data) return;

      setDayWorkouts(data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setWorkoutsLoading(false);
    }
  }, [dateValue, fetchedData?.workoutData]);

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
  const { maxRep, maxRepsExercise } = getMaxRepExercise(
    fetchedData?.workoutData || [],
  );

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
  const { maxWeight, maxWeightExercise } = getMaxWeightExercise(
    fetchedData?.workoutData || [],
  );

  return (
    <div className="flex h-full max-h-screen w-screen">
      <div className="flex h-full max-h-[85vh] w-full flex-col space-y-3 px-10">
        {/* Profile */}
        <div className="card glow flex h-[250px] w-full">
          <div className="flex h-full w-full flex-col p-2">
            <div className="flex space-x-4">
              <div className="mr-10">
                {fetchedData?.userData?.avatar_url || ""}
              </div>
              <div className="flex space-x-2">
                <span>Name:</span>
                <span className="text-gray-200">
                  {fetchedData?.userData?.display_name}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-0 text-sm">
              <div className="ml-4 font-bold">Public workouts</div>
              <div>
                Total reps:{" "}
                {fetchedData?.workoutData
                  ?.flatMap((workout) => workout.exercises)
                  .flatMap((exercise) => exercise.sets)
                  .reduce((sum, set) => sum + set.reps, 0)}
              </div>
              <div>
                Longest workout:{" "}
                {Math.max(
                  ...(fetchedData?.workoutData?.map(
                    (workout) => workout.duration,
                  ) || []),
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

          <div className="flex w-[750px] items-center justify-center space-x-4">
            <span>Share my profile: {"  "}</span>
            <button
              className="rounded-md border-2 border-solid border-border p-1"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_VERCEL_URL}/profile/${params.user_name}`,
                );
                alert(
                  `Copied: ${`${process.env.NEXT_PUBLIC_VERCEL_URL}/profile/${params.user_name}`}`,
                );
              }}
            >
              {`${process.env.NEXT_PUBLIC_VERCEL_URL}/profile/${params.user_name}`}
            </button>
          </div>
        </div>

        {/* Workouts */}
        <div className="flex h-[750px] w-full space-x-3">
          <div className="card glow h-full w-[40%]">
            <CalendarContainer
              dateValue={dateValue}
              setDateValue={setDateValue}
              workoutsData={fetchedData?.workoutData || []}
              calSize="largeCal"
            />
          </div>

          {/* Workouts list */}
          <div className="card glow h-[100%] w-[60%]">
            <div className="h-[100%] max-h-[64vh] w-[100%] overflow-y-auto">
              <div className="container flex w-[100%] flex-col items-start space-y-0">
                {!workoutsLoading ? (
                  dayWorkouts?.map((workout, index) => (
                    <div
                      key={index}
                      className="flex w-full flex-col rounded-sm px-4"
                    >
                      <button
                        className="text-md w-full text-start font-bold"
                        onClick={() => {
                          toggleWorkouts(index, setOpenWorkout, openWorkout);
                        }}
                      >
                        - {workout?.name}
                      </button>

                      {/* Details of workouts */}
                      {openWorkout === index && (
                        <div className="w-full flex-col overflow-hidden">
                          {/* Workout details */}
                          <div className="flex w-full space-x-6">
                            <span>Duration: {workout?.duration} sec</span>
                            <span className="italic">
                              Completed at:{" "}
                              {parseLocalTime(workout!.completed_at.toString())}
                            </span>
                          </div>

                          {/* Exercise details */}
                          <div className="flex w-full flex-col">
                            <div className="flex flex-col">
                              {workout?.exercises.map((exercise, index) => (
                                <div
                                  key={index}
                                  className={`flex w-full flex-col px-2 py-1 ${index === openExercise ? "rounded-sm border-2 border-solid border-[#a1cb9f]" : ""}`}
                                >
                                  <div className="ml-4 flex space-x-4">
                                    <button
                                      className="underline"
                                      onClick={() =>
                                        toggleExercises(
                                          index,
                                          setOpenExercise,
                                          openExercise,
                                          openWorkout,
                                        )
                                      }
                                    >
                                      {exercise.name}
                                    </button>
                                    {exercise.notes && (
                                      <span>Notes: {exercise.notes}</span>
                                    )}
                                  </div>

                                  {openExercise === index && (
                                    <div className="ml-8 flex flex-col text-sm">
                                      {exercise?.sets.map((set, index) => (
                                        <ul
                                          key={index}
                                          className="flex w-full items-center justify-between px-3"
                                        >
                                          <li>Set: {set.set_number || "-"}</li>
                                          <li>Reps: {set.reps || "-"}</li>
                                          <li>
                                            Duration: {set.duration || "-"}
                                          </li>
                                          <li>
                                            Rest time: {set.rest_time || "-"}
                                          </li>
                                          <li>Weight: {set.weight || "-"}</li>
                                          <li>RPE: {set.rpe || "-"}</li>
                                        </ul>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
