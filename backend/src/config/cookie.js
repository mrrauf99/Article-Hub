export const setCookie = (res, tokenName, token, maxAgeMs) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeMs || 1000 * 86400 * 7,
  });
};
