import prisma from "../prisma/client.js";

export const SITEMAP_ORIGIN = "https://articlehub.me";
// These are the public, indexable static routes; approved articles are added below.
export const SITEMAP_STATIC_PATHS = Object.freeze([
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
]);
export const MAX_URLS_PER_SITEMAP = 50_000;

const XML_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
const APPROVED_ARTICLES_WHERE = Object.freeze({ status: "approved" });
const XML_ENTITIES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
});

export function escapeXml(value) {
  return String(value).replace(/[&<>"]/g, (character) => XML_ENTITIES[character])
    .replace(/'/g, XML_ENTITIES["'"]);
}

export function formatLastmod(value) {
  if (value === null || value === undefined || value === "") return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function toCanonicalUrl(path) {
  const parsedUrl = new URL(path, SITEMAP_ORIGIN);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";

  return new URL(pathname, SITEMAP_ORIGIN).toString();
}

function uniqueEntries(entries) {
  const unique = new Map();

  for (const entry of entries) {
    const loc = toCanonicalUrl(entry.path);
    const lastmod = formatLastmod(entry.lastmod);
    const existing = unique.get(loc);

    if (!existing || (!existing.lastmod && lastmod)) {
      unique.set(loc, { loc, lastmod });
    }
  }

  return [...unique.values()];
}

export function buildSitemapXml(entries) {
  const urls = uniqueEntries(entries);
  const body = urls
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod
        ? "\n    <lastmod>" + escapeXml(lastmod) + "</lastmod>"
        : "";

      return "  <url>\n    <loc>" + escapeXml(loc) + "</loc>" + lastmodTag + "\n  </url>";
    })
    .join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="' +
    XML_NAMESPACE +
    '">' +
    (body ? "\n" + body + "\n" : "") +
    "</urlset>"
  );
}

export function buildSitemapIndexXml(paths) {
  const locations = [...new Set(paths.map(toCanonicalUrl))];
  const body = locations
    .map((loc) => "  <sitemap>\n    <loc>" + escapeXml(loc) + "</loc>\n  </sitemap>")
    .join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="' +
    XML_NAMESPACE +
    '">' +
    (body ? "\n" + body + "\n" : "") +
    "</sitemapindex>"
  );
}

export function createSitemapService(articleRepository = prisma.article) {
  async function countApprovedArticles() {
    return articleRepository.count({ where: APPROVED_ARTICLES_WHERE });
  }

  async function findApprovedArticles({ skip = 0, take }) {
    return articleRepository.findMany({
      where: APPROVED_ARTICLES_WHERE,
      select: { id: true, publishedAt: true },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
      skip,
      take,
    });
  }

  function articleEntries(articles) {
    return articles.map((article) => ({
      path: "/articles/" + encodeURIComponent(article.id),
      lastmod: article.publishedAt,
    }));
  }

  async function getSitemapXml() {
    const articleCount = await countApprovedArticles();
    const staticEntries = SITEMAP_STATIC_PATHS.map((path) => ({ path }));
    const articleUrlCapacity = MAX_URLS_PER_SITEMAP - staticEntries.length;

    if (articleCount <= articleUrlCapacity) {
      const articles = articleCount
        ? await findApprovedArticles({ take: articleUrlCapacity })
        : [];

      return buildSitemapXml([...staticEntries, ...articleEntries(articles)]);
    }

    const articleSitemapCount = Math.ceil(
      articleCount / MAX_URLS_PER_SITEMAP,
    );
    if (articleSitemapCount + 1 > MAX_URLS_PER_SITEMAP) {
      throw new Error("Sitemap index exceeds the Sitemaps protocol limit.");
    }

    const paths = ["/sitemap-static.xml"];
    for (let page = 1; page <= articleSitemapCount; page += 1) {
      paths.push("/sitemaps/articles/" + page + ".xml");
    }

    return buildSitemapIndexXml(paths);
  }

  async function getStaticSitemapXml() {
    return buildSitemapXml(SITEMAP_STATIC_PATHS.map((path) => ({ path })));
  }

  async function getArticleSitemapXml(page) {
    const articleCount = await countApprovedArticles();
    const pageCount = Math.ceil(articleCount / MAX_URLS_PER_SITEMAP);
    if (page < 1 || page > pageCount) return null;

    const articles = await findApprovedArticles({
      skip: (page - 1) * MAX_URLS_PER_SITEMAP,
      take: MAX_URLS_PER_SITEMAP,
    });

    return buildSitemapXml(articleEntries(articles));
  }

  return {
    getSitemapXml,
    getStaticSitemapXml,
    getArticleSitemapXml,
  };
}
