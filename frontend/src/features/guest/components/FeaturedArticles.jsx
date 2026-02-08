import { Link } from "react-router-dom";
import { Eye, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import formatCount from "@/utils/formatCount";

export default function FeaturedArticles({ articles }) {
  // Get top 3 articles by views
  const featured = articles
    .filter((a) => a.image_url)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal animation="fade-up" duration={600}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-sky-600 font-semibold text-xs sm:text-sm mb-2">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  TRENDING NOW
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                  Featured Articles
                </h2>
              </div>
              <Link
                to="#articles"
                className="hidden md:inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                View all articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Featured Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Main Featured Article */}
            <ScrollReveal animation="fade-right" delay={100} duration={700}>
              <Link
                to={`/articles/${main.article_id}`}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 block"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={main.image_url}
                    alt={main.title}
                    className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                  <span className="inline-block bg-sky-500 text-white text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
                    {main.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-sky-200 transition-colors">
                    {main.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 line-clamp-2 mb-3 sm:mb-4">
                    {main.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                    <span className="font-medium text-white">
                      {main.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {formatCount(main.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {formatDate(main.published_at)}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Secondary Featured Articles */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {rest.map((article, index) => (
                <ScrollReveal
                  key={article.article_id}
                  animation="fade-left"
                  delay={200 + index * 150}
                  duration={600}
                >
                  <Link
                    to={`/articles/${article.article_id}`}
                    className="group flex gap-4 sm:gap-5 bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-contain sm:object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <span className="text-xs font-semibold text-sky-600 mb-1.5 sm:mb-2">
                        {article.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500">
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

          {/* Mobile View All */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="mt-6 sm:mt-8 text-center md:hidden">
              <Link
                to="#articles"
                className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
              >
                View all articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
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
