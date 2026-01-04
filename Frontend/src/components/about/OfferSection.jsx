import { PenTool, Code2, Users, CheckCircle2 } from "lucide-react";
import { FEATURES } from "@/data/about/features";
import OfferCard from "./OfferCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function OfferSection() {
  const offers = [
    {
      icon: <PenTool className="h-5 w-5 text-sky-600" />,
      title: "For Readers",
      text: "Discover thoughtfully curated articles free from ads and noise. Enjoy a reading experience designed for focus and comprehension. Save your favorites, build collections, and learn at your own pace.",
      gradient: "from-sky-50 to-blue-50",
    },
    {
      icon: <Code2 className="h-5 w-5 text-indigo-600" />,
      title: "For Writers",
      text: "A distraction-free markdown editor with powerful formatting options. Focus on your ideas while we handle publishing, hosting, and distribution. Your content, your way—always.",
      gradient: "from-indigo-50 to-purple-50",
    },
    {
      icon: <Users className="h-5 w-5 text-purple-600" />,
      title: "For Teams",
      text: "Build knowledge repositories, document processes, and preserve institutional wisdom together. Collaborate seamlessly with role-based permissions and version control.",
      gradient: "from-purple-50 to-pink-50",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Built for Everyone
            </h2>
            <p className="text-base text-slate-600 max-w-2xl">
              Whether you're reading to learn or writing to share, Article Hub
              provides the tools and environment you need to do your best work.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {offers.map((offer, index) => (
            <ScrollReveal
              key={offer.title}
              animation="fade-up"
              delay={index * 100}
              duration={500}
            >
              <OfferCard {...offer} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fade-up" delay={300} duration={600}>
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Everything You Need, Nothing You Don't
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((feature, index) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
