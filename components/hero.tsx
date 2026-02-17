export function Hero() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Build workouts. Track progress.
          <br />
          Share your fitness journey.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          A simple, powerful workout tracker that lets you create routines,
          monitor your progress, and share your public profile with others.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/signup"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Start for free
          </a>
          <a
            href="#features"
            className="rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-200 hover:bg-gray-900"
          >
            See features
          </a>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h3 className="text-center text-3xl font-bold">
          Everything you need to stay consistent
        </h3>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h4 className="text-xl font-semibold">Create workouts</h4>
            <p className="mt-3 text-gray-400">
              Build custom routines with your favorite exercises and reuse them
              anytime.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h4 className="text-xl font-semibold">Public profile</h4>
            <p className="mt-3 text-gray-400">
              Share your workouts and progress with friends, clients, or the
              community.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h4 className="text-xl font-semibold">Track your progress</h4>
            <p className="mt-3 text-gray-400">
              See your workout history, improvements, and performance over time.
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h3 className="text-3xl font-bold">
            Ready to start your next workout?
          </h3>
          <p className="mt-4 text-gray-400">
            Join now and track your progress from day one.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Create your account
          </a>
        </div>
      </section>
    </>
  );
}
