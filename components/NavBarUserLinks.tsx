import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBarUserLinks() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) return null;

  return (
    <>
      <Link href={""}>Daily Workout</Link>
      <Link href={""}>Workouts</Link>
      <Link href={""}>Leaderboard</Link>
    </>
  );
}
