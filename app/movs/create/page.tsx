"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

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
      sets: [{ reps: 1, duration: 0, rest_time: 0, set_number: 1, weight: 0, rpe: 1 }],
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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && !isBreak) {
      timer = setTimeout(() => {
        if (workDuration < 10000) {
          setWorkDuration(prev => prev + 1);
        };
      }, 1000);
    };

    if (isBreak && !isRunning) {
      timer = setTimeout(() => {
        if (restDuration < 500) {
          setRestDuration(prev => prev + 1);
        };
      }, 1000);
    };

    if (!isBreak && !isRunning) {
      setWorkDuration(prev => prev);
      setRestDuration(prev => prev);
    }

    return () => clearInterval(timer);
  }, [isBreak, restDuration, isRunning, workDuration]);

  function initialTimer() {
    setIsBreak(false);
    setIsRunning(false);
    setWorkDuration(0);
    setRestDuration(0);
  }

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    };

    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
    } else {
      dialogRef.current.showModal();
    };
  };

  function handleWorkoutName(event: { target: { value: string } }) {
    setWorkout({ ...workout, name: event.target.value });
  };

  function handleExerciseName(
    index: number,
    event: { target: { value: string } }
  ) {
    const exercisesField = [...exercises];
    exercisesField[index].exerciseName = event.target.value;
    setExercises(exercisesField);
  };

  function addExercise() {
    setExercises([
      ...exercises,
      {
        exerciseName: "New exercise",
        notes: "",
        sets: [{ reps: 1, duration: 0, rest_time: 0, set_number: 1, weight: 0, rpe: 1 }],
      },
    ]);
    setActiveExercise(prev => prev + 1);
    initialTimer();
    setActiveSet(0);
  };

  function deleteExercise(exerciseIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField.length > 1) {
      exercisesField.splice(exerciseIndex, 1);
      if (activeExercise > 0) {
        setActiveExercise(prev => prev - 1);
      };
    };
    initialTimer();
    setExercises(exercisesField);
  };

  function handleSetRep(
    exerciseIndex: number,
    setIndex: number,
    event: { target: { value: string } }
  ) {
    setActiveExercise(exerciseIndex);
    setActiveSet(setIndex);
    const exercisesField = [...exercises];
    exercisesField[exerciseIndex].sets[setIndex].reps = +event.target.value;
    setExercises(exercisesField);
  };

  function addSet(exerciseIndex: number) {
    const exercisesField = [...exercises];
    exercisesField[activeExercise].sets[activeSet].duration = workDuration || 0;
    exercisesField[activeExercise].sets[activeSet].rest_time = restDuration || 0;

    exercisesField[exerciseIndex].sets.push({
      reps: 1,
      duration: 0,
      rest_time: 0,
      set_number: exercisesField[exerciseIndex].sets[activeSet].set_number + 1,
      weight: 0,
      rpe: 1
    });

    setExercises(exercisesField);
    setActiveSet(prev => prev + 1);
    initialTimer();
  };

  function deleteSet(exerciseIndex: number, setIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField[exerciseIndex].sets.length > 1) {
      exercisesField[exerciseIndex].sets.splice(setIndex, 1);
      if (activeSet > 0) {
        setActiveSet(prev => prev - 1);
      };
    }
    setExercises(exercisesField);
  };

  function incrementRep() {
    const exercisesField = [...exercises];
    if (exercisesField[activeExercise].sets[activeSet].reps < 30) {
      exercisesField[activeExercise].sets[activeSet].reps += 1;
    };
    setExercises(exercisesField);
  };

  function decrementRep() {
    const exercisesField = [...exercises];
    if (exercisesField[activeExercise].sets[activeSet].reps > 1) {
      exercisesField[activeExercise].sets[activeSet].reps -= 1;
    };
    setExercises(exercisesField);
  };

  function handleSetWeight(activeExercise: number, activeSet: number, event: { target: { value: string } }): void {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].sets[activeSet].weight = +event.target.value;
    setExercises(exerciseField);
  };

  function handleSetNotes(activeExercise: number, event: { target: { value: string } }) {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].notes = event.target.value;
    setExercises(exerciseField);
  };

  function handleSetRpe(activeExercise: number, activeSet: number, event: { target: { value: string } }): void {
    const exerciseField = [...exercises];
    exerciseField[activeExercise].sets[activeSet].rpe = +event.target.value;
    setExercises(exerciseField);
  };

  function handleStartTimer() {
    if (!isRunning && !isBreak) {
      setIsRunning(true);
      setIsBreak(false);
    }
  };

  function handleStopTimer() {
    if (isRunning) {
      setIsRunning(false);
      if (workDuration != 0)
        setIsBreak(true);
    }
  };

  const handleFinishWorkout = async (event: FormEvent) => {
    event.preventDefault();
    // Get the sum of all the sets duration from all the exercises
    const workDurationSets = exercises.reduce(
      (sum, exercise) => sum + exercise.sets.reduce(
        (setSum, set) => setSum + set.duration, 0), 0);
    const restTimeSets = exercises.reduce(
      (sum, exercise) => sum + exercise.sets.reduce(
        (setSum, set) => setSum + set.rest_time, 0), 0);
    const workoutField = { ...workout, duration: workDurationSets + restTimeSets };

    const workoutValues = {
      workoutField,
      exercises
    };

    const res = await fetch('/api/workouts', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutValues)
    });

    const result = await res.json();
    if (result.userId) {
      router.push(`/movs/${result.userId}`);
    };
    setWorkout({
      name: "New Workout",
      duration: 0,
      public: true,
    });
    setExercises([
      {
        exerciseName: "New exercise",
        notes: "",
        sets: [{ reps: 1, duration: 0, rest_time: 0, set_number: 1, weight: 0, rpe: 1 }],
      },
    ]);
  };

  return (
    <div className="container flex flex-col">
      <div className="flex">
        {/* Side form */}
        <div className="flex-1 items-center mt-10">
          <form onSubmit={handleFinishWorkout}>
            <label htmlFor="workoutName">Workout name</label>
            <input
              id="workoutName"
              name="workoutName"
              type="text"
              value={workout.name}
              maxLength={25}
              placeholder="New workout"
              onChange={(e) => handleWorkoutName(e)}
            />
            <label htmlFor="publicCheckbox">Public workout</label>
            <input
              id="publicCheckbox"
              name="publicCheckbox"
              type="checkBox"
              defaultChecked={true}
            />
            {exercises.map((exercise, exerciseIndex) => (
              <div className="containerExercise" key={exerciseIndex}>
                <div className="wrapperExercise">
                  <input
                    value={exercise.exerciseName}
                    type="text"
                    placeholder="Exercise name"
                    onChange={(e) => handleExerciseName(exerciseIndex, e)}
                  />
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="containerSet">
                      <div className="wrapperSet flex space-x-4">
                        <div>{set.set_number}</div>
                        <button
                          type="button"
                          onClick={() => deleteSet(exerciseIndex, setIndex)}
                        >
                          Delete set
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSet(exerciseIndex)}>
                    Add sets
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteExercise(exerciseIndex)}
                  >
                    Delete exercise
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button type="submit" className="mt-10 rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish Workout</button>
            </div>
          </form>
        </div>

        {/* Central console */}
        <div className="flex-2 flex-col w-[50%] mt-10">
          <div className="flex flex-col items-center">
            <div className="border-4 border-solid rounded-md border-primary">
              <input type="text" value={exercises[activeExercise].exerciseName}
                onChange={(e) => handleExerciseName(activeExercise, e)}
                className="text-center py-2 text-lg" />
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
              <button className="flex items-center justify-center text-4xl" onClick={decrementRep}>-</button>
              <div className="flex items-center justify-center text-7xl p-10 w-[15rem]">
                {exercises[activeExercise].sets[activeSet].reps}
              </div>
              <button className="flex items-center justify-center text-4xl" onClick={incrementRep}>+</button>
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
                <input type="range" className="w-16"
                  value={exercises[activeExercise].sets[activeSet].rpe} min={1} max={10} onChange={(e) => handleSetRpe(activeExercise, activeSet, e)} />
                {exercises[activeExercise].sets[activeSet].rpe}
              </div>
              <button onClick={() => addSet(activeExercise)} type="button" className="rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish set</button>
              <span className="flex flex-col"><input className="max-w-16 flex items-center" type='number'
                value={exercises[activeExercise].sets[activeSet].weight}
                placeholder="KG/LB" onChange={(e) => handleSetWeight(activeExercise, activeSet, e)}
                min={0}
                max={1000}
              />Kgs/Lbs</span>
            </div>


            <div className="flex mt-4 space-x-4">
              <button type="button" onClick={toggleDialog}>Add note</button>
              {/* Dialog for exercise notes */}
              <div className="absolute top-0 left-[50%]">
                <dialog className="rounded-md" ref={dialogRef} onClick={(e) => {
                  if (e.currentTarget === e.target) {
                    toggleDialog()
                  };
                }}>
                  <div className="flex flex-col items-center space-y-6 px-6 py-4">
                    <div>How was your exercise?</div>
                    <textarea onChange={(e) => handleSetNotes(activeExercise, e)} placeholder="Notes..." maxLength={100}
                      value={exercises[activeExercise].notes} />
                    <button type="button" onClick={toggleDialog}>Close</button>
                  </div>
                </dialog>
              </div>

              <button onClick={addExercise} type="button" className="rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish exercise</button>
            </div>
          </div>

        </div>
        {/* Charts */}
        <div className="flex-1 flex-col mt-10"></div>
      </div>
    </div>
  );
}
