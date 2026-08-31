import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

export default function HeroSection({ articleCount, authorCount }) {
  const stats = [
    { value: articleCount || "0", label: "Articles published" },
    { value: authorCount || "0", label: "Writers publishing" },
    { value: ARTICLE_CATEGORIES.length, label: "Categories to explore" },
  ];

  return (
    <section className="bg-paper font-ui">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-start">
          <div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] text-ink mb-6 max-w-xl">
              Writing worth reading, curated with care.
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed max-w-lg mb-9">
              A moderated platform where writers publish and readers explore,
              without ads, noise, or algorithmic feeds.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-ink hover:bg-moss-700 text-paper px-6 py-3.5 rounded-full font-semibold text-[0.9375rem] transition-colors"
              >
                Start writing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#articles"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[0.9375rem] text-ink border border-hairline-strong hover:border-ink transition-colors"
              >
                Explore articles
              </a>
            </div>
          </div>

          <div className="border border-hairline rounded-xl bg-paper-raised p-6 sm:p-7 lg:mt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              On Article Hub
            </span>
            <dl className="mt-4 divide-y divide-hairline">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="text-sm text-ink-muted">{stat.label}</dt>
                  <dd className="font-editorial text-2xl text-ink shrink-0">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 pt-4 border-t border-hairline text-sm text-moss-700 font-medium">
              No ads. No algorithmic feed. Ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
