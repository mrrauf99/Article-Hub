import { SITE_CONFIG } from "@/config/site.config";
import { capitalizeFirstLetter, stripMarkdown } from "@/utils/stringUtils";

const DESCRIPTION_LIMIT = 180;

export function buildArticleDescription({ introduction, summary, content }) {
  const preferred = introduction || summary || content || "";
  const cleanText = stripMarkdown(preferred.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " "));
  if (cleanText.length <= DESCRIPTION_LIMIT) {
    return cleanText || SITE_CONFIG.description;
  }

  const truncated = cleanText.slice(0, DESCRIPTION_LIMIT);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}…`;
}

export function createArticleSchema(article, canonicalUrl, description) {
  const imageUrl = article.image_url || SITE_CONFIG.ogImage;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: capitalizeFirstLetter(article.title),
    description,
    image: imageUrl
      ? [new URL(imageUrl, SITE_CONFIG.siteUrl).toString()]
      : undefined,
    author: { "@type": "Person", name: article.author_name || SITE_CONFIG.name },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: new URL(SITE_CONFIG.logo, SITE_CONFIG.siteUrl).toString(),
      },
    },
    mainEntityOfPage: canonicalUrl,
  };

  if (article.category) schema.articleSection = article.category;
  if (article.published_at) schema.datePublished = article.published_at;
  if (article.updated_at) schema.dateModified = article.updated_at;

  return schema;
}
