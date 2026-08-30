import styles from "@/styles/footer.module.css";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  BookOpen,
} from "lucide-react";

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Twitter, label: "X", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Send, label: "Telegram", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* BRAND */}
        <div className={styles.left}>
          <div className={styles.brandWrapper}>
            <div className={styles.logoIcon}>
              <BookOpen size={18} strokeWidth={2} />
            </div>
            <h2 className={styles.title}>Article Hub</h2>
          </div>

          <p className={styles.description}>
            A moderated platform for publishing thoughtful articles on technology,
            education, and digital trends.
          </p>

          {/* social links */}
          <div className={styles.socials}>
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
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
          © 2025-{new Date().getFullYear()} Article Hub. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
