import { Info } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div className="w-full max-w-6xl mx-auto">
        <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 border border-sky-200 mb-6 shadow-sm">
          <Info className="h-4 w-4" />
          About Article Hub
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Where quality writing meets{" "}
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            intentional learning
          </span>
        </h1>

        <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed">
          <p>
            Article Hub is more than just another publishing platform—it's a{" "}
            <strong>commitment to quality</strong> in an age of information
            overload. We're building a home for creators and learners who
            believe that great ideas deserve great presentation.
          </p>

          <p>
            Founded in 2025 by two developers frustrated with cluttered
            interfaces and algorithm-driven feeds, Article Hub was born from a
            simple question:{" "}
            <em>
              What if reading and writing online could be beautiful again?
            </em>
          </p>

          <p>
            No ads interrupting your flow. No engagement metrics dictating what
            you see. No dark patterns pushing you toward endless scrolling. Just
            clean, thoughtful design that respects your time and intelligence.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
