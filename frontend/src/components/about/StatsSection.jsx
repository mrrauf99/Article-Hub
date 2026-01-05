import StatCard from "./StatCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function StatsSection() {
  const stats = [
    { number: "2", label: "Founders", sublabel: "Building together" },
    { number: "100%", label: "Ad-Free", sublabel: "Forever" },
    { number: "∞", label: "Possibilities", sublabel: "For creators" },
    { number: "2025", label: "Founded", sublabel: "Just getting started" },
  ];

  return (
    <section className="bg-white py-12 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
    </section>
  );
}
