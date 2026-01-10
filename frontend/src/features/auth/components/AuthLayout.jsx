import { BookOpen } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  subtitleStyle,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 flex flex-col">
      {/* Mobile: Full width, no padding, same background, no border radius */}
      {/* Desktop: Centered card with padding, rounded corners, white card */}
      <div className="flex-1 flex flex-col justify-center w-full md:px-5 md:py-5">
        <div className="w-full md:max-w-lg md:mx-auto bg-gradient-to-br from-sky-50 via-white to-slate-50 md:bg-white/80 md:backdrop-blur-xl rounded-none md:rounded-3xl shadow-none md:shadow-2xl border-0 md:border md:border-slate-200/50 p-6 sm:p-8 md:p-10 flex flex-col justify-center min-h-screen md:min-h-0">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl mb-4 shadow-lg shadow-sky-500/25">
              <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <h2 style={subtitleStyle} className="text-slate-600 text-base">
              {subtitle}
            </h2>
          </div>

          {children}
        </div>

        {/* Footer text - only show on larger screens */}
        <p className="hidden md:block text-center text-slate-500 text-sm mt-6 px-5">
          © 2025 Article Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}