// src/components/Navbar/NavLinks.jsx
import { Link } from "react-router-dom";
import styles from "../styles/navbar.module.css";

export default function NavLinks({ navItems }) {
  return (
    <div className={styles.desktopNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.label} to={item.href} className={styles.navLink}>
            <Icon className={styles.navLinkIcon} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
