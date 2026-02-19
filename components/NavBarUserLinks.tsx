import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBarUserLinks() {
  const supabase = await createClient();


  const { data: userData } = await supabase.auth.getClaims();
  const user = userData?.claims;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("user_name")
    .eq("id", user?.sub)
    .maybeSingle();

  const profileLink = profileData?.user_name
    ? `/profile/${profileData.user_name}`
    : `/dashboard`;

  return (
    <>
      <Link className="navbar-links animate-bounce" href={"/movs/create"}>
        Start Mov
      </Link>
      <Link className="navbar-links" href={profileLink}>
        Share My Mov
      </Link>
      <Link className="navbar-links" href={`/movs/${user?.sub}`}>
        My Movs
      </Link>
    </>
  );
}
