// store/slice/auth-slice.ts

import { StateCreator } from "zustand";

export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    [key: string]: any;
}

export interface AuthSlice {
    // Auth
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Global Loaders
    globalLoading: boolean;
    globalOverlayLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (user: User, token: string) => void;
    logout: () => void;

    setGlobalLoading: (loading: boolean) => void;
    setGlobalOverlayLoading: (loading: boolean) => void;

    resetAuth: () => void;
}

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,

    globalLoading: false,
    globalOverlayLoading: false,
};

export const createAuthSlice: StateCreator<
    AuthSlice,
    [],
    [],
    AuthSlice
> = (set) => ({
    ...initialState,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: !!user,
        }),

    setToken: (token) =>
        set({
            token,
        }),

    login: (user, token) =>
        set({
            user,
            token,
            isAuthenticated: true,
        }),

    logout: () =>
        set({
            ...initialState,
        }),

    setGlobalLoading: (loading) =>
        set({
            globalLoading: loading,
        }),

    setGlobalOverlayLoading: (loading) =>
        set({
            globalOverlayLoading: loading,
        }),

    resetAuth: () =>
        set({
            ...initialState,
        }),
});