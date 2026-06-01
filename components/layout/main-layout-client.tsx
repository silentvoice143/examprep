"use client";

import React, { ReactNode, useRef } from "react";
import Sidebar from "./sidebar";
import ScrollToTop from "../shared/sroll-to-top";
import { getFilteredNavItems, NAV_ITEMS } from "@/libs/utils/navigation-config"

import dynamic from "next/dynamic";

import { Role } from "@/libs/constants/roles";
import { useStore } from "@/libs/store";

const Header = dynamic(() => import("./header"), {
  ssr: false,
});

const MainLayoutClient = ({ children }: { children: ReactNode }) => {
  const scrollRef = useRef(null);
  const user = useStore((state) => state.user)

  return (
    <div className="h-screen flex overflow-hidden min-w-0">
      <ScrollToTop scrollRef={scrollRef} />
      <Sidebar
        navItems={getFilteredNavItems(
          NAV_ITEMS,
          user?.role as Role,
        )}
      />

      <section className="flex flex-col flex-1  min-w-0">
        <Header />
        <div
          ref={scrollRef}
          className="flex-1  min-w-0 overflow-y-auto relative bg-linear-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
        >
          {children}
        </div>
      </section>
    </div>
  );
};

export default MainLayoutClient;
