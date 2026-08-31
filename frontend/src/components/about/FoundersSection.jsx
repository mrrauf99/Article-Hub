import { FOUNDERS } from "@/data/about/founders";
import FounderCard from "./FounderCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FoundersSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-14 sm:py-20 bg-paper font-ui">
      <div className="w-full max-w-5xl mx-auto">
        <ScrollReveal animation="fade-up" duration={500}>
          <div className="max-w-xl mb-10">
            <h2 className="font-editorial text-3xl sm:text-4xl text-ink mb-3">
              Meet the founder
            </h2>
            <p className="text-ink-muted">
              Combining technical expertise with thoughtful design, for
              writers and readers who value depth and clarity.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 max-w-2xl">
          {FOUNDERS.map((founder, index) => (
            <ScrollReveal
              key={founder.name}
              animation="fade-up"
              delay={index * 100}
              duration={500}
            >
              <FounderCard founder={founder} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
