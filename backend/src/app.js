import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import setupPassport from "./config/passport.config.js";

import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import articleRoutes from "./routes/article.routes.js";
import userRoutes from "./routes/user.routes.js";

import { authenticate } from "./middlewares/authenticate.middleware.js";
import { requireAdmin } from "./middlewares/admin.middleware.js";
import { requireUser } from "./middlewares/user.middleware.js";

import { COOKIE_NAMES } from "./constants/cookieNames.js";

const app = express();

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

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use(
  "/api/admin",
  authenticate(COOKIE_NAMES.ACCESS),
  requireAdmin,
  adminRoutes,
);
app.use(
  "/api/user",
  authenticate(COOKIE_NAMES.ACCESS),
  requireUser,
  userRoutes,
);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
  });
});

export default app;
