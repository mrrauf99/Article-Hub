import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/guest.module.css";

export default function Hero() {
  const navigate = useNavigate();

  const goGuest = () => navigate("/guest");
  const goSignup = () => navigate("/signup");
  const goLogin = () => navigate("/login");

  return (
    <section className={styles.hero}>
      {/* LEFT: text */}
      <div className={styles.heroText}>
        <span className={styles.heroBadge}>Welcome to Article Hub</span>

        <h1 className={styles.heroTitle}>
          Read, learn, and grow with{" "}
          <span className={styles.heroHighlight}>high-quality articles</span>.
        </h1>

        <p className={styles.heroSubtitle}>
          Browse curated content from creators and professionals. Sign up to
          save your favorites, write your own articles, and build your profile.
        </p>

        <div className={styles.heroActions}>
          <button type="button" onClick={goGuest} className={styles.primaryBtn}>
            Continue as guest
          </button>

          <button
            type="button"
            onClick={goSignup}
            className={styles.secondaryBtn}
          >
            Get started for free
          </button>

          <button
            type="button"
            onClick={goLogin}
            className={styles.secondaryBtn}
          >
            I already have an account
          </button>
        </div>

        <p className={styles.heroMeta}>
          No credit card required. Start reading in seconds.
        </p>
      </div>

      {/* RIGHT: card */}
      <div className={styles.heroCard}>
        <div className={styles.heroIconWrapper}>
          <FileText className={styles.heroIcon} />
        </div>
        <h2 className={styles.heroCardTitle}>Why Article Hub?</h2>
        <ul className={styles.heroList}>
          <li>Fresh tech, design, and career content.</li>
          <li>Create and manage your own articles with a clean dashboard.</li>
          <li>Save time by keeping everything in one place.</li>
        </ul>
      </div>
    </section>
  );
}
