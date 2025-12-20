import { Link } from "react-router-dom";
import styles from "@/styles/navbar.module.css";

export default function DesktopNavLinks({ navItems }) {
  return (
    <div className={styles.desktopNav}>
      {navItems.map(({ label, href, icon: Icon }) => (
        <Link key={label} to={href} className={styles.navLink}>
          <Icon className={styles.navLinkIcon} />
          {label}
        </Link>
      ))}
    </div>
  );
}
