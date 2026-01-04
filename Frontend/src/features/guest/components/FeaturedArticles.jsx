import { Link } from "react-router-dom";
import { Eye, Clock, ArrowRight, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function FeaturedArticles({ articles }) {
  // Get top 3 articles by views
  const featured = articles
    .filter((a) => a.image_url)
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  if (featured.length === 0) return null;

  const [main, ...rest] = featured;

  return (
    <section className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up" duration={600}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-sky-600 font-semibold text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                TRENDING NOW
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
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
        <div className="grid lg:grid-cols-2 gap-8">
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
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <span className="inline-block bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {main.category}
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 line-clamp-2 group-hover:text-sky-200 transition-colors">
                  {main.title}
                </h3>
                <p className="text-slate-300 line-clamp-2 mb-4">
                  {main.summary}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="font-medium text-white">
                    {main.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {main.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(main.published_at)}
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Secondary Featured Articles */}
          <div className="flex flex-col gap-6">
            {rest.map((article, index) => (
              <ScrollReveal
                key={article.article_id}
                animation="fade-left"
                delay={200 + index * 150}
                duration={600}
              >
                <Link
                  to={`/articles/${article.article_id}`}
                  className="group flex gap-5 bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs font-semibold text-sky-600 mb-2">
                      {article.category}
                    </span>
                    <h4 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{article.author_name}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views}
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
          <div className="mt-8 text-center md:hidden">
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
    </section>
  );
}

function formatDate(dateString) {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
