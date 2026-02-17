/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import moment from "moment-timezone";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import CalendarContainer from "@/components/CalendarContainer";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import _ from "lodash";

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
  const [exerciseChart, setExerciseChart] = useState<any>(null);

  const params = useParams<{ id: string }>();

  // Setting data for the chart
  const dateWorkoutChart = useCallback(
    (workouts: Workouts) => {
      if (!workouts) {
        return null;
      }
      const exerciseChartField: any[] = [];

      // Get the exercise name by the open dialogs
      const exerciseName =
        workouts?.[openWorkout! || 0]?.exercises?.[openExercise! || 0]?.name;

      allWorkouts?.forEach((workout) =>
        workout.exercises.forEach((exercise) => {
          // For the exercises (from all) where it's included the active one
          if (exercise.name.includes(exerciseName!)) {
            const repsArray = exercise.sets.map((set) => set.reps);

            exerciseChartField.push({
              reps: _.mean(repsArray || 0),
              date: workout.completed_at.toString().split("T")[0],
              name: exercise.name,
            });
          }
        }),
      );
      // Sorting by date using Lodash asc
      const sortedDataForChart = _.sortBy(exerciseChartField, "date");
      // Get only the last 7 days
      setExerciseChart(sortedDataForChart.slice(-7, sortedDataForChart.length));
    },
    [openExercise, openWorkout, allWorkouts],
  );

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
    setWorkoutsLoading(true);
    if (!dateValue) return;

    const dateString = moment(dateValue as Date).format("YYYY-MM-DD");

    try {
      if (!allWorkouts) return;

      const data = allWorkouts?.filter((workout) => {
        if (
          dateString ==
          moment(workout.completed_at.toString()).format("YYYY-MM-DD")
        ) {
          return workout;
        }
      });

      if (!data) return;

      setDayWorkouts(data ?? null);
      dateWorkoutChart(data ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setWorkoutsLoading(false);
    }
  }, [dateValue, dateWorkoutChart, allWorkouts]);

  if (userId !== params.id) {
    return <div>You are not logged in!</div>;
  }

  // Customize the charts last date
  const CustomTick = (props: any) => {
    const { x, y, payload, index, visibleTicksCount } = props;

    const isLast = index === visibleTicksCount - 1;

    return (
      <text
        x={x}
        y={y}
        dy={16}
        textAnchor="middle"
        fill={isLast ? "#a1cb9f" : "#ffffff"}
        fontWeight={isLast ? "bold" : "normal"}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="flex max-h-screen min-h-[78vh] w-screen flex-col space-y-3 px-10">
      {/* Charts and general info */}
      <div className="streaks flex h-[30vh] w-full space-x-3">
        {/* Charts */}
        <div className="card glow flex w-[60%]">
          <div className="flex max-h-[100%] w-[100%] items-center justify-center p-2">
            <LineChart
              style={{
                width: "100%",
                aspectRatio: "auto",
                maxWidth: "100%",
                height: "100%",
              }}
              responsive
              data={exerciseChart || []}
            >
              <CartesianGrid />
              <Line
                dataKey="reps"
                name="Average exercise reps"
                type="monotone"
              />
              <XAxis dataKey="date" tick={<CustomTick />} />
              <YAxis dataKey="reps" />
              <Legend />
              <RechartsDevtools />
            </LineChart>
          </div>
        </div>

        {/* General info */}
        <div className="card glow flex w-[40%] flex-col space-y-3 bg-primary-foreground px-6 py-3">
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
              ...(allWorkouts?.map((workout) => workout.duration) || []),
            ) ?? 0}
          </div>
          <div>
            Highest reps count:{" "}
            {Math.max(
              ...(allWorkouts
                ?.flatMap((workout) => workout.exercises)
                .flatMap((exercise) => exercise.sets.map((set) => set.reps)) ||
                []),
            ) ?? 0}
          </div>
          <div>
            Heaviest weight:{" "}
            {Math.max(
              ...(allWorkouts
                ?.flatMap((workout) => workout.exercises)
                .flatMap((exercise) =>
                  exercise.sets.map((set) => set.weight),
                ) || []),
            ) ?? 0}{" "}
            kg
          </div>
        </div>
      </div>

      {/* Container for workouts and calendar */}
      <div className="flex h-[54vh] w-full space-x-3">
        {/* Calendar */}
        <div className="card glow w-[40%] bg-primary-foreground">
          <CalendarContainer
            dateValue={dateValue}
            setDateValue={setDateValue}
            allWorkouts={allWorkouts}
            calSize="largeCal"
          />
        </div>

        {/* Workouts list */}
        <div className="card glow h-full w-[60%] bg-primary-foreground text-lg">
          <div className="h-full max-h-[64vh] w-[100%] overflow-y-auto">
            <div className="container flex w-full flex-col items-start space-y-0">
              {!workoutsLoading ? (
                dayWorkouts?.map((workout, index) => (
                  <div
                    className="flex w-full flex-col rounded-sm px-4"
                    key={index}
                  >
                    <button
                      onClick={() =>
                        toggleWorkouts(index, setOpenWorkout, openWorkout)
                      }
                      className="text-md w-full text-start font-bold"
                    >
                      - {workout?.name}
                    </button>

                    {/* Details of each workout */}
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

                        {/* Exercises details */}
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
                                    {exercise.sets.map((set, index) => (
                                      <ul
                                        key={index}
                                        className="flex w-full items-center justify-between px-3"
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
