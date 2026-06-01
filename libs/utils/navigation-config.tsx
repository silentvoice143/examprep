import { Role, ROLES } from "../constants/roles";
import {
  LayoutDashboard,
  FileText,
  Settings,
  PenSquare,
  Edit2Icon,
} from "lucide-react";

export interface NavItem {
  label: string;
  key: string;
  icon: React.ReactNode;
  href?: string;
  roles: Role[];
  description?: string;
  menuItem?: {
    icon?: React.ReactNode;
    label: string;
    href: string;
    description?: string;
    roles: Role[];
  }[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    key: "dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    roles: [ROLES.ADMIN, ROLES.ADMIN],
  },

  {
    label: "Tests",
    key: "tests",
    href: "/tests",
    icon: <FileText size={20} />,
    roles: [ROLES.STUDENT, ROLES.ADMIN],
  },



];

export const getFilteredNavItems = (
  items: NavItem[],
  role: Role,
): NavItem[] => {
  return (
    items
      // First filter parent
      .filter((item) => item.roles.includes(role))

      //Then map safely
      .map((item) => {
        const filteredSubMenu = item.menuItem?.filter((sub) =>
          sub.roles.includes(role),
        );

        return {
          ...item,
          menuItem: filteredSubMenu,
        };
      })

      // Final cleanup
      .filter(
        (item) => item.href || (item.menuItem && item.menuItem.length > 0),
      )
  );
};
