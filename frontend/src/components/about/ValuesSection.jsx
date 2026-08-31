import { VALUES } from "@/data/about/values";
import ValueCard from "./ValueCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ValuesSection() {
  return (
    <section className="bg-paper py-14 sm:py-20 font-ui">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up" duration={500}>
            <div className="max-w-xl mb-10">
              <h2 className="font-editorial text-3xl sm:text-4xl text-ink mb-3">
                What we stand for
              </h2>
              <p className="text-ink-muted">
                The principles that guide every decision we make.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            {VALUES.map((value, index) => (
              <ScrollReveal
                key={value.title}
                animation="fade-up"
                delay={index * 80}
                duration={450}
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
