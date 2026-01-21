"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateMov() {
  const [workout, setWorkout] = useState({
    name: "New Workout",
    duration: 0,
    public: true,
  });
  const [exercises, setExercises] = useState([
    {
      exerciseName: "New exercise",
      sets: [{ reps: 1, duration: 0, rest_time: 0, set_number: 1, weight: 0, notes: '', rpe: 1 }],
    },
  ]);
  const [activeExercise, setActiveExercise] = useState(0);
  const [activeSet, setActiveSet] = useState(0);
  const router = useRouter();

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
        exerciseName: "New exercise",
        sets: [{ reps: 1, duration: 0, rest_time: 0, set_number: 1, weight: 0, notes: '', rpe: 1 }],
      },
    ]);
    setActiveExercise(prev => prev + 1);
    setActiveSet(0);
  }

  function deleteExercise(exerciseIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField.length > 1) {
      exercisesField.splice(exerciseIndex, 1);
      if (activeExercise > 0) {
        setActiveExercise(prev => prev - 1);
      }
    };
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
      reps: 1,
      duration: 0,
      rest_time: 0,
      set_number: exercisesField[exerciseIndex].sets[activeSet].set_number + 1,
      weight: 0,
      notes: '',
      rpe: 1
    });
    setExercises(exercisesField);
    setActiveSet(prev => prev + 1);
  }

  function deleteSet(exerciseIndex: number, setIndex: number) {
    const exercisesField = [...exercises];
    if (exercisesField[exerciseIndex].sets.length > 1) {
      exercisesField[exerciseIndex].sets.splice(setIndex, 1);
      if (activeSet > 0) {
        setActiveSet(prev => prev - 1);
      };
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
    };
    setExercises(exercisesField);
  }

  const handleFinishWorkout = async (event: FormEvent) => {
    event.preventDefault();

    const workoutValues = {
      workout,
      exercises
    };

    const res = await fetch('/api/workouts', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workoutValues)
    });

    const result = await res.json();
    console.log(result);
    if (result.userId) {
      router.push(`/movs/${result.userId}`);
    }
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
                      <div className="wrapperSet">
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
            <div className="flex justify-center">
              <button type="submit" className="mt-10 rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish Workout</button>
            </div>
          </form>
        </div>

        {/* Central console */}
        <div className="flex-2 flex-col w-[50%] mt-10">
          <div className="flex flex-col items-center">
            <div>{exercises[activeExercise].exerciseName.toUpperCase()}</div>
            <div>{ }</div>
            <div className="flex justify-center items-center">
              <button className="flex items-center justify-center text-7xl" onClick={decrementRep}>-</button>
              <div className="flex items-center justify-center text-9xl p-10 w-[15rem]">
                {exercises[activeExercise].sets[activeSet].reps}
              </div>
              <button className="flex items-center justify-center text-7xl" onClick={incrementRep}>+</button>
            </div>
            <input
              type="range"
              value={exercises[activeExercise].sets[activeSet].reps}
              onChange={(e) => handleSetRep(activeExercise, activeSet, e)}
              min={1}
              max={30}
              className="scale-[250%]"
            />
            <button onClick={() => addSet(activeExercise)} type="button" className="mt-10 rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish set</button>
            <button onClick={addExercise} type="button" className="mt-10 rounded-md border-slate-300 
            px-3 py-2 text-black bg-slate-100">Finish exercise</button>
          </div>

        </div>
        {/* Charts */}
        <div className="flex-1 flex-col mt-10"></div>
      </div>
    </div>
  );
}
