import session from "express-session";
import pgSession from "connect-pg-simple";
import db from "../config/db.config.js";

const PgStore = pgSession(session);

const isProd = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  store: new PgStore({
    pool: db,
    tableName: "user_sessions",
  }),

  name: "articlehub.sid",
  secret: process.env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,
  rolling: true,

  cookie: {
    httpOnly: true,

    // HTTPS only in production
    secure: isProd,

    // Cross-site in prod, safe default in dev
    sameSite: isProd ? "none" : "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});
