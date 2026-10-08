import { Router } from "express";
import prisma from "../prisma/client.js";
import { createSitemapController } from "../controllers/sitemap.controller.js";
import { createSitemapService } from "../services/sitemap.service.js";

export function createSitemapRouter(articleRepository = prisma.article) {
  const router = Router();
  const controller = createSitemapController(
    createSitemapService(articleRepository),
  );

  router.get("/", controller.getSitemap);
  router.get("/static", controller.getStaticSitemap);
  router.get("/articles/:page", controller.getArticleSitemap);

  return router;
}

export default createSitemapRouter();
