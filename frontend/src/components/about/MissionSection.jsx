import { ScrollReveal } from "@/components/ScrollReveal";

export default function MissionSection() {
  return (
    <section className="bg-ink-950 text-paper py-14 sm:py-20 font-ui">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-2xl mx-auto">
          <ScrollReveal animation="fade-up" duration={500}>
            <h2 className="font-editorial text-3xl sm:text-4xl mb-5">
              Our mission
            </h2>
            <p className="text-lg text-paper/75 leading-relaxed mb-4">
              To create a digital space where{" "}
              <span className="text-paper font-semibold">
                meaningful content thrives
              </span>
              , writers feel empowered, and readers can learn deeply without
              distraction.
            </p>
            <p className="text-paper/55">
              We're not optimizing for time-on-site or ad revenue. We're
              building something that actually serves the people who use it.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
