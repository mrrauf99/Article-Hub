import { VALUES } from "@/data/about/values";
import ValueCard from "./ValueCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ValuesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These aren't just words on a page. They're the principles that
              guide every decision we make.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map((value, index) => (
            <ScrollReveal
              key={value.title}
              animation="fade-up"
              delay={index * 100}
              duration={500}
            >
              <ValueCard {...value} />
            </ScrollReveal>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
