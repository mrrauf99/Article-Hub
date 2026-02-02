import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/NavigationProgress";

export default function AuthLayout() {
  return (
    <>
      <ScrollToTop />
      <NavigationProgress />
      <Outlet />
    </>
  );
}
