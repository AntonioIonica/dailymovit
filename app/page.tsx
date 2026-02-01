import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-[90vh]">
      {/* Hero section */}
      <div className="flex-1 flex flex-col max-w-screen p-5 items-center">
        <Hero />
      </div>

      {/* Footer section */}
      <footer className="w-screen flex items-center justify-center border-t mx-auto text-center text-xs gap-4 py-6">
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
  );
}
