import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import articleRoutes from "./routes/article.routes.js";

import setupPassport from "./config/passport.config.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL, // Allow requests only from React app
    credentials: true, // Enable sending & receiving cookies
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  })
);

setupPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  if (err.message === "UserDeleted") {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.redirect("/api/auth/google");
      });
    });
  } else {
    next(err);
  }
});

export default app;
