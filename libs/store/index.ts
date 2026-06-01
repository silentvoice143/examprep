import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SidebarSlice, createSidebarSlice } from "./silce/sidebar-slice";
import { AuthSlice, createAuthSlice } from "./silce/auth-slice";

type Store = SidebarSlice & AuthSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createSidebarSlice(...a),
      ...createAuthSlice(...a)
    }),
    {
      name: "app-storage",

      // ⚠️ Persist only what you need
      partialize: (state) => ({
        isExpand: state.isExpand,
        menuExpand: state.menuExpand,
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    },
  ),
);
