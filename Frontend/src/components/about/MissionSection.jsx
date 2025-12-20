import { Sparkles } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <Sparkles className="h-12 w-12 text-sky-400 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-4">
          To create a digital space where{" "}
          <span className="text-sky-400 font-semibold">
            meaningful content thrives
          </span>
          , writers feel empowered, and readers can learn deeply without
          distraction.
        </p>
        <p className="text-base text-slate-400">
          We're not trying to maximize time-on-site or optimize for ad revenue.
          We're building something that actually serves the people who use it.
        </p>
      </div>
    </section>
  );
}
