import prisma from "../prisma/client.js";

export async function hasSignupConflict(email, username) {
  return prisma.user.count({
    where: { OR: [{ email }, { username }] },
  });
}

export async function createSignupUser(data) {
  return prisma.user.create({ data, select: { id: true } });
}

export async function findUserForLogin(identifier) {
  return prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
    select: {
      id: true,
      password: true,
      role: true,
      email: true,
      name: true,
      twoFactorEnabled: true,
    },
  });
}

export async function getTwoFactorLoginUser(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true, twoFactorSecret: true },
  });
}

export async function isEmailTaken(email) {
  return (await prisma.user.count({ where: { email } })) > 0;
}

export async function isUsernameTaken(username) {
  return (await prisma.user.count({ where: { username } })) > 0;
}

export async function getPasswordByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });
}

export async function updatePasswordByEmail(email, password) {
  return prisma.user.updateMany({ where: { email }, data: { password } });
}

export async function updatePasswordById(userId, password) {
  return prisma.user.updateMany({ where: { id: userId }, data: { password } });
}

export async function createGoogleUser(data) {
  return prisma.user.create({
    data,
    select: { id: true, role: true },
  });
}

export async function findUserForGoogleLogin(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, email: true, name: true },
  });
}
