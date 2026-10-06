import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import articleRoutes from "./routes/article.routes.js";
import userRoutes from "./routes/user.routes.js";
import savedArticleRoutes from "./routes/savedArticle.routes.js";

import { authenticate } from "./middlewares/authenticate.middleware.js";
import { requireRole } from "./middlewares/requireRole.middleware.js";

import { COOKIE_NAMES } from "./constants/cookieNames.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/user", authenticate(COOKIE_NAMES.ACCESS), userRoutes);

app.use(
  "/api/saved-articles",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("user"),
  savedArticleRoutes,
);

app.use(
  "/api/admin",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("admin"),
  adminRoutes,
);

app.use("/health", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Server is up and running." });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "That page or resource doesn't exist.",
  });
});

app.use((error, req, res, _next) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Something on our end broke. Please try again.",
  });
});

export default app;
