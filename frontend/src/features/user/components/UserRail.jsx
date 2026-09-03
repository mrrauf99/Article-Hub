import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, UserRound } from "lucide-react";

import NavLogo from "@/components/navbar/NavLogo";
import { getNavItemsForRole } from "@/utils/navConfig";

const ITEM =
  "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

function itemClass({ isActive }) {
  return `${ITEM} ${
    isActive
      ? "bg-moss-400/20 text-paper"
      : "text-paper/65 hover:bg-paper/5 hover:text-paper"
  }`;
}

function RailLink({ to, label, Icon }) {
  return (
    <NavLink to={to} end className={itemClass}>
      {({ isActive }) => (
        <>
          <Icon
            className={`h-[1.125rem] w-[1.125rem] shrink-0 ${
              isActive ? "text-moss-300" : "text-paper/45 group-hover:text-paper/70"
            }`}
            aria-hidden="true"
          />
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function UserRail({ user, onLogout }) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const navItems = getNavItemsForRole("user");
  const displayName = user.name || user.username;
  const hasAvatar = Boolean(user.avatar_url?.trim()) && !avatarFailed;

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col border-r border-hairline-dark bg-ink-950 lg:flex">
      <div className="flex h-16 items-center px-5">
        <NavLogo />
      </div>

      <nav aria-label="Writer" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pt-4">
        {navItems.map(({ label, href, icon }) => (
          <RailLink key={href} to={href} label={label} Icon={icon} />
        ))}

        <div className="my-3 h-px bg-paper/10" role="presentation" />

        <RailLink to="/user/profile" label="Profile & security" Icon={UserRound} />
      </nav>

      <div className="border-t border-paper/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-moss-600 text-sm font-semibold text-paper">
            {hasAvatar ? (
              <img
                src={user.avatar_url}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-paper">
              {displayName}
            </span>
            <span className="block truncate text-xs text-paper/55">
              @{user.username}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className={`${ITEM} mt-1 w-full text-paper/65 hover:bg-red-500/10 hover:text-red-200`}
        >
          <LogOut className="h-[1.125rem] w-[1.125rem] text-paper/45" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
