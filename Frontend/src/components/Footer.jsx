import styles from "@/styles/Footer.module.css";
import { Link } from "react-router-dom";
import { Facebook, Instagram, X, Linkedin, Youtube, Send } from "lucide-react";

const SOCIAL_LINKS = [
  { Icon: Facebook, label: "Facebook", href: "#", brand: "facebook" },
  { Icon: Instagram, label: "Instagram", href: "#", brand: "instagram" },
  { Icon: X, label: "X", href: "#", brand: "x" },
  { Icon: Linkedin, label: "LinkedIn", href: "#", brand: "linkedin" },
  { Icon: Youtube, label: "YouTube", href: "#", brand: "youtube" },
  { Icon: Send, label: "Telegram", href: "#", brand: "telegram" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* BRAND */}
        <div className={styles.left}>
          <h2 className={styles.title}>Article Hub</h2>

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

        {/* RESOURCES */}
        <div className={styles.linksCol}>
          <span className={styles.heading}>Resources</span>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/" className={styles.link}>
            Articles
          </Link>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            YouTube Channel
          </a>
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
        <span>
          Crafted by{" "}
          <strong className={styles.devName}>Abdul Rauf & Tayyab Ali</strong>
        </span>
      </div>
    </footer>
  );
}
