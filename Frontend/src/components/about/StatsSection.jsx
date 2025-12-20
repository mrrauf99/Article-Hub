import StatCard from "./StatCard";

export default function StatsSection() {
  return (
    <section className="bg-white py-12 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="2" label="Founders" sublabel="Building together" />
          <StatCard number="100%" label="Ad-Free" sublabel="Forever" />
          <StatCard number="∞" label="Possibilities" sublabel="For creators" />
          <StatCard
            number="2025"
            label="Founded"
            sublabel="Just getting started"
          />
        </div>
      </div>
    </section>
  );
}
