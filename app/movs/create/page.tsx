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

export default function CreateMov() {
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
  const [allWorkouts, setAllWorkouts] = useState<Workouts | []>([]);
  const [dateValue, setDateValue] = useState<DateValue>(new Date());
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [dayWorkouts, setDayWorkouts] = useState<Workouts | null>(null);
  const [openWorkout, setOpenWorkout] = useState<null | number>(null);
  const [openExercise, setOpenExercise] = useState<null | number>(null);
  const [hasWorkoutsFetched, setHasWorkoutsFetched] = useState(false);

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
        // mark the selected date workouts fetched to not display -Please select a day- message
        setHasWorkoutsFetched(true);
      } catch (error) {
        console.error(error);
      } finally {
        setWorkoutsLoading(false);
      }
    };

    fetchWorkouts();
  }, [dateValue]);

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
    <div className="flex w-screen max-h-screen px-10">
      <div className="flex w-full px-0 mx-0">
        {/* Side form */}
        <div className="flex-none w-[22rem] items-center mt-10 mb-10 min-h-[78vh] max-h-[78vh] overflow-y-auto bg-primary-foreground p-2">
          <form onSubmit={handleFinishWorkout} className="space-y-1 w-full">
            <label htmlFor="workoutName">Workout name: </label>
            <input
              id="workoutName"
              name="workoutName"
              type="text"
              value={workout.name}
              maxLength={25}
              placeholder="New workout"
              onChange={(e) => handleWorkoutName(e)}
              className="w-full"
            />
            <div className="flex">
              <label htmlFor="publicCheckbox">Public workout</label>
              <input
                id="publicCheckbox"
                name="publicCheckbox"
                type="checkBox"
                className="m-auto"
                defaultChecked={true}
              />
            </div>

            {exercises.map((exercise, exerciseIndex) => (
              <div
                className={`containerExercise p-2 ${
                  exerciseIndex == activeExercise
                    ? "border-solid border-2 rounded-sm border-primary"
                    : ""
                }`}
                key={exerciseIndex}
              >
                <div className="wrapperExercise w-full flex flex-col">
                  <input
                    value={exercise.exerciseName}
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => handleExerciseName(exerciseIndex, e)}
                    className="w-full mb-1"
                  />
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className={`containerSet ml-4 ${
                        setIndex == activeSet && exerciseIndex == activeExercise
                          ? "border-solid border-2 rounded-sm border-primary"
                          : ""
                      }`}
                    >
                      <div className="wrapperSet flex justify-between space-x-4 mx-2">
                        <div className="flex items-center justify-between space-x-2 text-sm">
                          <div className="mr-2">{set.set_number}</div>
                          <div>Reps: {set.reps}</div>
                          <div>Time: {set.duration}&apos;</div>
                          <div>Weight: {set.weight}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSet(exerciseIndex, setIndex)}
                          className="mr-auto text-red-400 font-bold"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => deleteExercise(exerciseIndex)}
                    className="ml-auto mt-2"
                  >
                    Delete exercise
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100 mt-4"
              >
                Finish Workout
              </button>
            </div>
          </form>
        </div>

        {/* Central console */}
        <div className="flex-auto w-[16rem] flex-col mt-10 mb-10 mx-4 bg-primary-foreground p-2 min-h-[78vh]">
          <div className="flex flex-col items-center">
            <div className="border-4 border-solid rounded-md border-primary">
              <input
                type="text"
                value={exercises[activeExercise].exerciseName}
                onChange={(e) => handleExerciseName(activeExercise, e)}
                className="text-center py-2 text-lg"
              />
            </div>

            <div className="flex items-center justify-between w-[35%]">
              <div className="flex flex-col">
                <span>Work: {workDuration}</span>
                <button disabled={isRunning} onClick={handleStartTimer}>
                  Start
                </button>
              </div>

              <div className="flex flex-col">
                <span>Rest time: {restDuration}</span>
                <button disabled={isBreak} onClick={handleStopTimer}>
                  Take a break
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="flex items-center justify-center text-4xl"
                onClick={decrementRep}
              >
                -
              </button>
              <div className="flex items-center justify-center text-7xl p-10 w-[15rem]">
                {exercises[activeExercise].sets[activeSet].reps}
              </div>
              <button
                className="flex items-center justify-center text-4xl"
                onClick={incrementRep}
              >
                +
              </button>
            </div>
            <input
              type="range"
              value={exercises[activeExercise].sets[activeSet].reps}
              onChange={(e) => handleSetRep(activeExercise, activeSet, e)}
              min={1}
              max={30}
              className="scale-[250%]"
            />
            <div className="flex space-x-8 items-center mt-14">
              <div className="flex flex-col space-y-2 items-center">
                <input
                  type="range"
                  className="w-16"
                  value={exercises[activeExercise].sets[activeSet].rpe}
                  min={1}
                  max={10}
                  onChange={(e) => handleSetRpe(activeExercise, activeSet, e)}
                />
                {exercises[activeExercise].sets[activeSet].rpe}
              </div>
              <button
                onClick={() => addSet(activeExercise)}
                type="button"
                className="rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100"
              >
                Finish set
              </button>
              <span className="flex flex-col">
                <input
                  className="max-w-16 flex items-center"
                  type="number"
                  value={exercises[activeExercise]?.sets[activeSet]?.weight}
                  placeholder="KG/LB"
                  onChange={(e) =>
                    handleSetWeight(activeExercise, activeSet, e)
                  }
                  min={0}
                  max={1000}
                />
                Kgs/Lbs
              </span>
            </div>

            <div className="flex mt-4 space-x-4">
              <button type="button" onClick={toggleDialog}>
                Add note
              </button>
              {/* Dialog for exercise notes */}
              <div className="absolute top-0 left-[50%]">
                <dialog
                  className="rounded-md"
                  ref={dialogRef}
                  onClick={(e) => {
                    if (e.currentTarget === e.target) {
                      toggleDialog();
                    }
                  }}
                >
                  <div className="flex flex-col items-center space-y-6 px-6 py-4">
                    <div>How was your exercise?</div>
                    <textarea
                      onChange={(e) => handleSetNotes(activeExercise, e)}
                      placeholder="Notes..."
                      maxLength={100}
                      value={exercises[activeExercise].notes}
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
                className="rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100"
              >
                Finish exercise
              </button>
            </div>
          </div>
        </div>

        {/* Calendar and details container */}
        <div
          className="flex-auto flex-col w-[7rem] items-center mt-10 mb-10 
        min-h-[78vh] bg-primary-foreground p-2 space-y-2"
        >
          {/* Calendar  */}
          <div className="w-full h-[32%]">
            <CalendarContainer
              dateValue={dateValue}
              setDateValue={setDateValue}
              allWorkouts={allWorkouts}
              calSize="smallCal"
            />
          </div>

          {/* Workout details */}
          <div className="w-full max-h-[67%] h-[67%]">
            <div className="w-[100%] h-full max-h-full overflow-y-auto">
              <div className="container flex flex-col items-start w-full space-y-0">
                {!hasWorkoutsFetched ? (
                  <div className="flex justify-center items-center">
                    Please select a day
                  </div>
                ) : dayWorkouts === null ? (
                  <div>No workouts found</div>
                ) : !workoutsLoading ? (
                  dayWorkouts?.map((workout, index) => (
                    <div
                      className="w-full border-2 border-solid 
                    rounded-sm border-primary px-4 flex flex-col"
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
                                <div
                                  key={index}
                                  className="flex flex-col w-full"
                                >
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
}
