export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-3xl">
        {/* Background glow */}
        <div className="absolute -inset-24 bg-gradient-to-tr from-indigo-500/25 via-sky-500/15 to-emerald-500/15 blur-3xl opacity-60" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 shadow-[0_24px_90px_rgba(15,23,42,1)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.15),transparent_55%)] opacity-80" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
            {/* Left: 404 graphic */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-slate-300">
                  404 • not found
                </span>
              </div>

              <div className="relative inline-flex">
                <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800/80 px-8 py-7 shadow-[0_18px_55px_rgba(15,23,42,1)]">
                  <p className="text-xs font-medium tracking-[0.35em] text-slate-400 uppercase">
                    Article hub
                  </p>
                  <p className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-50">
                    4
                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 via-sky-400 to-emerald-400">
                      0
                    </span>
                    4
                  </p>
                  <p className="mt-3 text-sm text-slate-400">
                    We looked through our entire library but couldn&apos;t find
                    the page you were searching for.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: copy + action */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
                This page is missing.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-400">
                The page you’re looking for doesn’t exist, has been moved, or
                the URL is slightly off. Go back to the homepage to keep reading
                and exploring fresh articles.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/35 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
                >
                  Back to homepage
                </a>
              </div>

              <p className="mt-5 text-xs text-slate-500">
                Error code:{" "}
                <span className="font-mono text-slate-300">404_NOT_FOUND</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
