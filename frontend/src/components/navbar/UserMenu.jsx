import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import styles from "@/styles/navbar.module.css";

export default function UserMenu({ role, userName, avatar, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // GUEST
  if (role === "guest") {
    return (
      <div className={styles.desktopUser}>
        <Link to="/login" className={styles.loginBtn}>
          Log in
        </Link>
        <Link to="/register" className={styles.signupBtn}>
          Sign Up
        </Link>
      </div>
    );
  }

  const isAdmin = role === "admin";
  const profilePath = isAdmin ? "/admin/profile" : "/user/profile";
  // ...existing code...

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
    <div className={styles.userMenuWrapper} ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`${styles.profileButton} ${
          open ? styles.profileButtonOpen : ""
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className={styles.avatarContainer}>
          {avatar ? (
            <img src={avatar} alt={userName} className={styles.avatarImage} />
          ) : (
            <span className={styles.avatarFallback}>{initials}</span>
          )}
        </div>
        <span className={styles.userName}>{userName}</span>
        <ChevronDown
          className={`${styles.chevronIcon} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      <div
        className={`${styles.dropdownMenu} ${open ? styles.dropdownOpen : ""}`}
      >
        {/* User info header */}
        <div className={styles.dropdownHeader}>
          <div className={styles.dropdownAvatarLarge}>
            {avatar ? (
              <img src={avatar} alt={userName} className={styles.avatarImage} />
            ) : (
              <span className={styles.avatarFallbackLarge}>{initials}</span>
            )}
          </div>
          <div className={styles.dropdownUserInfo}>
            <span className={styles.dropdownUserName}>{userName}</span>
            <span className={styles.dropdownUserRole}>
              {isAdmin ? (
                <>
                  <Shield className={styles.roleIcon} />
                  Administrator
                </>
              ) : (
                "Member"
              )}
            </span>
          </div>
        </div>

        <div className={styles.dropdownDivider} />

        {/* Menu items */}
        <div className={styles.dropdownBody}>
          <Link
            to={profilePath}
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            <User className={styles.dropdownItemIcon} />
            Profile
          </Link>
        </div>

        <div className={styles.dropdownDivider} />

        {/* Logout */}
        <div className={styles.dropdownFooter}>
          <button
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className={styles.logoutButton}
          >
            <LogOut className={styles.dropdownItemIcon} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
