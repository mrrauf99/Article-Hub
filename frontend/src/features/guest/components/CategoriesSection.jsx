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
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const CATEGORY_ICONS = {
  // Core tech categories
  Technology: Cpu,
  Programming: Code2,
  "Web Development": Globe,
  "Mobile Development": Smartphone,
  "Artificial Intelligence": Brain,
  "Data Science": Database,
  Databases: Database,
  "Cloud Computing": Cloud,

  // Security
  "Cyber Security": Shield,
  Security: Shield,

  // Engineering disciplines
  DevOps: Settings,
  "Software Engineering": Layers,
  "Software Architecture": Layers,
  "Backend Engineering": Layers,
  "Full Stack": GitBranch,
  Frontend: Globe,
  "System Design": GitBranch,

  // Misc content types
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

const CATEGORY_COLORS = {
  // Core tech categories
  Technology: "from-blue-500 to-cyan-500",
  Programming: "from-violet-500 to-purple-500",
  "Web Development": "from-orange-500 to-amber-500",
  "Mobile Development": "from-green-500 to-emerald-500",
  "Artificial Intelligence": "from-pink-500 to-rose-500",
  "Data Science": "from-indigo-500 to-blue-500",
  Databases: "from-teal-500 to-cyan-500",
  "Cloud Computing": "from-sky-500 to-blue-500",

  // Security
  "Cyber Security": "from-red-500 to-orange-500",
  Security: "from-red-500 to-orange-500",

  // Engineering disciplines
  DevOps: "from-slate-500 to-gray-600",
  "Software Engineering": "from-fuchsia-500 to-pink-500",
  "Software Architecture": "from-fuchsia-500 to-pink-500",
  "Backend Engineering": "from-emerald-500 to-teal-500",
  "Full Stack": "from-amber-500 to-yellow-500",
  Frontend: "from-sky-500 to-indigo-500",
  "System Design": "from-amber-500 to-yellow-500",

  // Misc content types
  "Open Source": "from-emerald-500 to-teal-500",
  "Tech News": "from-blue-600 to-indigo-600",
  "Career & Jobs": "from-purple-500 to-violet-500",
  Education: "from-cyan-500 to-blue-500",
  Startups: "from-rose-500 to-pink-500",
  Productivity: "from-yellow-500 to-orange-500",
  "Business & Tech": "from-slate-600 to-slate-700",
  Opinion: "from-indigo-400 to-purple-500",
  Other: "from-gray-500 to-slate-500",
};

export default function CategoriesSection({
  categories,
  onSelect,
  articleCounts = {},
}) {
  // Show top 8 categories (excluding the synthetic "All" entry)
  // Categories are already ranked in HomePage, so we just take the first 8.
  const displayCategories = categories.filter((c) => c !== "All").slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Dive into articles across 21 different topics, from programming to
              AI, career advice to startup insights.
            </p>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category] || MoreHorizontal;
            const gradient =
              CATEGORY_COLORS[category] || "from-gray-500 to-slate-500";
            const count = articleCounts[category] || 0;

            return (
              <ScrollReveal
                key={category}
                animation="scale"
                delay={index * 75}
                duration={500}
              >
                <button
                  onClick={() => {
                    onSelect(category);
                    setTimeout(() => {
                      document
                        .getElementById("articles")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden w-full"
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-white transition-colors mb-1">
                      {category}
                    </h3>
                    <p className="text-sm text-slate-500 group-hover:text-white/80 transition-colors">
                      {count} {count === 1 ? "article" : "articles"}
                    </p>
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Categories */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                onSelect("All");
                setTimeout(() => {
                  document
                    .getElementById("articles")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
            >
              View all categories
              <svg
                className="w-4 h-4 translate-y-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
