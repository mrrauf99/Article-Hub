import prisma from "../prisma/client.js";

const articleCardSelect = {
  id: true,
  authorId: true,
  title: true,
  introduction: true,
  summary: true,
  category: true,
  imageUrl: true,
  views: true,
  publishedAt: true,
};

function toArticleCard(article) {
  return {
    id: article.id,
    author_id: article.authorId,
    title: article.title,
    introduction: article.introduction,
    summary: article.summary,
    category: article.category,
    image_url: article.imageUrl,
    views: article.views,
    published_at: article.publishedAt,
    author_name: article.author.name,
    is_saved: Boolean(article.savedArticles?.length),
  };
}

export async function getApprovedArticles({ category, page, limit, userId }) {
  const where = { status: "approved", ...(category ? { category } : {}) };
  const [articles, totalCount, overallCount, authors, categories] =
    await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          ...articleCardSelect,
          author: { select: { name: true } },
          ...(userId
            ? {
                savedArticles: {
                  where: { userId },
                  select: { articleId: true },
                },
              }
            : {}),
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.article.count({ where }),
      prisma.article.count({ where: { status: "approved" } }),
      prisma.article.groupBy({
        by: ["authorId"],
        where: { status: "approved" },
      }),
      prisma.article.groupBy({
        by: ["category"],
        where: { status: "approved" },
        _count: { _all: true },
      }),
    ]);

  return {
    articles: articles.map(toArticleCard),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    meta: {
      overallCount,
      authorCount: authors.length,
      categoryCounts: categories.map(({ category: value, _count }) => ({
        category: value,
        count: _count._all,
      })),
    },
  };
}

export async function getArticlesByAuthor(authorId) {
  const articles = await prisma.article.findMany({
    where: { authorId },
    select: {
      id: true,
      title: true,
      summary: true,
      category: true,
      status: true,
      views: true,
      imageUrl: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    category: article.category,
    status: article.status,
    views: article.views,
    image_url: article.imageUrl,
    published_at: article.publishedAt,
    author_name: article.author.name,
  }));
}

export async function getArticleById(articleId, userId) {
  const article = await prisma.article.findFirst({
    where: {
      id: articleId,
      ...(userId
        ? { OR: [{ status: "approved" }, { authorId: userId }] }
        : { status: "approved" }),
    },
    select: {
      id: true,
      authorId: true,
      title: true,
      introduction: true,
      content: true,
      summary: true,
      category: true,
      status: true,
      publishedAt: true,
      imageUrl: true,
      views: true,
      author: { select: { name: true } },
      ...(userId
        ? {
            savedArticles: {
              where: { userId },
              select: { articleId: true },
            },
          }
        : {}),
    },
  });

  if (!article) return null;

  return {
    id: article.id,
    author_id: article.authorId,
    title: article.title,
    introduction: article.introduction,
    content: article.content,
    summary: article.summary,
    category: article.category,
    status: article.status,
    published_at: article.publishedAt,
    image_url: article.imageUrl,
    views: article.views,
    is_saved: Boolean(article.savedArticles?.length),
    author_name: article.author.name,
  };
}

export async function getArticleOwnership(articleId) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      authorId: true,
      imageUrl: true,
      imagePublicId: true,
    },
  });

  if (!article) return null;

  return {
    author_id: article.authorId,
    image_url: article.imageUrl,
    image_public_id: article.imagePublicId,
  };
}

export async function createArticle(data) {
  return prisma.article.create({
    data,
    select: {
      id: true,
      author: { select: { name: true, email: true } },
    },
  });
}

export async function updateArticle(articleId, data) {
  return prisma.article.update({
    where: { id: articleId },
    data: {
      ...data,
      status: "pending",
      publishedAt: null,
    },
    select: {
      author: { select: { name: true, email: true } },
    },
  });
}

export async function deleteArticle(articleId) {
  return prisma.$transaction(async (transaction) => {
    const article = await transaction.article.findUnique({
      where: { id: articleId },
      select: { imagePublicId: true },
    });
    if (!article) return null;

    await transaction.article.delete({ where: { id: articleId } });
    return article;
  });
}

export async function incrementArticleViews(articleId, userId) {
  if (!userId) return 0;

  const where = {
    id: articleId,
    status: "approved",
    NOT: { authorId: userId },
  };

  const result = await prisma.article.updateMany({
    where,
    data: { views: { increment: 1 } },
  });

  return result.count;
}
