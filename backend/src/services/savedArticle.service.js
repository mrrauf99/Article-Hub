import prisma from "../prisma/client.js";

export async function saveArticle(userId, articleId) {
  return prisma.$transaction(async (transaction) => {
    const article = await transaction.article.findFirst({
      where: { id: articleId, status: "approved" },
      select: { id: true },
    });

    if (!article) return { available: false, created: false };

    const result = await transaction.savedArticle.createMany({
      data: [{ userId, articleId }],
      skipDuplicates: true,
    });

    return { available: true, created: result.count > 0 };
  });
}

export async function unsaveArticle(userId, articleId) {
  await prisma.savedArticle.deleteMany({ where: { userId, articleId } });
}

export async function getSavedArticles(userId, page, limit) {
  const where = { userId, article: { status: "approved" } };
  const [totalCount, savedArticles] = await Promise.all([
    prisma.savedArticle.count({ where }),
    prisma.savedArticle.findMany({
      where,
      select: {
        savedAt: true,
        article: {
          select: {
            id: true,
            authorId: true,
            title: true,
            introduction: true,
            summary: true,
            category: true,
            status: true,
            imageUrl: true,
            views: true,
            publishedAt: true,
            author: { select: { name: true } },
          },
        },
      },
      orderBy: [{ savedAt: "desc" }, { articleId: "desc" }],
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);

  return {
    articles: savedArticles.map(({ article, savedAt }) => ({
      id: article.id,
      author_id: article.authorId,
      title: article.title,
      introduction: article.introduction,
      summary: article.summary,
      category: article.category,
      status: article.status,
      image_url: article.imageUrl,
      views: article.views,
      published_at: article.publishedAt,
      author_name: article.author.name,
      saved_at: savedAt,
      is_saved: true,
    })),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
