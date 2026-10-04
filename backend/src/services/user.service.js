import prisma from "../prisma/client.js";

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      expertise: true,
      avatarUrl: true,
      joinedAt: true,
      bio: true,
      portfolioUrl: true,
      xUrl: true,
      linkedinUrl: true,
      instagramUrl: true,
      facebookUrl: true,
      role: true,
      gender: true,
      country: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    expertise: user.expertise,
    avatar_url: user.avatarUrl,
    joined_at: user.joinedAt,
    bio: user.bio,
    portfolio_url: user.portfolioUrl,
    x_url: user.xUrl,
    linkedin_url: user.linkedinUrl,
    instagram_url: user.instagramUrl,
    facebook_url: user.facebookUrl,
    role: user.role,
    gender: user.gender,
    country: user.country,
    two_factor_enabled: user.twoFactorEnabled,
  };
}

export async function getUserSummary(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, name: true, avatarUrl: true, role: true },
  });

  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatar_url: user.avatarUrl,
    role: user.role,
  };
}

export async function getUserStats(userId) {
  const result = await prisma.article.aggregate({
    where: { authorId: userId },
    _count: { id: true },
    _sum: { views: true },
  });

  return {
    articles: result._count.id,
    views: result._sum.views ?? 0,
  };
}

export async function getAvatarPublicId(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarPublicId: true },
  });
  return user?.avatarPublicId ?? null;
}

export async function updateProfile(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      expertise: true,
      bio: true,
      avatarUrl: true,
      portfolioUrl: true,
      xUrl: true,
      linkedinUrl: true,
      facebookUrl: true,
      instagramUrl: true,
      gender: true,
      country: true,
    },
  });

  return {
    id: user.id,
    name: user.name,
    expertise: user.expertise,
    bio: user.bio,
    avatar_url: user.avatarUrl,
    portfolio_url: user.portfolioUrl,
    x_url: user.xUrl,
    linkedin_url: user.linkedinUrl,
    facebook_url: user.facebookUrl,
    instagram_url: user.instagramUrl,
    gender: user.gender,
    country: user.country,
  };
}

export async function getPasswordById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });
}

export async function updatePasswordById(userId, password) {
  return prisma.user.updateMany({ where: { id: userId }, data: { password } });
}

export async function getTwoFactorSetupUser(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, password: true, twoFactorEnabled: true },
  });
}

export async function setTwoFactorSecret(userId, secret) {
  return prisma.user.updateMany({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });
}

export async function getTwoFactorSecret(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true },
  });
  return user?.twoFactorSecret ?? null;
}

export async function setTwoFactorEnabled(userId, enabled) {
  return prisma.user.updateMany({
    where: { id: userId },
    data: {
      twoFactorEnabled: enabled,
      ...(enabled ? {} : { twoFactorSecret: null }),
    },
  });
}

export async function getTwoFactorDisableUser(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { password: true, twoFactorEnabled: true, twoFactorSecret: true },
  });
}
