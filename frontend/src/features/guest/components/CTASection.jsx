import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-ink-950 font-ui">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal animation="fade-up" duration={500}>
          <h2 className="font-editorial text-3xl sm:text-4xl text-paper leading-tight mb-5">
            Your writing deserves an audience that reads.
          </h2>
          <p className="text-paper/65 max-w-xl mx-auto mb-9">
            Join a platform built for people who care about ideas, not
            impressions.
          </p>

          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-paper hover:bg-moss-100 text-ink-950 px-7 py-3.5 rounded-full font-semibold text-[0.9375rem] transition-colors"
          >
            Create your free account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="mt-6 text-sm text-paper/55">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-paper font-medium hover:text-moss-200 transition-colors underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
