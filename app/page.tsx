import Hero from "@/components/hero";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex h-[90vh] flex-col items-center justify-between">
      {/* Hero section */}
      <div className="max-w-screen flex flex-1 flex-col items-center p-5">
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
        </Suspense>
      </div>

      {/* Footer section */}
      <footer className="card glow mx-auto flex w-screen items-center justify-center gap-4 border-t py-6 text-center text-xs">
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
      </footer>
    </div>
  );
}
