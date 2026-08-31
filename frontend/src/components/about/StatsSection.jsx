import StatCard from "@/components/StatCard";
import StatsGrid from "@/components/StatsGrid";

const STATS = [
  { key: "founder", value: "1", label: "Founder", sublabel: "Building with passion" },
  { key: "adfree", value: "100%", label: "Ad-free", sublabel: "Forever" },
  { key: "founded", value: "2025", label: "Founded", sublabel: "Just getting started" },
];

export default function StatsSection() {
  return (
    <section className="bg-paper-raised py-10 sm:py-12 border-y border-hairline font-ui">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <StatsGrid
            items={STATS}
            gridClassName="grid grid-cols-3 divide-x divide-hairline"
            staggerDelay={80}
            renderItem={(stat) => (
              <div className="text-center px-3">
                <StatCard
                  variant="plain"
                  value={stat.value}
                  label={stat.label}
                  sublabel={stat.sublabel}
                />
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
