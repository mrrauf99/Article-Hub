const CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";
const ERROR_MESSAGE = "Sitemap is temporarily unavailable.";

export function getSitemapApiPath(resource, page) {
  if (resource === "index") return "/api/sitemaps";
  if (resource === "static") return "/api/sitemaps/static";

  if (resource === "articles" && typeof page === "string") {
    const match = page.match(/^([1-9]\d*)(?:\.xml)?$/);
    if (match) return "/api/sitemaps/articles/" + match[1];
  }

  return null;
}

function sendText(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(message);
}

export default async function sitemapHandler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return sendText(res, 405, "Method not allowed.");
  }

  const resource = req.query?.resource;
  const page = req.query?.page;
  const upstreamPath = getSitemapApiPath(resource, page);
  if (!upstreamPath) return sendText(res, 404, "Sitemap not found.");

  const apiBase = process.env.VITE_API_BASE_URL?.trim();
  if (!apiBase) return sendText(res, 503, ERROR_MESSAGE);

  let upstreamUrl;
  try {
    upstreamUrl = new URL(upstreamPath, apiBase);
  } catch {
    return sendText(res, 503, ERROR_MESSAGE);
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { Accept: "application/xml" },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const contentType = upstream.headers.get("content-type") || "";

    if (
      !upstream.ok ||
      contentType.split(";")[0].trim().toLowerCase() !== "application/xml"
    ) {
      return sendText(res, 502, ERROR_MESSAGE);
    }

    const xml = await upstream.text();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.end(req.method === "HEAD" ? undefined : xml);
  } catch {
    return sendText(res, 502, ERROR_MESSAGE);
  }
}
