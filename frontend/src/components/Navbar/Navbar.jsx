import { useState } from "react";
import { Menu, X } from "lucide-react";

import { getNavItemsForRole } from "@/utils/navConfig";

import NavLogo from "./NavLogo";
import DesktopNavLinks from "./DesktopNavLinks";
import UserMenu from "./UserMenu";
import MobileNavMenu from "./MobileNavMenu";

import styles from "@/styles/Navbar.module.css";

export default function Navbar({ userName, avatar, role, onLogout }) {
  const [open, setOpen] = useState(false);
  const navItems = getNavItemsForRole(role);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <NavLogo />

        {navItems.length > 0 && <DesktopNavLinks navItems={navItems} />}

        <UserMenu
          role={role}
          userName={userName}
          avatar={avatar}
          onLogout={onLogout}
        />

        <button
          className={styles.mobileToggle}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <MobileNavMenu
        isOpen={open}
        onClose={() => setOpen(false)}
        navItems={navItems}
        role={role}
        userName={userName}
        avatar={avatar}
        onLogout={onLogout}
      />
    </nav>
  );
}
