"use client";
import { useEffect, useState } from "react";
import {
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import { useStore } from "@/libs/store";


type SidebarProps = {
  navItems: any;
};

export default function Sidebar({ navItems }: SidebarProps) {
  const pathName = usePathname();
  const isExpand = useStore((state) => state.isExpand);
  const menuExpand = useStore((state) => state.menuExpand);
  const setExpand = useStore((state) => state.setExpand);
  const setMenuExpand = useStore((state) => state.setMenuExpand);
  const user = { name: "Hello", email: "Hello" };
  const toggleSidebar = () => {
    setExpand();
  };

  const closeSidebar = () => {
    if (isExpand) {
      setExpand();
    }
  };

  const handleNavClick = () => {
    if (window.innerWidth < 640 && isExpand) {
      closeSidebar();
    }
  };

  function getDaysRemainingIST(targetDateStr: string): number {
    const now = new Date();
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const todayIST = new Date(
      istNow.getFullYear(),
      istNow.getMonth(),
      istNow.getDate(),
    );

    const target = new Date(targetDateStr);
    const targetISTFull = new Date(
      target.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const targetIST = new Date(
      targetISTFull.getFullYear(),
      targetISTFull.getMonth(),
      targetISTFull.getDate(),
    );

    const diffInMs = targetIST.getTime() - todayIST.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  // if (hideSidebar) return null;

  const profile_img = "";
  const name = user?.name;
  const email = user?.email;

  return (
    <>
      {/* Mobile Overlay */}
      {isExpand && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-20 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "h-screen bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col shadow-lg z-20",
          "sm:relative sm:shadow-sm",
          "fixed sm:translate-x-0 z-50",
          isExpand
            ? "w-72 translate-x-0"
            : "w-72 -translate-x-full sm:w-16 sm:translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between py-4 border-b border-neutral-100 ${isExpand ? "px-4" : "px-3"}`}
        >
          <div
            className={clsx(
              "flex items-center gap-3 transition-all duration-300 overflow-hidden",
              !isExpand && "lg:justify-center",
            )}
          >
            {profile_img ? (
              <img
                className={
                  "w-9 h-9 rounded-xl flex shrink-0 items-center justify-center shadow-lg"
                }
                src={profile_img}
                alt="Logo"
              />
            ) : (
              <div className="w-9 h-9 shrink-0 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {name?.charAt(0) || "HR"}
                </span>
              </div>
            )}
            {(isExpand || window.innerWidth < 1024) && (
              <div className="animate-fade-in ">
                <h1 className="text-lg font-bold whitespace-nowrap text-neutral-900 font-montserrat">
                  {name}
                </h1>
                <Link
                  href={email ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block max-w-45 text-xs text-neutral-500 font-medium truncate hover:underline"
                >
                  {email}
                </Link>
              </div>
            )}
          </div>

          {isExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-lg"
            >
              <PanelLeftClose size={16} className="text-neutral-500" />
            </Button>
          )}
        </div>

        {/* Desktop expand button when collapsed */}
        {!isExpand && (
          <div className="absolute hidden sm:block -right-3 top-16 z-100">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="h-7 w-7 p-0 rounded-full z-100 bg-white border-2 border-neutral-200 shadow-lg hover:shadow-xl transition-all"
            >
              <PanelLeft size={14} className="text-neutral-600" />
            </Button>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto pb-10">
          {navItems.map((item: any, index: number) => {
            const sectionKey = item.label
              .toLowerCase()
              .replace(/\s+/g, "-");
            const isOpen = menuExpand[sectionKey as keyof typeof menuExpand];;
            const isActive = item.href && pathName === item.href;

            return (
              <div key={`menu-item-${index}`} className="space-y-1">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={handleNavClick}
                    className={clsx(
                      "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                      isActive
                        ? "bg-brand-primary text-white shadow-md "
                        : "hover:bg-neutral-100 text-neutral-700 hover:text-brand-primary",
                      !isExpand && "lg:justify-center",
                    )}
                  >
                    <div
                      className={clsx(
                        "shrink-0 transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-neutral-600 group-hover:text-brand-primary hover:text-brand-primary",
                      )}
                    >
                      {item.icon}
                    </div>

                    {(isExpand || window.innerWidth < 640) && (
                      <div className="flex-1 animate-fade-in">
                        <span className="font-semibold text-sm text-nowrap">
                          {item.label}
                        </span>
                      </div>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </Link>
                ) : (
                  /* Dropdown Menu Item */
                  <div>
                    <button
                      onClick={() => {
                        setMenuExpand(
                          sectionKey,
                          !isOpen,
                        )
                      }}
                      className={clsx(
                        "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 w-full text-left",
                        "hover:bg-neutral-50 text-neutral-700 cursor-pointer",
                        !isExpand && "lg:justify-center",
                        isActive
                          ? ""
                          : "hover:bg-neutral-100 hover:text-brand-primary",
                      )}
                    >
                      <div className="shrink-0 text-neutral-600 group-hover:text-brand-primary transition-colors">
                        {item.icon}
                      </div>

                      {(isExpand || window.innerWidth < 640) && (
                        <div className="flex-1 flex items-center justify-between animate-fade-in">
                          <span className="font-semibold text-sm">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={16}
                            className={clsx(
                              "transition-transform duration-200 text-neutral-400",
                              isOpen && "rotate-90",
                            )}
                          />
                        </div>
                      )}
                    </button>

                    {/* Submenu */}
                    {(isExpand || window.innerWidth < 640) &&
                      isOpen &&
                      item.menuItem && (
                        <div className="mt-1 ml-6 space-y-1 animate-slide-up">
                          {item.menuItem.map((childItem: any, idx: number) => {
                            const isChildActive = pathName === childItem.href;
                            return (
                              <Link
                                key={`menu-child-item-${idx}`}
                                href={childItem.href ?? ""}
                                onClick={handleNavClick}
                                className={clsx(
                                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                                  isChildActive
                                    ? "bg-brand-muted text-brand-primary border-l-3 border-brand-primary"
                                    : "hover:bg-neutral-50 text-neutral-600 hover:text-brand-primary",
                                )}
                              >
                                <div className="shrink-0">{childItem.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      {childItem.label}
                                    </span>
                                    {childItem.badge && (
                                      <span
                                        className={clsx(
                                          "text-xs px-2 py-0.5 rounded-full font-medium",
                                          childItem.badge === "Phase 2"
                                            ? "bg-neutral-200 text-neutral-600"
                                            : "bg-orange-100 text-orange-600",
                                        )}
                                      >
                                        {childItem.badge}
                                      </span>
                                    )}
                                  </div>
                                  {childItem.description && (
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                      {childItem.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}

                    {/* Collapsed Tooltip - Only on desktop */}
                    {!isExpand && item.menuItem && (
                      <div className="absolute left-20 top-0 bg-neutral-900 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-48 hidden lg:block">
                        <div className="text-sm font-medium mb-2">
                          {item.label}
                        </div>
                        {item.menuItem
                          .slice(0, 4)
                          .map((child: any, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs text-neutral-300 py-1 flex items-center justify-between"
                            >
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="text-xs bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-400">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
