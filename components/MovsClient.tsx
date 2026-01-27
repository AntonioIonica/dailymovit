"use client"

type MovsClientProps = {
    userId: string | undefined;
    paramsUserId: string;
    workouts: Array<{ name: string }>
}


export default function MovsClient({ userId, paramsUserId, workouts }: MovsClientProps) {
    if (userId !== paramsUserId) {
        return <div>You are not logged in!</div>
    }

    return <div>{workouts.map((workout, index) => (<div key={index}><h1>Workout name: {workout.name}</h1></div>))}</div>
}