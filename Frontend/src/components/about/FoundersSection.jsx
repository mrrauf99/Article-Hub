import { User2 } from "lucide-react";
import { FOUNDERS } from "@/data/about/founders";
import FounderCard from "./FounderCard";

export default function FoundersSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3 mb-3">
        <User2 className="h-8 w-8 text-sky-600" />
        Meet the Founders
      </h2>

      <p className="text-base text-slate-600 max-w-2xl mb-10">
        Two creators combining technical expertise with thoughtful design to
        build a platform that puts quality first. We're developers, designers,
        and writers who understand the challenges because we've lived them.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {FOUNDERS.map((founder) => (
          <FounderCard key={founder.name} founder={founder} />
        ))}
      </div>
    </section>
  );
}
