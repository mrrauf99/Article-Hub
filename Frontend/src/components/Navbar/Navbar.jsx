import { useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "../styles/navbar.module.css";
import { getNavItemsForRole } from "./navConfig";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLink";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

const Navbar = ({ userRole = "guest", userName = "", onLogout = () => {} }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navItems = getNavItemsForRole(userRole);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLogo />

        {/* Desktop nav links */}
        <NavLinks navItems={navItems} />

        {/* Desktop user/auth area */}
        <UserMenu
          userRole={userRole}
          userName={userName}
          onLogout={onLogout}
        />

        {/* Mobile toggle button */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileOpen((v) => !v)}
        >
          {isMobileOpen ? (
            <X className={styles.mobileToggleIcon} />
          ) : (
            <Menu className={styles.mobileToggleIcon} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={navItems}
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />
    </nav>
  );
};

export default Navbar;
