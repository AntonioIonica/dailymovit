"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  parseLocalTime,
  toggleExercises,
  toggleWorkouts,
  Workouts,
} from "../[id]/page";
import { DateValue } from "../[id]/page";
import CalendarContainer from "@/components/CalendarContainer";
import moment from "moment-timezone";
import { useQuery } from "@tanstack/react-query";

const CreateMov = () => {
  const [workout, setWorkout] = useState({
    name: "New Workout",
    duration: 0,
    public: true,
  });
  const [exercises, setExercises] = useState([
    {
      exerciseName: "New exercise",
      notes: "",
      sets: [
        {
          reps: 1,
          duration: 0,
          rest_time: 0,
          set_number: 1,
          weight: 0,
          rpe: 1,
        },
      ],
    },
  ]);
  const [activeExercise, setActiveExercise] = useState<number>(0);
  const [activeSet, setActiveSet] = useState<number>(0);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [workDuration, setWorkDuration] = useState<number>(0);
  const [restDuration, setRestDuration] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<DateValue>(new Date());
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [dayWorkouts, setDayWorkouts] = useState<Workouts | null>(null);
  const [openWorkout, setOpenWorkout] = useState<null | number>(null);
  const [openExercise, setOpenExercise] = useState<null | number>(null);

  const {
    // isPending,
    isFetching,
    data: workoutsData,
    // error,
  } = useQuery({
    queryKey: ["workouts"],
    queryFn: async (): Promise<Workouts> => {
      const res = await fetch("/api/workouts");
      const result = await res.json();

      // API returning workouts
      return result.workouts;
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isBreak) {
      timer = setTimeout(() => {
        if (workDuration < 10000) {
          setWorkDuration((prev) => prev + 1);
        }
      }, 1000);
    }

    if (isBreak && !isRunning) {
      timer = setTimeout(() => {
        if (restDuration < 500) {
          setRestDuration((prev) => prev + 1);
        }
      }, 1000);
    }

    if (!isBreak && !isRunning) {
      setWorkDuration((prev) => prev);
      setRestDuration((prev) => prev);
    }

    return () => clearInterval(timer);
  }, [isBreak, restDuration, isRunning, workDuration]);

  // Fetch only the selected date workouts
  useEffect(() => {
    setWorkoutsLoading(true);

    if (!dateValue) return;

    const dateString = moment(dateValue as Date).format("YYYY-MM-DD");

    try {
      if (!workoutsData) return;

      const data = workoutsData?.filter((workout) => {
        if (
          dateString ==
          moment(workout?.completed_at.toString()).format("YYYY-MM-DD")
        ) {
          return workout;
        }
      });
      setDayWorkouts(data as Workouts);
    } catch (error) {
      console.error(error);
    } finally {
      setWorkoutsLoading(false);
    }
  }, [dateValue, workoutsData]);

  function initialTimer() {
    setIsBreak(false);
    setIsRunning(false);
    setWorkDuration(0);
    setRestDuration(0);
  }

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
    } else {
      dialogRef.current.showModal();
    }
  }

  function handleWorkoutName(event: { target: { value: string } }) {
    setWorkout({ ...workout, name: event.target.value });
  }

  function handleExerciseName(
    index: number,
    event: { target: { value: string } },
  ) {
    const exercisesField = [...exercises];
    exercisesField[index].exerciseName = event.target.value;
    setExercises(exercisesField);
  }

  function addExercise() {
    const exercisesField = [...exercises];
    exercisesField[activeExercise].sets[activeSet].duration = workDuration;
    exercisesField[activeExercise].sets[activeSet].rest_time = restDuration;
    exercisesField.push({
      exerciseName: "New exercise",
      notes: "",
      sets: [
        {
          reps: 1,
          duration: 0,
          rest_time: 0,
          set_number: 1,
          weight: 0,
          rpe: 1,
        },
      ],
    });
    setExercises(exercisesField);
    setActiveExercise(exercisesField.length - 1);
    setActiveSet(0);
    initialTimer();
  }

  function deleteExercise(exerciseIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField.length > 1) {
      exercisesField.splice(exerciseIndex, 1);
      setActiveExercise(exercisesField.length - 1);
    }
    initialTimer();
    setExercises(exercisesField);
  }

  function handleSetRep(
    exerciseIndex: number,
    setIndex: number,
    event: { target: { value: string } },
  ) {
    setActiveExercise(exerciseIndex);
    setActiveSet(setIndex);
    const exercisesField = [...exercises];
    exercisesField[exerciseIndex].sets[setIndex].reps = +event.target.value;
    setExercises(exercisesField);
  }

  function addSet(exerciseIndex: number) {
    const exercisesField = [...exercises];
    exercisesField[activeExercise].sets[activeSet].duration = workDuration;
    exercisesField[activeExercise].sets[activeSet].rest_time = restDuration;

    // Last set
    const lastSetNumber =
      exercisesField[exerciseIndex].sets[
        exercisesField[exerciseIndex].sets.length - 1
      ].set_number || 0;

    exercisesField[exerciseIndex].sets.push({
      reps: 1,
      duration: 0,
      rest_time: 0,
      set_number: lastSetNumber + 1,
      weight: 0,
      rpe: 1,
    });

    setExercises(exercisesField);
    setActiveSet((prev) => prev + 1);
    initialTimer();
  }

  function deleteSet(exerciseIndex: number, setIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField[exerciseIndex].sets.length > 1) {
      exercisesField[exerciseIndex].sets.splice(setIndex, 1);
      if (activeSet >= exercises[activeExercise].sets.length) {
        setActiveSet((prev) => prev - 1);
      }
    }
    setExercises(exercisesField);
  }

  function incrementRep() {
    const exercisesField = [...exercises];
    if (exercisesField[activeExercise].sets[activeSet].reps < 30) {
      exercisesField[activeExercise].sets[activeSet].reps += 1;
    }
    setExercises(exercisesField);
  }

  function decrementRep() {
    const exercisesField = [...exercises];
    if (exercisesField[activeExercise].sets[activeSet].reps > 1) {
      exercisesField[activeExercise].sets[activeSet].reps -= 1;
    }
    setExercises(exercisesField);
  }

  function handleSetWeight(
    activeExercise: number,
    activeSet: number,
    event: { target: { value: string } },
  ): void {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].sets[activeSet].weight = +event.target.value;
    setExercises(exerciseField);
  }

  function handleSetNotes(
    activeExercise: number,
    event: { target: { value: string } },
  ) {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].notes = event.target.value;
    setExercises(exerciseField);
  }

  function handleSetRpe(
    activeExercise: number,
    activeSet: number,
    event: { target: { value: string } },
  ): void {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].sets[activeSet].rpe = +event.target.value;
    setExercises(exerciseField);
  }

  function handleStartTimer() {
    if (!isRunning && !isBreak) {
      setIsRunning(true);
      setIsBreak(false);
    }
  }

  function handleStopTimer() {
    if (isRunning) {
      setIsRunning(false);
      if (workDuration != 0) setIsBreak(true);
    }
  }

  const handleFinishWorkout = async (event: FormEvent) => {
    event.preventDefault();

    const workoutField = { ...workout };
    const exercisesField = [...exercises];
    exercisesField[activeExercise].sets[activeSet].duration = workDuration;
    exercisesField[activeExercise].sets[activeSet].rest_time = restDuration;

    // Get the sum of all the sets duration from all the exercises
    const workDurationSets = exercisesField.reduce(
      (sum, exercise) =>
        sum +
        exercise.sets.reduce((setSum, set) => setSum + Number(set.duration), 0),
      0,
    );
    const restTimeSets = exercisesField.reduce(
      (sum, exercise) =>
        sum +
        exercise.sets.reduce(
          (setSum, set) => setSum + Number(set.rest_time),
          0,
        ),
      0,
    );

    workoutField.duration = workDurationSets + restTimeSets;
    setWorkout(workoutField);
    const workoutValues = {
      workout: workoutField,
      exercises: exercisesField,
    };

    // Sending the workout data
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutValues),
    });

    setWorkout({
      name: "New Workout",
      duration: 0,
      public: true,
    });
    setExercises([
      {
        exerciseName: "New exercise",
        notes: "",
        sets: [
          {
            reps: 1,
            duration: 0,
            rest_time: 0,
            set_number: 1,
            weight: 0,
            rpe: 1,
          },
        ],
      },
    ]);

    setActiveExercise(0);
    setActiveSet(0);
    initialTimer();

    const result = await res.json();
    if (result.userId) {
      router.push(`/movs/${result.userId}`);
    }
  };

  return (
    <div className="flex h-[600px] max-h-screen w-screen px-10">
      <div className="mx-0 flex w-full px-0">
        {/* Side form */}
        <div className="card glow h-full w-[358px] flex-none items-center overflow-x-hidden overflow-y-hidden">
          <form onSubmit={handleFinishWorkout} className="w-full space-y-1">
            <label htmlFor="workoutName">
              Workout name: <span className="text-sm">*editable</span>
            </label>
            <input
              id="workoutName"
              name="workoutName"
              type="text"
              value={workout.name}
              maxLength={25}
              placeholder="New workout..."
              onChange={(e) => handleWorkoutName(e)}
              className="w-full rounded-sm pl-6 focus:scale-[101%] focus:rounded-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center">
              <label htmlFor="publicCheckbox">Public workout: </label>
              <input
                id="publicCheckbox"
                name="publicCheckbox"
                type="checkBox"
                className="ml-4 h-5 w-5 accent-primary"
                defaultChecked={true}
              />
            </div>

            {exercises.map((exercise, exerciseIndex) => (
              <div
                className={`p-2 ${
                  exerciseIndex == activeExercise
                    ? "rounded-sm border-2 border-solid border-primary"
                    : ""
                }`}
                key={exerciseIndex}
              >
                <div className="flex w-full flex-col">
                  <input
                    value={exercise.exerciseName}
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => handleExerciseName(exerciseIndex, e)}
                    className="mb-2 w-full rounded-sm pl-2 focus:scale-[101%] focus:rounded-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className={`containerSet ml-3 ${
                        setIndex == activeSet && exerciseIndex == activeExercise
                          ? "rounded-sm border-2 border-solid border-primary"
                          : ""
                      }`}
                    >
                      <div className="wrapperSet mx-2 flex justify-between space-x-4">
                        <div className="flex items-center justify-between space-x-2 text-sm">
                          <div className="mr-2">{set.set_number}.</div>
                          <div>Reps: {set.reps}</div>
                          <div>Time: {set.duration}&apos;</div>
                          <div>Weight: {set.weight}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSet(exerciseIndex, setIndex)}
                          className="mr-auto font-bold text-primary hover:scale-125 hover:outline-none"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => deleteExercise(exerciseIndex)}
                    className="ml-auto mt-2 rounded-sm bg-primary px-2 py-1 font-bold text-gray-900 hover:scale-105 hover:bg-secondary"
                  >
                    Delete exercise
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 rounded-md bg-primary px-3 py-2 font-semibold uppercase text-gray-900 hover:scale-105 hover:bg-secondary"
              >
                Send the mov
              </button>
            </div>
          </form>
        </div>

        {/* Central console */}
        <div className="card glow mx-4 h-full w-[16rem] flex-auto flex-col p-2">
          <div className="flex flex-col items-center">
            {/* Exercise name */}
            <input
              type="text"
              maxLength={25}
              placeholder="New workout..."
              value={exercises[activeExercise].exerciseName}
              onChange={(e) => handleExerciseName(activeExercise, e)}
              className="mt-2 rounded-sm py-2 text-center text-lg focus:scale-[101%] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Exercise duration */}
            <div className="mt-4 flex max-w-[100%] items-center justify-between space-x-16">
              <div className="flex max-w-full flex-col space-y-2">
                <span>Work time: {workDuration} s</span>
                <button
                  className="btn bg-secondary px-1 py-0.5 font-semibold"
                  disabled={isRunning}
                  onClick={handleStartTimer}
                >
                  Start
                </button>
              </div>

              <div className="flex max-w-full flex-col space-y-2">
                <span>Rest time: {restDuration} s</span>
                <button
                  className="btn px-1 py-0.5 font-semibold"
                  disabled={isBreak}
                  onClick={handleStopTimer}
                >
                  Pause
                </button>
              </div>
            </div>

            {/* Central reps */}
            <div className="my-3 flex items-center justify-center">
              <button
                className="flex items-center justify-center px-4 py-4 text-5xl"
                onClick={decrementRep}
              >
                -
              </button>
              <div className="flex w-[15rem] items-center justify-center p-10 text-7xl">
                {exercises[activeExercise].sets[activeSet].reps}
              </div>
              <button
                className="flex items-center justify-center px-4 py-4 text-5xl"
                onClick={incrementRep}
              >
                +
              </button>
            </div>
            {/* Reps range */}
            <input
              type="range"
              value={exercises[activeExercise].sets[activeSet].reps}
              onChange={(e) => handleSetRep(activeExercise, activeSet, e)}
              min={1}
              max={30}
              className="scale-[230%] accent-primary"
            />

            {/* Set details */}
            <div className="mt-12 flex w-full items-center justify-center space-x-8">
              <div className="flex flex-col items-center space-y-0">
                <label htmlFor="rpe">
                  RPE: {exercises[activeExercise].sets[activeSet].rpe}
                </label>
                <div>
                  <input
                    type="range"
                    name="rpe"
                    id="rpe"
                    className="w-16 accent-primary"
                    value={exercises[activeExercise].sets[activeSet].rpe}
                    min={1}
                    max={10}
                    onChange={(e) => handleSetRpe(activeExercise, activeSet, e)}
                  />
                </div>
              </div>

              <button
                onClick={() => addSet(activeExercise)}
                type="button"
                className="btn px-3 py-3 font-semibold"
              >
                Finish set
              </button>

              {/* Weight container */}
              <span className="flex flex-col space-y-1">
                <input
                  className="flex max-w-16 items-center rounded-sm pl-2 focus:scale-[101%] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  type="number"
                  value={exercises[activeExercise]?.sets[activeSet]?.weight}
                  placeholder="KG/LB"
                  onChange={(e) =>
                    handleSetWeight(activeExercise, activeSet, e)
                  }
                  min={0}
                  max={1000}
                />
                <span>Kgs/Lbs</span>
              </span>
            </div>

            <div className="mt-4 flex flex-col space-y-4">
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleDialog}
                  className="btn !px-2 !py-1 font-semibold"
                >
                  Add note
                </button>
              </div>

              {/* Dialog for exercise notes */}
              <div className="absolute left-[50%] top-0">
                <dialog
                  className="rounded-md"
                  ref={dialogRef}
                  onClick={(e) => {
                    if (e.currentTarget === e.target) {
                      toggleDialog();
                    }
                  }}
                >
                  <div className="card glow flex flex-col items-center space-y-6 overflow-hidden px-6 py-4">
                    <div>How was your exercise?</div>
                    <textarea
                      onChange={(e) => handleSetNotes(activeExercise, e)}
                      placeholder="Notes..."
                      maxLength={100}
                      value={exercises[activeExercise].notes}
                      className="p-4"
                    />
                    <button type="button" onClick={toggleDialog}>
                      Close
                    </button>
                  </div>
                </dialog>
              </div>

              <button
                onClick={addExercise}
                type="button"
                className="btn mt-2 !px-4 !py-3 font-bold"
              >
                Next exercise
              </button>
            </div>
          </div>
        </div>

        {/* Calendar and details container */}
        <div className="card glow h-full w-[7rem] flex-auto flex-col items-center space-y-2 p-2">
          {/* Calendar  */}
          <div className="h-[32%] w-full">
            {!isFetching ? (
              <CalendarContainer
                dateValue={dateValue}
                setDateValue={setDateValue}
                workoutsData={workoutsData || []}
                calSize="smallCal"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                Loading...
              </div>
            )}
          </div>

          {/* Workout details */}
          <div className="h-[67%] max-h-[67%] w-full">
            <div className="h-full max-h-full w-[100%] overflow-y-auto">
              <div className="container flex w-full flex-col items-start space-y-0">
                {!workoutsLoading ? (
                  dayWorkouts?.map((workout, index) => (
                    <div
                      className="flex w-full flex-col rounded-sm border-2 border-solid border-primary px-4"
                      key={index}
                    >
                      <button
                        onClick={() =>
                          toggleWorkouts(index, setOpenWorkout, openWorkout)
                        }
                        className="text-md w-full text-start font-bold"
                      >
                        {workout?.name}
                      </button>

                      {/* Details of eah workout */}
                      {openWorkout === index && (
                        <div className="panel w-full flex-col overflow-hidden">
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
                                <div
                                  key={index}
                                  className="flex w-full flex-col"
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
                                      {exercises.name}
                                    </button>
                                    {exercises.notes && (
                                      <span>Notes: {exercises.notes}</span>
                                    )}
                                  </div>
                                  {openExercise === index && (
                                    <div className="ml-6 flex flex-col text-sm">
                                      {exercises.sets.map((set, index) => (
                                        <ul
                                          key={index}
                                          className="flex items-center justify-between"
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
                  <div className="flex items-center justify-center">
                    Loading...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateMov;
