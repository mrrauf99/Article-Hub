import StatCard from "./StatCard";
import { CONTACT_STATS } from "../data/contactStats";

export default function ContactStats() {
  return (
    <section className="mt-20">
      <header className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Why Reach Out to Us?
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Join thousands of satisfied users who have connected with us
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CONTACT_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            description={stat.description}
          />
        ))}
      </div>
    </section>
  );
}
