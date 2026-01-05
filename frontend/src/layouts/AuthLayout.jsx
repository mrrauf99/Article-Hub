import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

export default function AuthLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
