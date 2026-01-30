"use client"

import moment from "moment-timezone";

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

function parseLocalTime(timeData: string) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let currentTime = moment().tz(timezone).format(timeData);
    const localDate = currentTime.split("T")[0];
    const localHour = currentTime.split("T")[1];
    currentTime = localHour.split(".")[0] + "-" + localDate;
    return currentTime;
}


export default function MovsClient({ userId, paramsUserId, workouts }: MovsClientProps) {
    function handleAccordion(e) {
        return null
    }

    if (userId !== paramsUserId) {
        return <div>You are not logged in!</div>
    }

    return <div className="flex flex-col max-h-screen min-h-[78vh] w-screen px-10">
        {/* Streaks */}
        <div className="streaks flex w-full h-[20vh] border-2 border-solid border-cyan-100">
            <div className="w-[70%] border-2 border-solid border-cyan-100">Streaks</div>
            <div className="w-[30%] border-2 border-solid border-cyan-100">
                Number of workouts: {workouts.length}
            </div>
        </div>

        {/* Container */}
        <div className="flex w-full h-[64vh]">
            <div className="border-2 border-solid border-cyan-100 w-[40%] h-full">
                <div className="container flex flex-col items-start w-full space-y-0">
                    {workouts.map((workout, index) => (<div className="w-full border-2 border-solid 
                    rounded-sm border-primary px-4 flex flex-col" key={index}>
                        <button onClick={(e) => handleAccordion(e)}
                            className="accordion w-full text-start">{workout.name}</button>
                        <div className="panel flex flex-col ml-6 w-full">
                            {/* Workout details */}
                            <div className="flex w-full">
                                <span>Duration: {workout.duration}</span>
                                <span>Completed at: {parseLocalTime(workout.completed_at.toString())}</span>
                            </div>
                        </div>
                    </div>))}
                </div>
            </div>
            <div className="border-2 border-solid border-cyan-100 w-[60%] h-full">Charts</div>
        </div >
    </div>
}