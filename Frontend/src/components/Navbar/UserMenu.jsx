
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import styles from "../styles/navbar.module.css";

export default function UserMenu({ userRole, userName, onLogout }) {
  const [open, setOpen] = useState(false);

  if (userRole === "guest") {
    return (
      <div className={styles.desktopUser}>
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
        <Link to="/signup" className={styles.signupBtn}>
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.desktopUser}>
      <div className={styles.profileWrapper}>
        <button
          onClick={() => setOpen((v) => !v)}
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
    </div>
  );
}
