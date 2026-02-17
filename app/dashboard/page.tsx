"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type ProfileType = {
  email: string;
  display_name: string;
  avatar_url: string | undefined;
  user_name: string | undefined;
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType>({
    email: "",
    display_name: "",
    avatar_url: "",
    user_name: "",
  });
  const [formResponse, setFormResponse] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();

      const {
        data: { user: userData },
        error: userError,
      } = await supabase.auth.getUser();
      if (!userData) {
        console.error("Unauthorized", userError);
        return router.push("/auth/login");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, display_name, avatar_url, user_name")
        .eq("id", userData.id)
        .single();

      setProfile(
        profile || {
          email: "",
          display_name: "",
          avatar_url: "",
          user_name: "",
        },
      );

      if (profileError) {
        console.error(profileError);
        return;
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application.json" },
      body: JSON.stringify(profile),
    });

    const result = await res.json();

    if (result.status === 201) {
      setFormResponse(result.data);
    }

    setFormResponse(result.message);
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const duplicateUserName = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_name", e.target.value)
        .maybeSingle();

      if (data) {
        setUsernameError(
          "The username is already taken. Please choose another one!",
        );
        return;
      }
    };
    duplicateUserName();

    setProfile((prev) => ({ ...prev, user_name: e.target.value }));
    router.refresh();
  };

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, avatar_url: e.target.value }));
  };

  const handleChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, display_name: e.target.value }));
  };

  return (
    <div className="container flex h-[78vh] max-h-[78vh] flex-col items-center justify-center p-10">
      {!profile ? (
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
              value={profile.avatar_url || ""}
              type="text"
              className="pl-4"
            />
            <label htmlFor="display_name">Display name: </label>
            <input
              onChange={(e) => handleChangeDisplayName(e)}
              name="display_name"
              id="display_name"
              value={profile.display_name}
              type="text"
              className="pl-4"
            />
            <label htmlFor="email">Your email: </label>
            <input
              name="email"
              id="email"
              value={profile.email}
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
              value={profile.user_name || ""}
              type="text"
              placeholder="Your new username..."
              className="pl-4"
            />
            <div>{usernameError || ""}</div>
            <button type="submit" className="btn mt-8">
              Update profile
            </button>
          </form>
        </div>
      )}
      <div>{formResponse}</div>
    </div>
  );
}
