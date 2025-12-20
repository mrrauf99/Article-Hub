import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import styles from "@/styles/navbar.module.css";

export default function MobileNavMenu({
  isOpen,
  onClose,
  navItems,
  role,
  userName,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuInner}>
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link key={label} to={href} onClick={onClose} className={styles.mobileLink}>
            <Icon className={styles.mobileLinkIcon} />
            {label}
          </Link>
        ))}

        {role === "guest" ? (
          <>
            <Link to="/login" onClick={onClose} className={styles.mobileLink}>
              Login
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className={`${styles.mobileLink} ${styles.mobileSignup}`}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <div className={styles.mobileUserInfo}>
              {userName || "User"}
              {role === "admin" && (
                <span className={styles.adminBadge}>ADMIN</span>
              )}
            </div>

            <Link to="/profile" onClick={onClose} className={styles.mobileLink}>
              <User className={styles.mobileLinkIcon} />
              Profile
            </Link>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className={`${styles.mobileLink} ${styles.mobileLogout}`}
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
