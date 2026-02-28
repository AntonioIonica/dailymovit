"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ProfileType = {
  email: string;
  display_name: string;
  avatar_url: string | undefined;
  user_name: string | undefined;
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<ProfileType>({
    email: "",
    display_name: "",
    avatar_url: "",
    user_name: "",
  });

  const { isFetching: isFetchingProfile, data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileType> => {
      const res = await fetch("/api/dashboard");
      const result = await res.json();

      setProfile(profileData!);
      console.log(profileData);
      return result.data;
    },
  });

  useEffect(() => {
    setProfile(profileData!);
  }, [profileData]);

  const mutationProfile = useMutation({
    mutationFn: async (newProfile: ProfileType) => {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });

      return await res.json();
    },
    onSuccess: () => {
      // Refetch the profile when updated and saving it to cache
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutationProfile.mutate(profile);
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, user_name: e.target.value }));
  };

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, avatar_url: e.target.value }));
  };

  const handleChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, display_name: e.target.value }));
  };

  return (
    <div className="container flex h-[78vh] max-h-[78vh] flex-col items-center justify-center p-10">
      {isFetchingProfile || mutationProfile.isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="container flex flex-col items-center">
          <form
            className="card glow flex w-[380px] flex-col space-y-2 border-2 border-solid border-border p-6"
            onSubmit={handleSubmitForm}
          >
            <label htmlFor="avatar_url">Paste you avatar URL here: </label>
            <input
              name="avatar_url"
              id="avatar_url"
              onChange={(e) => handleChangeAvatar(e)}
              value={profile?.avatar_url || ""}
              type="text"
              className="pl-4"
            />
            <label htmlFor="display_name">Display name: </label>
            <input
              onChange={(e) => handleChangeDisplayName(e)}
              name="display_name"
              id="display_name"
              value={profile?.display_name || ""}
              type="text"
              className="pl-4"
            />
            <label htmlFor="email">Your email: </label>
            <input
              name="email"
              id="email"
              value={profile?.email}
              type="text"
              disabled
              className="pl-4"
            />
            <label htmlFor="user_name">
              Your user name: *needed for unique page
            </label>
            <input
              name="user_name"
              id="user_name"
              onChange={(e) => handleChangeUsername(e)}
              value={profile?.user_name || ""}
              type="text"
              placeholder="Your new username..."
              className="pl-4"
            />
            {!profile?.user_name && (
              <div>
                Please set your user name so you can share your profile!
              </div>
            )}
            <button type="submit" className="btn mt-8">
              Update profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
