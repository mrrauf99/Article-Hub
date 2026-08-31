import { Link, useRouteLoaderData } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function AboutCTA() {
  const data = useRouteLoaderData("public-layout");
  const user = data?.user || null;
  const isAdmin = user?.role === "admin";

  const primary = isAdmin
    ? { to: "/admin/dashboard", label: "Go to dashboard" }
    : user
      ? { to: "/user/articles/new", label: "Start writing" }
      : { to: "/register", label: "Create your account" };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 bg-ink-950 font-ui">
      <div className="w-full max-w-2xl mx-auto text-center">
        <ScrollReveal animation="fade-up" duration={500}>
          <h2 className="font-editorial text-3xl sm:text-4xl text-paper mb-4">
            Ready to join us?
          </h2>
          <p className="text-paper/65 mb-9 max-w-lg mx-auto">
            Be part of a community that values quality over quantity.
          </p>

          <Link
            to={primary.to}
            className="group inline-flex items-center gap-2 bg-paper hover:bg-moss-100 text-ink-950 px-7 py-3.5 rounded-full font-semibold text-[0.9375rem] transition-colors"
          >
            {primary.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <p className="mt-6 text-sm text-paper/55">
            Have a question first?{" "}
            <Link
              to="/contact"
              className="text-paper font-medium hover:text-moss-200 transition-colors underline underline-offset-4"
            >
              Get in touch
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
