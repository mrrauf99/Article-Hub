import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import SEO from "@/components/SEO";

function getErrorDetails(error) {
  if (!error) {
    return {
      code: 404,
      badge: "404 • NOT FOUND",
      headline: "This page is missing.",
      subheadline: "We looked through our entire library but couldn't find the page you were searching for.",
      description: "The page you're looking for doesn't exist, has been moved, or the URL is slightly off. Go back to keep reading and exploring fresh articles.",
      errorCode: "404_NOT_FOUND",
    };
  }

  if (!isRouteErrorResponse(error)) {
    return {
      code: "ERR",
      badge: "ERROR • UNEXPECTED",
      headline: "Something went wrong.",
      subheadline: "An unexpected error occurred on our end. Please refresh or go back.",
      description: "An unexpected error occurred on our end. Please refresh the page or go back.",
      errorCode: "UNEXPECTED_ERROR",
    };
  }

  if (error.status === 404) {
    return {
      code: 404,
      badge: "404 • NOT FOUND",
      headline: "This page is missing.",
      subheadline: "We looked through our entire library but couldn't find the page you were searching for.",
      description: "The page you're looking for doesn't exist, has been moved, or the URL is slightly off. Go back to keep reading and exploring fresh articles.",
      errorCode: "404_NOT_FOUND",
    };
  }

  if (error.status === 500) {
    return {
      code: 500,
      badge: "500 • SERVER ERROR",
      headline: "Something went wrong.",
      subheadline: "We ran into a problem while loading the page you requested.",
      description: "Our servers ran into an unexpected issue. We're working to fix it. Please try again in a few moments.",
      errorCode: "500_INTERNAL_SERVER_ERROR",
    };
  }

  return {
    code: error.status,
    badge: `${error.status} • ERROR`,
    headline: "Something went wrong.",
    subheadline: "We ran into a problem while loading the page you requested.",
    description: error.statusText || "An unexpected error occurred. Please go back and try again.",
    errorCode: `${error.status}_ERROR`,
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  const details = getErrorDetails(error);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
      <SEO
        title="Error"
        description="An error occurred while loading this page."
        canonicalPath="/error"
        noindex
        nofollow
      />

      <div className="w-full max-w-4xl mx-auto">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-sky-500/10 to-emerald-500/10 blur-3xl" />

        {/* Card */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-sm overflow-hidden">
          <div className="p-6 sm:p-10 lg:p-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Error code section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-slate-300">
                  {details.badge}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium tracking-widest text-slate-500 uppercase mb-3">
                  Article Hub
                </p>
                <h1 className="text-7xl sm:text-8xl lg:text-9xl font-extrabold text-slate-50 leading-none">
                  {String(details.code)
                    .split("")
                    .map((char, i) =>
                      i === 1 ? (
                        <span
                          key={i}
                          className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                        >
                          {char}
                        </span>
                      ) : (
                        <span key={i}>{char}</span>
                      )
                    )}
                </h1>
                <p className="mt-4 text-sm text-slate-400 max-w-md">
                  {details.subheadline}
                </p>
              </div>
            </div>

            {/* Right: Message + actions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-50">
                  {details.headline}
                </h2>
                <p className="mt-3 text-slate-400 text-sm sm:text-base">
                  {details.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {details.code === 404 ? (
                  <>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors"
                    >
                      Back to homepage
                    </Link>
                    <button
                      onClick={() => window.history.back()}
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition-colors"
                    >
                      Go back
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors"
                  >
                    Go back
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Error code:{" "}
                <span className="font-mono text-slate-400">
                  {details.errorCode}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
