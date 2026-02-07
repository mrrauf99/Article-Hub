import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      <SEO
        title="Page Not Found"
        description="The page you are looking for could not be found."
        canonicalPath={location.pathname}
        noindex
        nofollow
      />
      <div className="w-full max-w-4xl mx-auto">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-sky-500/10 to-emerald-500/10 blur-3xl" />

        {/* Card */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-sm overflow-hidden">
          <div className="p-6 sm:p-10 lg:p-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: 404 Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-slate-300">
                  404 • Not Found
                </span>
              </div>

              <div>
                <p className="text-xs font-medium tracking-widest text-slate-500 uppercase mb-3">
                  Article Hub
                </p>
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold text-slate-50">
                  4
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
                    0
                  </span>
                  4
                </h1>
                <p className="mt-4 text-sm text-slate-400 max-w-md">
                  We looked through our entire library but couldn&apos;t find
                  the page you were searching for.
                </p>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                  This page is missing.
                </h2>
                <p className="mt-3 text-slate-400 text-sm sm:text-base">
                  The page you're looking for doesn't exist, has been moved, or
                  the URL is slightly off. Go back to the homepage to keep
                  reading and exploring fresh articles.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors w-full sm:w-auto"
              >
                Back to homepage
              </Link>

              <p className="text-xs text-slate-500">
                Error code:{" "}
                <span className="font-mono text-slate-400">404_NOT_FOUND</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
