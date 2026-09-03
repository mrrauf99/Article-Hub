import { Link } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter, stripMarkdown } from "@/utils/stringUtils";

export default function FeaturedArticles({ articles }) {
  const featured = articles
    .filter((a) => a.image_url)
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;

  return (
    <section className="py-14 sm:py-20 bg-paper-raised font-ui">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" duration={500}>
          <div className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="font-editorial text-2xl sm:text-3xl text-ink">
              Most read right now
            </h2>
            <a
              href="#articles"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-moss-700 hover:text-moss-800 transition-colors"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 sm:gap-8 items-start">
          <ScrollReveal animation="fade-right" delay={80} duration={600}>
            <Link
              to={`/articles/${main.id}`}
              className="group relative flex flex-col rounded-xl overflow-hidden border border-hairline hover:border-hairline-strong transition-colors block"
            >
              <div className="aspect-[16/10] overflow-hidden bg-paper">
                <img
                  src={main.image_url}
                  alt={main.title}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6">
                <span className="inline-block text-xs font-semibold uppercase tracking-wide text-moss-700 mb-2.5">
                  {main.category}
                </span>
                <h3 className="font-editorial text-xl sm:text-2xl text-ink mb-2 leading-snug group-hover:text-moss-800 transition-colors">
                  {capitalizeFirstLetter(main.title)}
                </h3>
                <p className="text-sm text-ink-muted line-clamp-2 mb-4 max-w-[58ch]">
                  {stripMarkdown(main.summary)}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-faint">
                  <span className="font-medium text-ink-muted">
                    {main.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {formatCount(main.views)}
                  </span>
                  <span>{formatDate(main.published_at)}</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Cards use natural height, not stretched to match the hero — a shorter column here is expected */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {rest.map((article, index) => (
              <ScrollReveal
                key={article.id}
                animation="fade-left"
                delay={160 + index * 120}
                duration={550}
              >
                <Link
                  to={`/articles/${article.id}`}
                  className="group flex gap-4 rounded-xl border border-hairline hover:border-hairline-strong p-4 transition-colors"
                >
                  <div className="w-28 sm:w-32 aspect-square shrink-0 rounded-lg overflow-hidden bg-paper">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-moss-700 mb-1.5">
                      {article.category}
                    </span>
                    <h4 className="font-semibold text-sm text-ink line-clamp-2 mb-1.5 group-hover:text-moss-800 transition-colors">
                      {capitalizeFirstLetter(article.title)}
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2 mb-2">
                      {stripMarkdown(article.summary)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-ink-faint mt-auto">
                      <span className="truncate">{article.author_name}</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Eye className="w-3 h-3" />
                        {formatCount(article.views)}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center md:hidden">
          <a
            href="#articles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-700"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function formatDate(dateString) {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
