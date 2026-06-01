import { ReactNode } from "react";
import MainLayoutClient from "@/components/layout/main-layout-client";

export default function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <MainLayoutClient>
            <div className="max-w-360 mx-auto px-2 sm:px-6 py-6 min-w-0">
                {children}
            </div>
        </MainLayoutClient>
    );
}
