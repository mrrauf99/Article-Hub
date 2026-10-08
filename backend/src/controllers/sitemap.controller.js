const CACHE_CONTROL = "public, max-age=300";

function sendSitemap(res, xml) {
  return res
    .status(200)
    .set("Content-Type", "application/xml; charset=utf-8")
    .set("Cache-Control", CACHE_CONTROL)
    .send(xml);
}

export function createSitemapController(sitemapService) {
  return {
    getSitemap: async (_req, res) =>
      sendSitemap(res, await sitemapService.getSitemapXml()),

    getStaticSitemap: async (_req, res) =>
      sendSitemap(res, await sitemapService.getStaticSitemapXml()),

    getArticleSitemap: async (req, res) => {
      const page = Number(req.params.page);
      if (!Number.isSafeInteger(page) || page < 1) {
        return res.status(404).type("text/plain").send("Sitemap not found.");
      }

      const xml = await sitemapService.getArticleSitemapXml(page);
      if (!xml) {
        return res.status(404).type("text/plain").send("Sitemap not found.");
      }

      return sendSitemap(res, xml);
    },
  };
}
