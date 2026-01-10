import styles from "@/styles/footer.module.css";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  X,
  Linkedin,
  Send,
  BookOpen,
} from "lucide-react";

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "#", brand: "facebook" },
  { Icon: Instagram, label: "Instagram", href: "#", brand: "instagram" },
  { Icon: X, label: "X", href: "#", brand: "x" },
  { Icon: Linkedin, label: "LinkedIn", href: "#", brand: "linkedin" },
  { Icon: Send, label: "Telegram", href: "#", brand: "telegram" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* BRAND */}
        <div className={styles.left}>
          <div className={styles.brandWrapper}>
            <div className={styles.logoIcon}>
              <BookOpen size={20} />
            </div>
            <h2 className={styles.title}>Article Hub</h2>
          </div>

          <p className={styles.description}>
            A modern platform for publishing thoughtful articles on technology,
            education, and digital trends.
          </p>

          {/* social links */}
          <div className={styles.socials}>
            {SOCIAL_LINKS.map(({ Icon, label, href, brand }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialIcon} ${styles[brand]}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* COMPANY */}
        <div className={styles.linksCol}>
          <span className={styles.heading}>Company</span>
          <Link to="/about" className={styles.link}>
            About Us
          </Link>
          <Link to="/contact" className={styles.link}>
            Contact Us
          </Link>
          <Link to="/privacy" className={styles.link}>
            Privacy & Data
          </Link>
          <Link to="/terms" className={styles.link}>
            Terms of Use
          </Link>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.bottomBar}>
        <span>
          © {new Date().getFullYear()} Article Hub. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
