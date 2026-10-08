import { SITE_CONFIG } from "@/config/site.config";

export default function toCanonicalUrl(path) {
  const siteUrl = SITE_CONFIG.siteUrl || "https://articlehub.me";
  const parsedUrl = new URL(path || "/", siteUrl);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";

  return new URL(pathname, siteUrl).toString();
}
