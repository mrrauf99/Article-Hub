import { Link } from "react-router-dom";
import { ArrowRight, PenLine, BookOpen } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full px-3 sm:px-4 md:px-6 lg:px-8 text-center">
        <div className="w-full max-w-5xl mx-auto">
          {/* Heading */}
          <ScrollReveal animation="fade-up" duration={600}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Share Your
              <span className="block mt-2 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                Knowledge with the World?
              </span>
            </h2>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal animation="fade-up" delay={100} duration={600}>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of writers and readers who trust Article Hub for
              distraction-free publishing. Start writing today—it's completely
              free.
            </p>
          </ScrollReveal>

          {/* CTA Cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
            {/* For Writers */}
            <ScrollReveal animation="fade-right" delay={200} duration={600}>
              <Link
                to="/register"
                className="group flex flex-col items-center p-8 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center mb-4">
                  <PenLine className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  For Writers
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Create and publish your articles with our powerful editor
                </p>
                <span className="inline-flex items-center gap-1 text-sky-400 font-medium group-hover:gap-2 transition-all">
                  Start Writing <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollReveal>

            {/* For Readers */}
            <ScrollReveal animation="fade-left" delay={300} duration={600}>
              <Link
                to="/register"
                className="group flex flex-col items-center p-8 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  For Readers
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Discover quality articles without ads or distractions
                </p>
                <span className="inline-flex items-center gap-1 text-purple-400 font-medium group-hover:gap-2 transition-all">
                  Join Free <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Already have account */}
          <ScrollReveal animation="fade" delay={400}>
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-medium hover:text-sky-400 transition-colors underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
