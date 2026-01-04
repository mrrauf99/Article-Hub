import { ScrollReveal } from "@/components/ScrollReveal";

export default function LegalLayout({ title, description, children }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14  sm:py-16 md:py-20">
      <ScrollReveal animation="fade-up" duration={600}>
        <header className="text-center mb-10 sm:mb-12 md:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {description}
          </p>
        </header>
      </ScrollReveal>

      <div className="space-y-8 sm:space-y-10">{children}</div>
    </section>
  );
}
