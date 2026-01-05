import { BookOpen } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  subtitleStyle,
}) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg p-5 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 sm:p-10">
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

        {/* Footer text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          © 2025 Article Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
