import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Await,
  useAsyncValue,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import HeroSection from "../components/HeroSection";
import FeaturedArticles from "../components/FeaturedArticles";
import CTASection from "../components/CTASection";
import ArticlesGrid from "../components/ArticlesGrid";
import NewsletterSection from "../components/NewsletterSection";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";
import { normalizeCategory, getCanonicalCategory } from "@/utils/categoryUtils";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";

export default function HomePage() {
  const { articlesPromise } = useLoaderData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;

    articlesPromise
      .then(({ articles, meta }) => {
        if (!active) return;
        setStats({
          articleCount: meta?.overallCount ?? articles.length,
          authorCount: meta?.authorCount ?? 0,
        });
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [articlesPromise]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    logo: new URL(SITE_CONFIG.logo, SITE_CONFIG.siteUrl).toString(),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
  };

  return (
    <div className="min-h-screen bg-paper font-ui">
      <SEO
        title="Home"
        description={SITE_CONFIG.description}
        canonicalPath="/"
        schema={[organizationSchema, websiteSchema]}
      />
      <HeroSection
        articleCount={stats?.articleCount}
        authorCount={stats?.authorCount}
      />
      <Suspense fallback={<HomeArticlesFallback />}>
        <Await resolve={articlesPromise}>
          <HomeArticleSections />
        </Await>
      </Suspense>
    </div>
  );
}

function HomeArticleSections() {
  const { articles, pagination, meta } = useAsyncValue();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const rawCategory = searchParams.get("category");
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    if (!rawCategory) return "All";
    const canonical = getCanonicalCategory(rawCategory);
    return canonical || "All";
  }, [rawCategory]);

  const articleCounts = useMemo(() => {
    const counts = {};
    (meta?.categoryCounts || []).forEach(({ category, count }) => {
      const normalized = normalizeCategory(category);
      counts[normalized] = count;
    });
    return counts;
  }, [meta?.categoryCounts]);

  const categories = useMemo(() => {
    const ranked = Object.entries(articleCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .filter((cat) => ARTICLE_CATEGORIES.includes(cat));

    const remaining = ARTICLE_CATEGORIES.filter(
      (category) => !ranked.includes(category),
    );

    return ["All", ...ranked, ...remaining];
  }, [articleCounts]);

  useEffect(() => {
    if (location.hash !== "#articles") return;
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById("articles");
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const scrollY = window.pageYOffset || window.scrollY;
        const top = Math.max(0, rect.top + scrollY - 20);
        window.scrollTo({ top, behavior: "smooth" });
      });
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [location.hash]);

  function getPageHref(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${location.pathname}?${params.toString()}`;
  }

  function getCategoryHref(category) {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    return `${location.pathname}?${params.toString()}`;
  }

  function handleCategorySelect(category) {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    setSearchParams(params, { preventScrollReset: true });
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <>
      <FeaturedArticles articles={articles} />
      <ArticlesGrid
        articles={articles}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        page={pageParam}
        onPageChange={handlePageChange}
        totalCount={pagination?.totalCount ?? articles.length}
        totalPages={pagination?.totalPages ?? 1}
        getPageHref={getPageHref}
        getCategoryHref={getCategoryHref}
      />
      <NewsletterSection />
      <CTASection />
    </>
  );
}

function HomeArticlesFallback() {
  return (
    <>
      <section
        aria-busy="true"
        aria-label="Loading featured articles"
        className="py-14 sm:py-20 bg-paper-raised font-ui"
      >
        <p className="sr-only" role="status">
          Loading articles
        </p>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonBlock className="h-8 w-56 mb-8 sm:mb-10" />
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 sm:gap-8 items-start">
            <div className="overflow-hidden rounded-xl border border-hairline bg-paper">
              <SkeletonBlock className="aspect-[16/10] rounded-none" />
              <div className="p-5 sm:p-6 space-y-3">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            </div>
            <div className="flex flex-col gap-5 sm:gap-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-hairline bg-paper p-4"
                >
                  <SkeletonBlock className="w-28 sm:w-32 aspect-square shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-4/5" />
                    <SkeletonBlock className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        id="articles"
        aria-busy="true"
        aria-label="Loading article list"
        className="py-14 sm:py-20 bg-paper font-ui"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3">
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <div className="hidden lg:flex gap-2 mb-10">
            {Array.from({ length: 6 }, (_, index) => (
              <SkeletonBlock key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-hairline bg-paper"
              >
                <SkeletonBlock className="h-48 rounded-none" />
                <div className="p-5 space-y-3">
                  <SkeletonBlock className="h-3 w-20" />
                  <SkeletonBlock className="h-5 w-4/5" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-2/3" />
                  <SkeletonBlock className="h-3 w-1/2 pt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SkeletonBlock({ className }) {
  return <div aria-hidden="true" className={`rounded bg-ink/[0.05] ${className}`} />;
}
