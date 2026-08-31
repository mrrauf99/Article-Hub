import {
  BookOpen,
  Edit3,
  Shield,
  Smartphone,
  Search,
  Bookmark,
  Users,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Distraction-free reading",
    description:
      "Clean typography and layouts that let you focus on the writing itself.",
  },
  {
    icon: Edit3,
    title: "A markdown editor that gets out of your way",
    description: "Formatting that stays effortless, from draft to publish.",
  },
  {
    icon: Shield,
    title: "No ads, no tracking",
    description: "We don't track you or interrupt your reading with ads.",
  },
  {
    icon: Smartphone,
    title: "Fully responsive",
    description: "Read and write from any device, without compromise.",
  },
  {
    icon: Search,
    title: "Smart search and filtering",
    description: "Find what you're looking for across every category.",
  },
  {
    icon: Bookmark,
    title: "Save and organize",
    description: "Bookmark articles and build your own reading list.",
  },
  {
    icon: Users,
    title: "A community, not an audience",
    description: "Writers and readers who value quality over reach.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    description: "Quick load times and smooth interactions, everywhere.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14 sm:py-20 bg-paper-raised font-ui">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={500}>
          <div className="max-w-xl mb-10 sm:mb-14">
            <h2 className="font-editorial text-2xl sm:text-3xl text-ink mb-3">
              Built for readers and writers alike
            </h2>
            <p className="text-ink-muted">
              Article Hub is designed with both in mind. Here's what makes it
              different.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 sm:gap-x-12">
          {FEATURES.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              animation="fade-up"
              delay={index * 60}
              duration={450}
            >
              <div
                className={`flex gap-4 py-5 border-hairline ${
                  index === 0
                    ? "border-t-0"
                    : index === 1
                      ? "border-t sm:border-t-0"
                      : "border-t"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                  <feature.icon className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
