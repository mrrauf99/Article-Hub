import { PenTool, Code2, Users, CheckCircle2 } from "lucide-react";
import { FEATURES } from "@/data/about/features";
import OfferCard from "./OfferCard";
import { ScrollReveal } from "@/components/ScrollReveal";

const OFFERS = [
  {
    icon: <PenTool className="h-4.5 w-4.5" />,
    title: "For readers",
    text: "Discover thoughtfully curated articles, free from ads and noise. Save favorites and build your own collections.",
  },
  {
    icon: <Code2 className="h-4.5 w-4.5" />,
    title: "For writers",
    text: "A distraction-free markdown editor with powerful formatting. Focus on ideas while we handle publishing and hosting.",
  },
  {
    icon: <Users className="h-4.5 w-4.5" />,
    title: "For teams",
    text: "Build knowledge repositories and preserve institutional wisdom together, with role-based permissions.",
  },
];

export default function OfferSection() {
  return (
    <section className="bg-paper py-14 sm:py-20 font-ui">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up" duration={500}>
            <div className="max-w-xl mb-10">
              <h2 className="font-editorial text-3xl sm:text-4xl text-ink mb-3">
                Built for everyone
              </h2>
              <p className="text-ink-muted">
                Whether you're reading to learn or writing to share, Article
                Hub gives you the tools to do your best work.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100} duration={500}>
            <div className="rounded-xl border border-hairline bg-paper-raised grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline mb-6">
              {OFFERS.map((offer) => (
                <OfferCard key={offer.title} {...offer} />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} duration={500}>
            <div className="rounded-xl border border-hairline bg-ink-950 p-7 sm:p-9">
              <h3 className="font-editorial text-xl text-paper mb-6">
                Everything you need, nothing you don't
              </h3>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-moss-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-paper/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
