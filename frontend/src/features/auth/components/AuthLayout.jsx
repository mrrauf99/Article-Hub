import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-paper font-ui">
      {/* position: fixed, not sticky — the global `overflow-x-hidden` on
          body makes it a scroll container, which silently breaks sticky */}
      <div className="hidden lg:flex lg:w-[42%] lg:h-[100dvh] lg:fixed lg:inset-y-0 lg:left-0 bg-ink-950 text-paper flex-col justify-between px-12 py-14 relative overflow-hidden">
        <Link to="/" className="inline-flex items-center gap-2.5 relative z-10 w-fit">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper">
            <BookOpen className="h-4.5 w-4.5 text-ink-950" strokeWidth={2} />
          </span>
          <span className="text-lg font-semibold tracking-tight">Article Hub</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="font-editorial text-[2.25rem] leading-[1.15] italic-clear text-paper mb-5">
            A quieter place to write and read.
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-paper/70">
            Draft freely, publish through a simple review, and read without
            ads or algorithmic feeds getting in the way.
          </p>
        </div>

        <p className="relative z-10 text-xs text-paper/45">
          © 2025-{new Date().getFullYear()} Article Hub. All rights reserved.
        </p>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-paper/[0.06]"
        />
      </div>

      {/* Spacer that reserves the fixed panel's width in normal flow */}
      <div className="hidden lg:block lg:w-[42%] shrink-0" aria-hidden="true" />

      <div className="flex-1 flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-14 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-10 lg:hidden w-fit"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <BookOpen className="h-4 w-4 text-paper" strokeWidth={2} />
            </span>
            <span className="text-base font-semibold text-ink tracking-tight">
              Article Hub
            </span>
          </Link>

          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="font-editorial text-3xl text-ink mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-[0.9375rem] text-ink-muted leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
