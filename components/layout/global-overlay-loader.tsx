"use client";

import { ReactNode } from "react";
import { useStore } from "@/libs/store";
import { SpinnerOverlay } from "./spinner-overlay";


const GlobalOverlayLoader = ({ children }: { children: ReactNode }) => {
    const { globalOverlayLoading } = useStore(state => state);
    return globalOverlayLoading ? <SpinnerOverlay /> : children;
};

export default GlobalOverlayLoader;
