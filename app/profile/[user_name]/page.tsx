"use client";

import { Workouts } from "@/app/movs/[id]/page";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileType = {
  id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
};

export default function Profile() {
  const params = useParams<{ user_name: string }>();

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [workouts, setWorkouts] = useState<Workouts | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await fetch(`/api/public-profile/${params.user_name}`);
      const data = await res.json();

      setProfile(data?.data?.userData);
      setWorkouts(data?.data?.workoutData);
    };

    fetchWorkouts();
  }, [params.user_name]);

  return (
    <div>
      <div>Profile: {profile && profile.display_name}</div>
      <div>
        Workouts:{" "}
        {workouts?.map((workout) => (
          <div key={workout.id}>{workout.name}</div>
        ))}
      </div>
    </div>
  );
}
