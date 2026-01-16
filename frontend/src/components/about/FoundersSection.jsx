import { User2 } from "lucide-react";
import { FOUNDERS } from "@/data/about/founders";
import FounderCard from "./FounderCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FoundersSection() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="w-full max-w-6xl mx-auto">
      <ScrollReveal animation="fade-up" duration={600}>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-3">
          <User2 className="h-8 w-8 text-sky-600" />
          Meet the Founders
        </h2>

        <p className="text-base text-slate-600 max-w-2xl mb-10">
          Two creators combining technical expertise with thoughtful design to
          build a platform that puts quality first. We're developers, designers,
          and writers who understand the challenges because we've lived them.
        </p>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-2">
        {FOUNDERS.map((founder, index) => (
          <ScrollReveal
            key={founder.name}
            animation={index === 0 ? "fade-right" : "fade-left"}
            delay={index * 150}
            duration={600}
          >
            <FounderCard founder={founder} />
          </ScrollReveal>
        ))}
      </div>
      </div>
    </section>
  );
}
