import { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import styles from "@/styles/navbar.module.css";

export default function UserMenu({ role, userName, onLogout }) {
  const [open, setOpen] = useState(false);

  // GUEST
  if (role === "guest") {
    return (
      <div className={styles.desktopUser}>
        <Link to="/login" className={styles.loginBtn}>Login</Link>
        <Link to="/register" className={styles.signupBtn}>Sign Up</Link>
      </div>
    );
  }

  // USER / ADMIN
  return (
    <div className={styles.desktopUser}>
      <button
        onClick={() => setOpen(v => !v)}
        className={styles.profileButton}
      >
        <User className={styles.profileIcon} />
        <span>{userName || "User"}</span>
      </button>

      {open && (
        <div className={styles.profileMenu}>
          <Link to="/profile" className={styles.profileItem}>
            <User className={styles.profileItemIcon} />
            Profile
          </Link>
          <hr className={styles.menuDivider} />
          <button
            onClick={onLogout}
            className={`${styles.profileItem} ${styles.logoutItem}`}
          >
            <LogOut className={styles.profileItemIcon} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
