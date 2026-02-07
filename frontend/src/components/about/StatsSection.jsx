import StatCard from "@/components/StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function StatsSection() {
  const stats = [
    { number: "2", label: "Founders", sublabel: "Building together" },
    { number: "100%", label: "Ad-Free", sublabel: "Forever" },
    { number: "∞", label: "Possibilities", sublabel: "For creators" },
    { number: "2025", label: "Founded", sublabel: "Just getting started" },
  ];

  return (
    <section className="bg-white py-10 sm:py-12 border-y border-slate-200 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal
                key={stat.label}
                animation="fade-up"
                delay={index * 100}
                duration={500}
              >
                <StatCard {...stat} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
