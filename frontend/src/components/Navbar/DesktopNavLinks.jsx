import { NavLink } from "react-router-dom";
import styles from "@/styles/Navbar.module.css";

export default function DesktopNavLinks({ navItems }) {
  return (
    <div className={styles.desktopNav}>
      {navItems.map(({ label, href }) => (
        <NavLink
          key={label}
          to={href}
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          {label}
        </NavLink>
      ))}
    </div>
  );
}
