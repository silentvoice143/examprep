"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function ScrollToTop({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
