import { VALUES } from "@/data/about/values";
import ValueCard from "./ValueCard";

export default function ValuesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            What We Stand For
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            These aren't just words on a page. They're the principles that guide
            every decision we make.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}
