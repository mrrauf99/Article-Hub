import prisma from "../prisma/client.js";

function pagination(page, limit, totalCount) {
  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function getDashboardStats() {
  const [totalUsers, articleCounts, articleTotal, views] = await Promise.all([
    prisma.user.count({ where: { role: "user" } }),
    prisma.article.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.article.count(),
    prisma.article.aggregate({ _sum: { views: true } }),
  ]);

  const countBy = (rows, field, value) =>
    String(rows.find((row) => row[field] === value)?._count._all ?? 0);

  return {
    total_users: String(totalUsers),
    total_articles: String(articleTotal),
    approved_articles: countBy(articleCounts, "status", "approved"),
    pending_articles: countBy(articleCounts, "status", "pending"),
    rejected_articles: countBy(articleCounts, "status", "rejected"),
    total_views: String(views._sum.views ?? 0),
  };
}

export async function getRecentActivity() {
  const [articles, users] = await Promise.all([
    prisma.article.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        author: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        joinedAt: true,
      },
      orderBy: { joinedAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    recentArticles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
      created_at: article.createdAt,
      author_name: article.author.name,
      author_avatar: article.author.avatarUrl,
    })),
    recentUsers: users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      avatar_url: user.avatarUrl,
      joined_at: user.joinedAt,
    })),
  };
}

export async function getAdminArticles({ status, search, page, limit }) {
  const where = {
    ...(status && status !== "all" ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
  const [totalCount, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        status: true,
        views: true,
        imageUrl: true,
        createdAt: true,
        publishedAt: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);

  return {
    articles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      category: article.category,
      status: article.status,
      views: article.views,
      image_url: article.imageUrl,
      created_at: article.createdAt,
      published_at: article.publishedAt,
      author_id: article.author.id,
      author_name: article.author.name,
      author_avatar: article.author.avatarUrl,
    })),
    pagination: pagination(page, limit, totalCount),
  };
}

export async function getAdminArticleDetails(articleId) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });

  if (!article) return null;
  const { author, authorId, createdAt, publishedAt, imageUrl, imagePublicId, ...fields } = article;
  return {
    ...fields,
    author_id: authorId,
    created_at: createdAt,
    published_at: publishedAt,
    image_url: imageUrl,
    image_public_id: imagePublicId,
    author_name: author.name,
    author_email: author.email,
    author_avatar: author.avatarUrl,
  };
}

export async function getPendingArticles() {
  const articles = await prisma.article.findMany({
    where: { status: "pending" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    created_at: article.createdAt,
    author_name: article.author.name,
  }));
}

export async function approveArticle(articleId) {
  const updated = await prisma.article.updateMany({
    where: { id: articleId, NOT: { status: "approved" } },
    data: { status: "approved", publishedAt: new Date() },
  });
  if (updated.count === 0) return null;

  return prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      author: { select: { name: true, email: true } },
    },
  });
}

export async function rejectArticle(articleId) {
  const updated = await prisma.article.updateMany({
    where: { id: articleId, NOT: { status: "rejected" } },
    data: { status: "rejected", publishedAt: null },
  });
  if (updated.count === 0) return null;

  return prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      author: { select: { name: true, email: true } },
    },
  });
}

export async function deleteAdminArticle(articleId) {
  return prisma.$transaction(async (transaction) => {
    const article = await transaction.article.findUnique({
      where: { id: articleId },
      select: {
        imagePublicId: true,
        title: true,
        author: { select: { name: true, email: true } },
      },
    });
    if (!article) return null;

    await transaction.article.delete({ where: { id: articleId } });
    return article;
  });
}

export async function getAdminUsers({ search, page, limit }) {
  const where = {
    role: "user",
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        joinedAt: true,
        _count: { select: { articles: true } },
      },
      orderBy: { joinedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
  ]);

  return {
    users: users.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar_url: user.avatarUrl,
      bio: user.bio,
      joined_at: user.joinedAt,
      article_count: String(user._count.articles),
    })),
    pagination: pagination(page, limit, totalCount),
  };
}

export async function getAdminUserDetails(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: "user" },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      expertise: true,
      gender: true,
      country: true,
      portfolioUrl: true,
      xUrl: true,
      linkedinUrl: true,
      facebookUrl: true,
      instagramUrl: true,
      joinedAt: true,
    },
  });

  if (!user) return null;
  const articles = await prisma.article.findMany({
    where: { authorId: userId },
    select: { id: true, title: true, status: true, createdAt: true, views: true },
    orderBy: { createdAt: "desc" },
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar_url: user.avatarUrl,
      bio: user.bio,
      expertise: user.expertise,
      gender: user.gender,
      country: user.country,
      portfolio_url: user.portfolioUrl,
      x_url: user.xUrl,
      linkedin_url: user.linkedinUrl,
      facebook_url: user.facebookUrl,
      instagram_url: user.instagramUrl,
      joined_at: user.joinedAt,
    },
    articles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
      created_at: article.createdAt,
      views: article.views,
    })),
  };
}

export async function deleteAdminUser(userId) {
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findFirst({
      where: { id: userId, role: "user" },
      select: {
        avatarPublicId: true,
        articles: { select: { id: true, imagePublicId: true } },
      },
    });
    if (!user) return null;

    await transaction.article.deleteMany({ where: { authorId: userId } });
    await transaction.user.delete({ where: { id: userId } });
    return user;
  });
}
