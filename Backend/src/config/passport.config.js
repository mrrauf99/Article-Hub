import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.config.js";
import env from "dotenv";
env.config();

export default function setupPassport() {
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const name = profile.displayName;
          const email = profile.emails[0].value;
          const googleAvatar = profile.photos?.[0]?.value || null;

          const { rows, rowCount } = await db.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
          );

          // If user does NOT exist → create new user
          if (rowCount === 0) {
            const insertResult = await db.query(
              "INSERT INTO users (email, name, avatar) VALUES ($1, $2, $3) RETURNING id",
              [email, name, googleAvatar]
            );

            return cb(null, { id: insertResult.rows[0].id });
          }

          // If user exists → return existing ID
          return cb(null, { id: rows[0].id });
        } catch (err) {
          console.error("Login server error:", err);
          return cb(null, false, {
            message: "Internal server error. Please try again later.",
          });
        }
      }
    )
  );

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "identifier",
        passwordField: "password",
      },
      async (identifier, password, cb) => {
        try {
          const isEmail = identifier.includes("@");

          const query = isEmail
            ? "SELECT * FROM users WHERE email = $1"
            : "SELECT * FROM users WHERE username = $1";

          const { rows, rowCount } = await db.query(query, [identifier]);

          if (rowCount === 0)
            return cb(null, false, {
              message: "Invalid email/username or password",
            });

          const { id, password: hashedPassword } = rows[0];
          const match = await bcrypt.compare(password, hashedPassword);

          if (!match)
            return cb(null, false, {
              message: "Invalid email/username or password",
            });

          cb(null, id);
        } catch (err) {
          console.error("Login server error:", err);
          return cb(null, false, {
            message: "Internal server error. Please try again later.",
          });
        }
      }
    )
  );

  passport.serializeUser((id, cb) => cb(null, id));
  passport.deserializeUser(async (id, cb) => {
    try {
      const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      if (rows.length === 0) {
        return cb(null, false); // user not found → unauthenticated
      }
      cb(null, rows[0]); // user found → attach to req.user
    } catch (err) {
      cb(err);
    }
  });
}
