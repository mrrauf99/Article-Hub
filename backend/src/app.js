import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";

import setupPassport from "./config/passport.config.js";

import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import articleRoutes from "./routes/article.routes.js";
import userRoutes from "./routes/user.routes.js";

import { authenticate } from "./middlewares/authenticate.middleware.js";
import { requireRole } from "./middlewares/requireRole.middleware.js";

import { COOKIE_NAMES } from "./constants/cookieNames.js";

const app = express();

app.use(helmet());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

setupPassport();
app.use(passport.initialize());

app.use("/health", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Server is up and running." });
});

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.use(
  "/api/admin",
  authenticate(COOKIE_NAMES.ACCESS),
  requireRole("admin"),
  adminRoutes,
);

app.use(
  "/api/user",
  authenticate(COOKIE_NAMES.ACCESS),
  userRoutes,
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

app.use((error, req, res, _next) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

export default app;
