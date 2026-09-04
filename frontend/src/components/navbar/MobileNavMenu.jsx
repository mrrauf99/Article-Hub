import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Shield, Bell } from "lucide-react";
import styles from "@/styles/navbar.module.css";

export default function MobileNavMenu({
  isOpen,
  onClose,
  navItems,
  role,
  userName,
  avatar,
  onLogout,
  pendingCount = 0,
}) {
  const [avatarError, setAvatarError] = useState(false);

  const initials = useMemo(() => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  const isValidAvatar = avatar && typeof avatar === "string" && avatar.trim();

  const isAdmin = role === "admin";
  const profilePath = isAdmin ? "/admin/profile" : "/user/profile";

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
      <div className={styles.mobileMenuContent}>
        <div className={styles.mobileMenuInner}>
        {role !== "guest" && (
          <div className={styles.mobileUserHeader}>
            <div className={styles.mobileAvatarContainer}>
              {isValidAvatar && !avatarError ? (
                <img
                  src={avatar}
                  alt={userName}
                  className={styles.mobileAvatar}
                  loading="lazy"
                  onError={() => setAvatarError(true)}
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
                  "Writer"
                )}
              </span>
            </div>
          </div>
        )}

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

            {isAdmin && (
              <Link
                to="/admin/articles?status=pending"
                onClick={onClose}
                className={styles.mobileLink}
              >
                <Bell className={styles.mobileLinkIcon} />
                Pending Articles
                {pendingCount > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        )}

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
              Sign up
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.mobileNavSection}>
              <Link
                to={profilePath}
                onClick={onClose}
                className={styles.mobileLink}
              >
                <User className={styles.mobileLinkIcon} />
                {isAdmin ? "Profile" : "Profile & security"}
              </Link>
            </div>

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
    </div>
  );
}
