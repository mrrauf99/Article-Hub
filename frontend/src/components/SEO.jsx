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
  const isDefaultImage = !image;
  const imageUrl = toAbsoluteUrl(image || SITE_CONFIG.ogImage);
  const robots = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;

  // Pages that don't build their own schema (About, Contact, Privacy,
  // Terms, …) still get a minimal, accurate WebPage entry from the same
  // title/description/url every page already renders as meta tags —
  // nothing here is data the frontend doesn't already have.
  const schemaEntries =
    schema.length > 0
      ? schema
      : [
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: metaTitle,
            description: metaDescription,
            url: canonicalUrl,
            isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: siteUrl },
          },
        ];

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
      {imageUrl && isDefaultImage && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {schemaEntries.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}
