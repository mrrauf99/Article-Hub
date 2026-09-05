import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Shield, X } from "lucide-react";
import styles from "@/styles/navbar.module.css";
import useModalFocusTrap from "@/hooks/useModalFocusTrap";

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
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useModalFocusTrap(panelRef, isOpen);

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
    <>
      <div
        className={`${styles.mobileBackdrop} ${isOpen ? styles.mobileBackdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            data-autofocus
            className={styles.mobileMenuClose}
          >
            <X className={styles.mobileToggleIcon} />
          </button>
        </div>

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
                {isAdmin && href === "/admin/dashboard" && pendingCount > 0 && (
                  <span className="ml-auto rounded-full bg-moss-700 px-2 py-0.5 text-xs font-semibold tabular-nums text-paper">
                    {pendingCount > 99 ? "99+" : pendingCount}
                    <span className="sr-only"> in review</span>
                  </span>
                )}
              </Link>
            ))}
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
                Profile & security
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
    </>
  );
}
