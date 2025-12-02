// src/components/Navbar/navConfig.js
import { Home, FileText, BarChart, Users,Contact } from "lucide-react";

export const getNavItemsForRole = (userRole) => {
  const common = [{ label: "Home", icon: Home, href: "/" }
    ,{ label: "Contact", icon: Contact, href: "/contact" }
  ];

  if (userRole === "user") {
    return [
      ...common,
      { label: "My Articles", icon: FileText, href: "/my-articles" },
      { label: "Create Article", icon: FileText, href: "/new-article" },
    ];
  }

  if (userRole === "admin") {
    return [
      ...common,
      { label: "Dashboard", icon: BarChart, href: "/admin/dashboard" },
      { label: "Manage Users", icon: Users, href: "/admin/users" },
      { label: "All Articles", icon: FileText, href: "/admin/articles" },
    ];
  }

  // guest
  return common;
};
