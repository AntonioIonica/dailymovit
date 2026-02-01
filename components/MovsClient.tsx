"use client"

import moment from "moment-timezone";
import { useState } from "react";

type MovsClientProps = {
    userId: string | undefined;
    paramsUserId: string;
    workouts: Array<{
        id: string,
        name: string,
        duration: number,
        completed_at: number,
        public: boolean,
        exercises: Array<{
            id: string,
            name: string,
            notes: string,
            sets: Array<{
                id: string,
                set_number: number,
                reps: number,
                duration: number,
                weight: number,
                rest_time: number,
                rpe: number
            }>
        }>
    }>
}

// Takes the time from the database and format it to reverse order in a more pleasand way
function parseLocalTime(timeData: string) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let currentTime = moment().tz(timezone).format(timeData);
    const localDate = currentTime.split("T")[0];
    const localHour = currentTime.split("T")[1];
    currentTime = localHour.split(".")[0] + "---" + localDate;

    return currentTime;
}


export default function MovsClient({ userId, paramsUserId, workouts }: MovsClientProps) {
    const [openWorkout, setOpenWorkout] = useState<null | number>(null);
    const [openExercise, setOpenExercise] = useState<null | number>(null);

    // The button clicked sets the index to open the dialog below
    function toggleWorkouts(index: number) {
        setOpenWorkout(openWorkout === index ? null : index);
    };

    // The button clicked sets the index to open the dialog below
    function toggleExercises(index: number) {
        if (openWorkout !== null) {
            setOpenExercise(openExercise === index ? null : index);
        }
    };

    if (userId !== paramsUserId) {
        return <div>You are not logged in!</div>
    };

    return <div className="flex flex-col max-h-screen min-h-[78vh] w-screen px-10">
        {/* Streaks */}
        <div className="streaks flex w-full h-[25vh] border-2 border-solid border-cyan-100">
            {/* Calendar and streaks */}
            <div className="flex w-[70%] border-2 border-solid border-cyan-100">
                {/* Calendar */}
                <div className="w-[40%]">Calendar</div>

                {/* Streaks */}
                <div className="w-[60%]">Streaks</div>
            </div>

            {/* General info */}
            <div className="w-[30%] border-2 border-solid border-cyan-100">
                Number of workouts: {workouts.length ?? "No workouts yet"}
            </div>
        </div>

        {/* Container */}
        <div className="flex w-full h-[59vh]">
            {/* Workouts list */}
            <div className="border-2 border-solid border-cyan-100 w-[40%] h-full max-h-[64vh] overflow-y-auto">
                <div className="container flex flex-col items-start w-full space-y-0">
                    {workouts.map((workout, index) => (<div className="w-full border-2 border-solid 
                    rounded-sm border-primary px-4 flex flex-col" key={index}>
                        <button onClick={() => toggleWorkouts(index)}
                            className="accordion w-full text-start font-bold text-md">{workout.name}
                        </button>

                        {/* Details of eah workout */}
                        {openWorkout === index && (
                            <div className="panel overflow-hidden flex-col w-full">
                            {/* Workout details */}
                                <div className="flex w-full space-x-6">
                                    <span>Duration: {workout.duration} sec</span>
                                    <span className="italic">Completed at: {parseLocalTime(workout.completed_at.toString())}</span>
                                </div>

                                {/* Exercises details */}
                                <div className="flex w-full flex-col">
                                    <div className="flex flex-col">
                                        {workout.exercises.map((exercises, index) => (<div key={index}
                                            className="flex flex-col w-full">
                                            <div className="flex space-x-4 ml-4">
                                                <button className="underline" onClick={() => toggleExercises(index)}>
                                                    {exercises.name}
                                                </button>
                                                {exercises.notes && <span>Notes: {exercises.notes}</span>}
                                            </div>
                                            {openExercise === index && (
                                                <div className="flex flex-col text-sm ml-6">
                                                    {exercises.sets.map((set, index) => (
                                                        <ul key={index} className="flex items-center justify-between">
                                                            <li>Set: {set.set_number || "-"}</li>
                                                            <li>Reps: {set.reps || "-"}</li>
                                                            <li>Duration: {set.duration || "-"}</li>
                                                            <li>Rest time: {set.rest_time || "-"}</li>
                                                            <li>Weight: {set.weight || "-"}</li>
                                                            <li>RPE: {set.rpe || "-"}</li>
                                                        </ul>
                                                ))}</div>
                                            )}
                                        </div>))}
                                    </div>
                                </div>
                            </div>)}
                    </div>))}
                </div>
            </div>

            {/* Charts */}
            <div className="border-2 border-solid border-cyan-100 w-[60%] h-full">Charts</div>
        </div >
    </div>
}