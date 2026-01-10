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
    title: "Distraction-Free Reading",
    description:
      "Clean, beautiful typography and layouts that let you focus on what matters—the content.",
    color: "sky",
  },
  {
    icon: Edit3,
    title: "Powerful Editor",
    description:
      "Write with a markdown-based editor that makes formatting effortless and beautiful.",
    color: "indigo",
  },
  {
    icon: Shield,
    title: "No Ads, No Tracking",
    description:
      "Your privacy matters. We don't track you or bombard you with advertisements.",
    color: "emerald",
  },
  {
    icon: Smartphone,
    title: "Fully Responsive",
    description:
      "Read and write from any device. Our platform adapts perfectly to every screen size.",
    color: "violet",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Find exactly what you're looking for with advanced search and filtering options.",
    color: "amber",
  },
  {
    icon: Bookmark,
    title: "Save & Organize",
    description:
      "Bookmark articles and create personal collections to read later.",
    color: "rose",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a community of writers and readers passionate about quality content.",
    color: "cyan",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Blazing fast load times and smooth interactions. Speed is a feature, not a luxury.",
    color: "orange",
  },
];

const COLOR_CLASSES = {
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    ring: "group-hover:ring-sky-500",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    ring: "group-hover:ring-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    ring: "group-hover:ring-emerald-500",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    ring: "group-hover:ring-violet-500",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    ring: "group-hover:ring-amber-500",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    ring: "group-hover:ring-rose-500",
  },
  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    ring: "group-hover:ring-cyan-500",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    ring: "group-hover:ring-orange-500",
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal animation="fade-up" duration={600}>
            <div className="text-center mb-10 sm:mb-16 px-4">
              <span className="inline-block text-sky-600 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  Read & Write
                </span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                Article Hub is designed with both readers and writers in mind.
                Here's what makes us different.
              </p>
            </div>
          </ScrollReveal>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => {
            const colors = COLOR_CLASSES[feature.color];
            return (
              <ScrollReveal
                key={feature.title}
                animation="fade-up"
                delay={index * 100}
                duration={500}
              >
                <div
                  className={`group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 ring-1 ring-transparent ${colors.ring} h-full`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.text} mb-5`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
