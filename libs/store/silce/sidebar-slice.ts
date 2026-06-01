import { StateCreator } from "zustand";

export type NavMenuKey =
    | "dashboard"
    | "leads"
    | "create-sheet"
    | "sheets"
    | "users"
    | "invite-manager"
    | "linkedin"
    | "linkedin-search"
    | "linkedin-message";

export interface SidebarSlice {
    isExpand: boolean;
    menuExpand: Record<NavMenuKey, boolean>;
    isExpired: boolean;

    setInitialState: () => void;
    setExpand: () => void;
    setMenuExpand: (section: NavMenuKey, value: boolean) => void;
    setIsExpired: (value: boolean) => void;
}

const initialState = {
    isExpand: true,
    menuExpand: {
        dashboard: false,
        leads: false,
        "create-sheet": false,
        sheets: false,
        users: false,
        "invite-manager": false,
        linkedin: false,
        "linkedin-search": false,
        "linkedin-message": false,
    },
    isExpired: false,
};

export const createSidebarSlice: StateCreator<
    SidebarSlice,
    [],
    [],
    SidebarSlice
> = (set) => ({
    ...initialState,

    setInitialState: () =>
        set({
            isExpand: initialState.isExpand,
            menuExpand: { ...initialState.menuExpand },
            isExpired: initialState.isExpired,
        }),

    setExpand: () =>
        set((state) => ({
            isExpand: !state.isExpand,
        })),

    setMenuExpand: (section, value) =>
        set((state) => ({
            menuExpand: {
                ...state.menuExpand,
                [section]: value,
            },
        })),

    setIsExpired: (value) =>
        set({
            isExpired: value,
        }),
});