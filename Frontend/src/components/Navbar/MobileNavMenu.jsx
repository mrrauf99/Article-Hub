import { Link } from "react-router-dom";
import { User, LogOut, Shield } from "lucide-react";
import styles from "@/styles/Navbar.module.css";

export default function MobileNavMenu({
  isOpen,
  onClose,
  navItems,
  role,
  userName,
  avatar,
  onLogout,
}) {
  if (!isOpen) return null;

  const isAdmin = role === "admin";
  const profilePath = isAdmin ? "/admin/profile" : "/user/profile";

  // Get initials for avatar fallback
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuInner}>
        {/* User info for logged-in users */}
        {role !== "guest" && (
          <div className={styles.mobileUserHeader}>
            <div className={styles.mobileAvatarContainer}>
              {avatar ? (
                <img
                  src={avatar}
                  alt={userName}
                  className={styles.mobileAvatar}
                />
              ) : (
                <span className={styles.mobileAvatarFallback}>{initials}</span>
              )}
            </div>
            <div className={styles.mobileUserDetails}>
              <span className={styles.mobileUserName}>{userName}</span>
              <span className={styles.mobileUserRole}>
                {isAdmin ? (
                  <>
                    <Shield className={styles.mobileRoleIcon} />
                    Administrator
                  </>
                ) : (
                  "Member"
                )}
              </span>
            </div>
          </div>
        )}

        {/* Navigation links */}
        {navItems.length > 0 && (
          <div className={styles.mobileNavSection}>
            {navItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className={styles.mobileLink}
              >
                {Icon && <Icon className={styles.mobileLinkIcon} />}
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Guest actions */}
        {role === "guest" ? (
          <div className={styles.mobileGuestActions}>
            <Link
              to="/login"
              onClick={onClose}
              className={styles.mobileLoginBtn}
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className={styles.mobileSignupBtn}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <>
            {/* User menu links */}
            <div className={styles.mobileNavSection}>
              <Link
                to={profilePath}
                onClick={onClose}
                className={styles.mobileLink}
              >
                <User className={styles.mobileLinkIcon} />
                Profile
              </Link>
            </div>

            {/* Logout */}
            <div className={styles.mobileLogoutSection}>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={styles.mobileLogoutBtn}
              >
                <LogOut className={styles.mobileLinkIcon} />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
