import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import styles from "../styles/navbar.module.css";

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
  userRole,
  userName,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuInner}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={styles.mobileLink}
              onClick={onClose}
            >
              <Icon className={styles.mobileLinkIcon} />
              {item.label}
            </Link>
          );
        })}

        {userRole === "guest" ? (
          <>
            <Link
              to="/login"
              className={styles.mobileLink}
              onClick={onClose}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${styles.mobileLink} ${styles.mobileSignup}`}
              onClick={onClose}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <div className={styles.mobileUserInfo}>
              {userName || "User"}
              {userRole === "admin" && (
                <span className={styles.adminBadge}>ADMIN</span>
              )}
            </div>

            <Link
              to="/profile"
              className={styles.mobileLink}
              onClick={onClose}
            >
              <User className={styles.mobileLinkIcon} />
              Profile
            </Link>

            <button
              className={`${styles.mobileLink} ${styles.mobileLogout}`}
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut className={styles.mobileLinkIcon} />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
