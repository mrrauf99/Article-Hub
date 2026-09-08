import { useState, useEffect, Suspense } from "react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useRevalidator,
} from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import NavigationProgress from "../components/NavigationProgress";
import Navbar from "../components/navbar/Navbar.jsx";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLogout } from "../hooks/useLogout";
import SEO from "@/components/SEO";
import PanelRail from "@/components/PanelRail";
import PanelFooter from "@/components/PanelFooter";
import PanelSkeleton from "@/features/user/components/PanelSkeleton";
import { getNavItemsForRole } from "@/utils/navConfig";

const POLLING_INTERVAL = 45000;

export default function AdminLayout() {
  const { user, pendingCount = 0 } = useLoaderData();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout: logout, isLoggingOut } = useLogout();
  const revalidator = useRevalidator();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const openLogout = () => setShowLogoutConfirm(true);

  // Keeps the queue count (and the open page's data) fresh for moderators.
  // Skips the request while the tab is hidden, and catches up immediately
  // when it becomes visible again instead of waiting for the next tick.
  useEffect(() => {
    const revalidateIfIdle = () => {
      if (!document.hidden && revalidator.state === "idle") {
        revalidator.revalidate();
      }
    };

    const intervalId = setInterval(revalidateIfIdle, POLLING_INTERVAL);

    const onVisibilityChange = () => {
      if (!document.hidden) revalidateIfIdle();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [revalidator]);

  const navItems = getNavItemsForRole("admin").map((item) =>
    item.href === "/admin/dashboard"
      ? { ...item, badge: pendingCount, badgeLabel: "in review" }
      : item,
  );

  return (
    <div data-panel="admin" className="min-h-[100dvh] bg-paper font-ui text-ink">
      <SEO title="Admin" canonicalPath={location.pathname} noindex nofollow />
      <ScrollToTop />
      <NavigationProgress />

      <a
        href="#panel-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>

      <PanelRail
        user={user}
        navItems={navItems}
        navLabel="Admin"
        profilePath="/admin/profile"
        onLogout={openLogout}
      />

      <div className="flex min-h-[100dvh] min-w-0 flex-col lg:pl-60">
        <div className="sticky top-0 z-40 lg:hidden">
          <Navbar
            role={user.role}
            userName={user.username}
            avatar={user.avatar_url}
            onLogout={openLogout}
            pendingCount={pendingCount}
          />
        </div>

        <main id="panel-main" className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
          <div className="mx-auto w-full max-w-6xl">
            <Suspense fallback={<PanelSkeleton />}>
              <Outlet context={{ user }} />
            </Suspense>
          </div>
        </main>

        <PanelFooter />
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="You'll be signed out of Article Hub on this device."
        confirmText="Log out"
        cancelText="Cancel"
        variant="warning"
        isLoading={isLoggingOut}
        loadingText="Logging out"
        showLoadingDots={false}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
