import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
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
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
  })
);

setupPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

export default app;
