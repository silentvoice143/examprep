import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuditSlice, createAuditSlice } from "./silce/audit-slice";

type Store = AuditSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuditSlice(...a),

    }),
    {
      name: "app-storage",

      // ⚠️ Persist only what you need
      partialize: (state) => ({
        form: state.form,
        report: state.report
      }),
    },
  ),
);
