import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Navbar section */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">Logo</div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>

        {/* Hero section */}
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <Hero />
        </div>

        {/* Footer section */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-4 py-6">
          <p>
            By{" "}
            <a
              href="https://github.com/AntonioIonica"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              AntonioII
            </a>{" "}
            2026
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
