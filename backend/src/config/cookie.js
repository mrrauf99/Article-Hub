const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
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
