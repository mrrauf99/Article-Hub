import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";

function getErrorDetails(error) {
  if (!error) {
    return {
      code: "404",
      headline: "This page is missing.",
      description:
        "We looked through our entire library but couldn't find the page you were searching for. It may have been moved, or the address might be slightly off.",
    };
  }

  if (!isRouteErrorResponse(error)) {
    return {
      code: "Error",
      headline: "Something went wrong.",
      description:
        "An unexpected error occurred on our end. Please refresh the page or go back.",
    };
  }

  if (error.status === 404) {
    return {
      code: "404",
      headline: "This page is missing.",
      description:
        "We looked through our entire library but couldn't find the page you were searching for. It may have been moved, or the address might be slightly off.",
    };
  }

  if (error.status === 500) {
    return {
      code: "500",
      headline: "Something went wrong.",
      description:
        "Our servers ran into an unexpected issue. We're working to fix it, please try again in a few moments.",
    };
  }

  return {
    code: String(error.status),
    headline: "Something went wrong.",
    description:
      error.statusText || "An unexpected error occurred. Please go back and try again.",
  };
}

export default function ErrorPage() {
  const error = useRouteError();
  const details = getErrorDetails(error);

  return (
    <main className="min-h-[100dvh] bg-ink-950 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-12 font-ui">
      <SEO
        title="Error"
        description="An error occurred while loading this page."
        canonicalPath="/error"
        noindex
        nofollow
      />

      <div className="w-full max-w-lg mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-12">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper">
            <BookOpen className="h-4.5 w-4.5 text-ink-950" strokeWidth={2} />
          </span>
          <span className="text-lg font-semibold text-paper tracking-tight">
            Article Hub
          </span>
        </Link>

        <p className="font-editorial text-7xl sm:text-8xl text-paper mb-4">
          {details.code}
        </p>

        <h1 className="text-xl sm:text-2xl font-semibold text-paper mb-3">
          {details.headline}
        </h1>
        <p className="text-paper/55 mb-10 leading-relaxed">
          {details.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-paper px-7 py-3 text-sm font-semibold text-ink-950 hover:bg-moss-100 transition-colors"
          >
            Back to homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-paper/20 px-7 py-3 text-sm font-medium text-paper/80 hover:border-paper/40 hover:text-paper transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
