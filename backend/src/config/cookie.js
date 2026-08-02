const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
};

export const setCookie = (res, tokenName, token, maxAgeMs) => {
  res.cookie(tokenName, token, {
    ...cookieOptions,
    maxAge: maxAgeMs || 1000 * 86400 * 7,
  });
};

export const clearCookie = (res, tokenName) => {
  res.clearCookie(tokenName, cookieOptions);
};
