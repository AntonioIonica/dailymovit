"use client";

import { submitMovAction } from "@/app/actions";
import { useState } from "react";

export default function CreateMov() {
  const [workout, setWorkout] = useState({
    name: "New Workout",
    duration: 0,
    public: true,
  });
  const [exercises, setExercises] = useState([
    {
      exerciseName: "",
      duration: 0,
      sets: [{ reps: 0, duration: 0, rest_time: 0 }],
    },
  ]);
  const [activeExercise, setActiveExercise] = useState(0);
  const [activeSet, setActiveSet] = useState(0);

  function handleWorkoutName(event: { target: { value: string } }) {
    setWorkout({ ...workout, name: event.target.value });
  }

  function handleExerciseName(
    index: number,
    event: { target: { value: string } }
  ) {
    const exercisesField = [...exercises];
    exercisesField[index].exerciseName = event.target.value;
    setExercises(exercisesField);
  }

  function addExercise() {
    setExercises([
      ...exercises,
      {
        exerciseName: "",
        duration: 0,
        sets: [{ reps: 0, duration: 0, rest_time: 0 }],
      },
    ]);
  }

  function deleteExercise(exerciseIndex: number) {
    const exercisesField = [...exercises];
    exercisesField.splice(exerciseIndex, 1);
    setExercises(exercisesField);
  }

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
  }

  function addSet(exerciseIndex: number) {
    const exercisesField = [...exercises];
    exercisesField[exerciseIndex].sets.push({
      reps: 0,
      duration: 0,
      rest_time: 0,
    });
    setExercises(exercisesField);
  }

  function deleteSet(exerciseIndex: number, setIndex: number) {
    const exercisesField = [...exercises];
    exercisesField[exerciseIndex].sets.splice(setIndex, 1);
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
    if (exercisesField[activeExercise].sets[activeSet].reps > 0) {
      exercisesField[activeExercise].sets[activeSet].reps -= 1;
    }
    setExercises(exercisesField);
  }

  return (
    <div className="container flex flex-col">
      <div className="flex">
        {/* Side form */}
        <div className="flex-1">
          <form action={submitMovAction}>
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
                      <div className="wrapperSet">
                        <input
                          type="range"
                          value={set.reps}
                          min={1}
                          max={30}
                          onChange={(e) =>
                            handleSetRep(exerciseIndex, setIndex, e)
                          }
                        />
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
            <button type="button" onClick={addExercise}>
              Add Exercise
            </button>
          </form>
        </div>

        {/* Central console */}
        <div className="flex-2 flex-col w-[50%]">
          <div className="flex flex-col">
            <div>{exercises[activeExercise].exerciseName.toUpperCase()}</div>
            <div className="flex items-center justify-center text-9xl">
              {exercises[activeExercise].sets[activeSet].reps}
            </div>
            <div className="flex justify-center items-center space-x-4">
              <button onClick={decrementRep}>-</button>
              <button onClick={incrementRep}>+</button>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="flex-1 flex-col"></div>
      </div>
    </div>
  );
}
