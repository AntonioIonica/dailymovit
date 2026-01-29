import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import NavBarUserLinks from "./NavBarUserLinks";
import { Logo } from "./ui/logo";

export default function Navbar({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Fixed Navbar */}
      <nav className="z-10 w-full flex justify-center border-b border-b-foreground/10 h-16 fixed bg-background">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-md">
          <Link href={"/"}>
            <Logo />
          </Link>
          <Suspense fallback={null}>
            <NavBarUserLinks />
          </Suspense>
          <Suspense fallback={null}>
            <AuthButton />
          </Suspense>
        </div>
      </nav>

      {/* Main content */}
      <div className="container flex flex-col mt-16 items-center justify-center">
        {children}
      </div>
    </main>
  );
}
