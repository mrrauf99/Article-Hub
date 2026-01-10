import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "./db.config.js";

export default function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const avatar = profile.photos?.[0]?.value || null;

          const { rows } = await db.query(
            "SELECT id, role FROM users WHERE email = $1",
            [email]
          );

          // Existing user → login directly
          if (rows.length > 0) {
            return done(null, { id: rows[0].id, role: rows[0].role });
          }

          // New user → TEMP session data
          return done(null, {
            oauthPending: true,
            email,
            name,
            avatar,
          });
        } catch (err) {
          done(err);
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
}
