import {
  Code2,
  Globe,
  Smartphone,
  Brain,
  Database,
  Shield,
  Cloud,
  Settings,
  Layers,
  GitBranch,
  BookOpen,
  Newspaper,
  Briefcase,
  GraduationCap,
  Rocket,
  Zap,
  Building2,
  MessageSquare,
  MoreHorizontal,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const CATEGORY_ICONS = {
  Technology: Cpu,
  Programming: Code2,
  "Web Development": Globe,
  "Mobile Development": Smartphone,
  "Artificial Intelligence": Brain,
  "Data Science": Database,
  Databases: Database,
  "Cloud Computing": Cloud,
  "Cyber Security": Shield,
  Security: Shield,
  DevOps: Settings,
  "Software Engineering": Layers,
  "Software Architecture": Layers,
  "Backend Engineering": Layers,
  "Full Stack": GitBranch,
  Frontend: Globe,
  "System Design": GitBranch,
  "Open Source": BookOpen,
  "Tech News": Newspaper,
  "Career & Jobs": Briefcase,
  Education: GraduationCap,
  Startups: Rocket,
  Productivity: Zap,
  "Business & Tech": Building2,
  Opinion: MessageSquare,
  Other: MoreHorizontal,
};

export default function CategoriesSection({
  categories,
  onSelect,
  articleCounts = {},
}) {
  const displayCategories = categories.filter((c) => c !== "All").slice(0, 8);

  function goToCategory(category) {
    onSelect(category);
    setTimeout(() => {
      document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <section className="py-14 sm:py-20 bg-paper font-ui">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={500}>
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-ink mb-2">
                Explore by category
              </h2>
              <p className="text-ink-muted max-w-xl">
                Browse writing across every corner of technology and craft.
              </p>
            </div>
            <button
              onClick={() => goToCategory("All")}
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-moss-700 hover:text-moss-800 transition-colors shrink-0"
            >
              All categories
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category] || MoreHorizontal;
            const count = articleCounts[category] || 0;

            return (
              <ScrollReveal
                key={category}
                animation="fade-up"
                delay={index * 60}
                duration={450}
              >
                <button
                  onClick={() => goToCategory(category)}
                  className="group flex w-full items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border border-hairline hover:border-moss-500 hover:bg-moss-50 transition-colors text-left"
                >
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700 group-hover:bg-moss-100 transition-colors">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-sm text-ink leading-snug">
                      {category}
                    </span>
                    <span className="block text-xs text-ink-faint mt-0.5">
                      {count} {count === 1 ? "article" : "articles"}
                    </span>
                  </span>
                </button>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => goToCategory("All")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-moss-700"
          >
            All categories
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
