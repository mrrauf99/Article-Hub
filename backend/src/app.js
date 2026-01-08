import express from "express";
import cors from "cors";
import passport from "passport";

import setupPassport from "./config/passport.config.js";

import { sessionMiddleware } from "./middlewares/session.middleware.js";

import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import articleRoutes from "./routes/article.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(sessionMiddleware);

setupPassport();
app.use(passport.initialize());

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

export default app;
