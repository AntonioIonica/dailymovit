import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto h-screen max-w-6xl px-10 py-24 text-center">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Track your progress.
          <br />
          Share your journey.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-400">
          A simple, powerful workout tracker that lets you record any{" "}
          <span className="text-secondary">Mov(e)</span>, monitor your progress
          using charts, and share your public profile.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Start tracking for free
          </Link>

          <a
            href="#features"
            className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-200 hover:bg-gray-900"
          >
            See features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto h-screen max-w-6xl px-10 py-20">
        <h2 className="text-center text-3xl font-bold">
          Everything you need to stay consistent
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="card glow rounded-2xl border border-gray-800 p-6">
            <h4 className="text-xl font-semibold">Create movs</h4>
            <p className="mt-3 text-gray-400">
              Track your favourite exercises, sets and reps-no spreadsheets
              required. With timer included.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card glow rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold">Public profile</h3>
            <p className="mt-3 text-gray-400">
              Share your workouts with your friends. Or just save them. Your
              life. Your choice.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card glow rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold">Track your progress</h3>
            <p className="mt-3 text-gray-400">
              See your progress over time with simple charts.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-6 h-screen max-w-6xl px-10 py-20">
        <div className="items-between flex flex-col justify-center space-y-4 text-3xl">
          <h3 className="block">Step 1: Create your Mov</h3>
          <span className="flex justify-center text-6xl">&#8595;</span>
          <h3 className="block">Step 2: Watch your progress grow</h3>
          <span className="flex justify-center text-6xl">&#8595;</span>
          <h3 className="block">Step 3: Share your sessions</h3>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/auth/login"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Join now
          </Link>
        </div>
      </section>

      {/* Proof */}
      <section className="mx-auto mt-6 h-screen max-w-6xl px-10 py-20">
        <div className="mx-auto"></div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="mb-7 text-3xl font-bold">
            <span className="text-secondary">Move(e)</span> daily. Track it.
            Share it.
          </h2>
          <p className="mt-4 text-gray-400">
            Join now and track your progress from day one.
          </p>

          <div className="flex justify-center">
            <Link
              href="/auth/login"
              className="mt-8 flex w-[12rem] items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-black hover:bg-gray-200"
            >
              <Image
                src="/google_logo.svg"
                alt="google login logo"
                height={30}
                width={30}
              />{" "}
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
