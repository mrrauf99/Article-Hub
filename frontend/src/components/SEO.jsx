import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/config/site.config";

const DEFAULT_LOCALE = "en_US";

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = SITE_CONFIG.siteUrl || "https://articlehub.me";
  return new URL(url, base).toString();
}

function buildTitle(title) {
  const siteName = SITE_CONFIG.name;
  if (!title) return siteName;
  const lowerTitle = title.toLowerCase();
  const lowerSite = siteName.toLowerCase();
  if (lowerTitle.includes(lowerSite)) return title;
  return `${title} | ${siteName}`;
}

export default function SEO({
  title,
  description,
  canonicalPath = "/",
  image,
  type = "website",
  noindex = false,
  nofollow = false,
  schema = [],
}) {
  const siteUrl = SITE_CONFIG.siteUrl || "https://articlehub.me";
  const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
  const metaDescription = description || SITE_CONFIG.description;
  const metaTitle = buildTitle(title);
  const imageUrl = toAbsoluteUrl(image || SITE_CONFIG.ogImage);
  const robots = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {schema.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </Helmet>
  );
}
