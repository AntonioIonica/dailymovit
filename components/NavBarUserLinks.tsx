import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBarUserLinks() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) return null;

  return (
    <>
      <Link className="navbar-links animate-bounce" href={"/movs/create"}>
        Start Workout
      </Link>
      <Link className="navbar-links" href={"/leaderboard"}>
        Leaderboard
      </Link>
      <Link className="navbar-links" href={`/movs/${user.sub}`}>
        My Movs
      </Link>
    </>
  );
}
