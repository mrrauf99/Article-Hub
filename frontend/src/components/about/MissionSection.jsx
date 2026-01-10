import { Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function MissionSection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 text-center">
        <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal animation="scale" duration={500}>
          <Sparkles className="h-12 w-12 text-sky-400 mx-auto mb-6" />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100} duration={600}>
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
            We're not trying to maximize time-on-site or optimize for ad
            revenue. We're building something that actually serves the people
            who use it.
          </p>
        </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
