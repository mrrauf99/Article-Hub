import PanelRail from "@/components/PanelRail";
import { getNavItemsForRole } from "@/utils/navConfig";

export default function UserRail({ user, onLogout }) {
  return (
    <PanelRail
      user={user}
      navItems={getNavItemsForRole("user")}
      navLabel="Writer"
      profilePath="/user/profile"
      onLogout={onLogout}
    />
  );
}
