"use client"

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


export default function MovsClient({ userId, paramsUserId, workouts }: MovsClientProps) {
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
                <div className="container flex flex-col items-start">
                    {workouts.map((workout) => (<><button className="accordion">{workout.name}</button><div></div></>))}
                </div>
            </div>
            <div className="border-2 border-solid border-cyan-100 w-[60%] h-full">Charts</div>
        </div>


    </div>
}