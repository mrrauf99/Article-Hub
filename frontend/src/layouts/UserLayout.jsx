import { useState, Suspense } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import NavigationProgress from "../components/NavigationProgress";
import Navbar from "../components/navbar/Navbar.jsx";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLogout } from "../hooks/useLogout";
import SEO from "@/components/SEO";
import UserRail from "@/features/user/components/UserRail";
import PanelSkeleton from "@/features/user/components/PanelSkeleton";
import PanelFooter from "@/components/PanelFooter";

export default function UserLayout() {
  const { user } = useLoaderData();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout: logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const openLogout = () => setShowLogoutConfirm(true);

  return (
    <div data-panel="user" className="min-h-[100dvh] bg-paper font-ui text-ink">
      <SEO title="Account" canonicalPath={location.pathname} noindex nofollow />
      <ScrollToTop />
      <NavigationProgress />

      <a
        href="#panel-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>

      <UserRail user={user} onLogout={openLogout} />

      <div className="flex min-h-[100dvh] min-w-0 flex-col lg:pl-60">
        {/* Below lg the rail collapses into the shared top navbar and its menu. */}
        <div className="sticky top-0 z-40 lg:hidden">
          <Navbar
            role={user.role}
            userName={user.username}
            avatar={user.avatar_url}
            onLogout={openLogout}
          />
        </div>

        <main id="panel-main" className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
          <div className="mx-auto w-full max-w-6xl">
            <Suspense fallback={<PanelSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>

        <PanelFooter />
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="You'll be signed out of Article Hub on this device. Anything you haven't submitted will be lost."
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
