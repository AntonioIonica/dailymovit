/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import CalendarContainer from "@/components/CalendarContainer";

type Workout = {
  id: string;
  name: string;
  duration: number;
  completed_at: number | string;
  public: boolean;
  exercises: Array<{
    id: string;
    name: string;
    notes: string;
    sets: Array<{
      id: string;
      set_number: number;
      reps: number;
      duration: number;
      weight: number;
      rest_time: number;
      rpe: number;
    }>;
  }>;
};

export type Workouts = Workout[] | null;

type DateValuePiece = Date | null;

export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

// Takes the time from the database and format it to reverse order in a more pleasand way
export function parseLocalTime(timeData: string) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let currentTime = moment().tz(timezone).format(timeData);
  const localDate = currentTime.split("T")[0];
  const localHour = currentTime.split("T")[1];
  currentTime = localHour.split(".")[0] + "---" + localDate;

  return currentTime;
}

// The button clicked sets the index to open the dialog below
export function toggleWorkouts(
  index: number,
  setWorkout: React.Dispatch<React.SetStateAction<number | null>>,
  workout: number | null,
) {
  setWorkout(workout === index ? null : index);
}

// The button clicked sets the index to open the dialog below
export function toggleExercises(
  index: number,
  setExercise: React.Dispatch<React.SetStateAction<number | null>>,
  exercise: number | null,
  openWorkout: number,
) {
  if (openWorkout !== null) {
    setExercise(exercise === index ? null : index);
  }
}

const MovsList = () => {
  const [openWorkout, setOpenWorkout] = useState<null | number>(null);
  const [openExercise, setOpenExercise] = useState<null | number>(null);
  const [dateValue, setDateValue] = useState<DateValue>(new Date());
  const [dayWorkouts, setDayWorkouts] = useState<Workouts | null>(null);
  const [allWorkouts, setAllWorkouts] = useState<Workouts | []>([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>();
  const params = useParams<{ id: string }>();

  // get the current logged user
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };

    fetchUser();
  }, []);

  // Fetch all the account workouts
  useEffect(() => {
    const fetchAllWorkouts = async () => {
      try {
        const res = await fetch(`/api/workouts`);

        if (!res.ok) {
          setAllWorkouts([]);
          return;
        }

        const data = await res.json();
        setAllWorkouts(data.workouts ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllWorkouts();
  }, []);

  // Fetch only the selected date workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      setWorkoutsLoading(true);

      const dateString = moment(dateValue as Date).format("YYYY-MM-DD");

      try {
        const res = await fetch(`/api/workouts?date=${dateString}`);

        if (!res.ok) {
          setDayWorkouts(null);
          return;
        }

        const data = await res.json();
        setDayWorkouts(data.workouts ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setWorkoutsLoading(false);
      }
    };

    fetchWorkouts();
  }, [dateValue]);

  if (userId !== params.id) {
    return <div>You are not logged in!</div>;
  }

  return (
    <div className="flex flex-col max-h-screen min-h-[78vh] w-screen px-10">
      {/* Streaks and general info */}
      <div className="streaks flex w-full h-[30vh] border-2 border-solid border-cyan-100">
        {/* Streaks */}
        <div className="flex w-[60%] border-2 border-solid border-cyan-100">
          <div>Streaks</div>
        </div>

        {/* General info */}
        <div className="flex flex-col w-[40%] border-2 border-solid border-cyan-100 p-3 space-y-3">
          <div>Number of workouts: {allWorkouts?.length ?? 0}</div>
          <div>
            Total reps:{" "}
            {allWorkouts
              ?.flatMap((workout) => workout.exercises)
              .flatMap((exercise) => exercise.sets)
              .reduce((sum, set) => sum + set.reps, 0) ?? 0}
          </div>
          <div>
            Longest workout:{" "}
            {Math.max(
              ...(allWorkouts?.map((workout) => workout.duration) as any[]),
            ) ?? 0}
          </div>
          <div>
            Highest reps count:{" "}
            {Math.max(
              ...(allWorkouts
                ?.flatMap((workout) => workout.exercises)
                .flatMap((exercise) =>
                  exercise.sets.map((set) => set.reps),
                ) as any[]),
            ) ?? 0}
          </div>
          <div>
            Heaviest weight:{" "}
            {Math.max(
              ...(allWorkouts
                ?.flatMap((workout) => workout.exercises)
                .flatMap((exercise) =>
                  exercise.sets.map((set) => set.weight),
                ) as any[]),
            ) ?? 0}{" "}
            kg
          </div>
        </div>
      </div>

      {/* Container for workouts and calendar */}
      <div className="flex w-full h-[54vh]">
        {/* Calendar */}
        <div className="w-[40%] border-2 border-solid border-cyan-100">
          <CalendarContainer
            dateValue={dateValue}
            setDateValue={setDateValue}
            allWorkouts={allWorkouts}
            calSize="largeCal"
          />
        </div>

        {/* Workouts list */}
        <div className="border-2 border-solid border-cyan-100 w-[60%] h-full text-lg">
          <div className="w-[100%] h-full max-h-[64vh] overflow-y-auto">
            <div className="container flex flex-col items-start w-full space-y-0">
              {!workoutsLoading ? (
                dayWorkouts?.map((workout, index) => (
                  <div
                    className="w-full rounded-sm px-4 flex flex-col"
                    key={index}
                  >
                    <button
                      onClick={() =>
                        toggleWorkouts(index, setOpenWorkout, openWorkout)
                      }
                      className="accordion w-full text-start font-bold text-md"
                    >
                      {workout?.name}
                    </button>

                    {/* Details of eah workout */}
                    {openWorkout === index && (
                      <div className="panel overflow-hidden flex-col w-full">
                        {/* Workout details */}
                        <div className="flex w-full space-x-6">
                          <span>Duration: {workout?.duration} sec</span>
                          <span className="italic">
                            Completed at:{" "}
                            {parseLocalTime(workout!.completed_at.toString())}
                          </span>
                        </div>

                        {/* Exercises details */}
                        <div className="flex w-full flex-col">
                          <div className="flex flex-col">
                            {workout?.exercises.map((exercises, index) => (
                              <div key={index} className="flex flex-col w-full">
                                <div className="flex space-x-4 ml-4">
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
                                    {exercises.name}
                                  </button>
                                  {exercises.notes && (
                                    <span>Notes: {exercises.notes}</span>
                                  )}
                                </div>
                                {openExercise === index && (
                                  <div className="flex flex-col text-sm ml-6">
                                    {exercises.sets.map((set, index) => (
                                      <ul
                                        key={index}
                                        className="flex items-center justify-between"
                                      >
                                        <li>Set: {set.set_number || "-"}</li>
                                        <li>Reps: {set.reps || "-"}</li>
                                        <li>Duration: {set.duration || "-"}</li>
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
  );
};

export default MovsList;
