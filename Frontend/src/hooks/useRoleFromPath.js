import { useLocation } from "react-router-dom";

export function useRoleFromPath() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/user")) return "user";

  return "guest";
}
