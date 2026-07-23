import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
            [email],
          );

          // Existing user
          if (rows.length > 0) {
            return done(null, { id: rows[0].id, role: rows[0].role });
          }

          // New user
          return done(null, {
            oauthPending: true,
            email,
            name,
            avatar,
          });
        } catch (err) {
          done(err);
        }
      },
    ),
  );
}
