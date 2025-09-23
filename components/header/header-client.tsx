// components/header/header-client.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import DesktopNav from "@/components/header/desktop-nav";
import MobileNav from "@/components/header/mobile-nav";
import Logo from "@/components/logo";
import { ModeToggle } from "@/components/menu-toggle";
import { cn } from "@/lib/utils";
import {
  NAVIGATION_QUERYResult,
  SETTINGS_QUERYResult,
} from "@/sanity.types";

type HeaderClientProps = {
  navigation: NAVIGATION_QUERYResult;
  settings: SETTINGS_QUERYResult;
};

export default function HeaderClient({
  navigation,
  settings,
}: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const headerIsSolid = isScrolled || pathname !== "/";

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 48);
    updateScrollState();

    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-500",
          headerIsSolid
            ? "border-white/10 bg-background/90 shadow-xs supports-[backdrop-filter]:backdrop-blur"
            : "border-transparent bg-transparent shadow-none",
        )}
      >
        <div
          className={cn(
            "container flex h-14 items-center justify-between gap-6 transition-colors duration-500",
            headerIsSolid ? "text-foreground" : "text-white",
          )}
        >
          <Link
            href="/"
            aria-label="Home page"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.01]"
          >
            <Logo settings={settings} />
          </Link>
          <div className="hidden items-center gap-6 xl:flex">
            <DesktopNav navigation={navigation} isSolid={headerIsSolid} />
            <ModeToggle
              className={cn(
                "transition-colors duration-300",
                headerIsSolid
                  ? "text-foreground hover:text-foreground"
                  : "text-white/90 hover:text-white",
              )}
            />
          </div>
          <div
            className={cn(
              "flex items-center gap-2 xl:hidden",
              headerIsSolid ? "text-foreground" : "text-white",
            )}
          >
            <ModeToggle
              className={cn(
                "transition-colors duration-300",
                headerIsSolid
                  ? "text-foreground hover:text-foreground"
                  : "text-white/90 hover:text-white",
              )}
            />
            <MobileNav navigation={navigation} settings={settings} />
          </div>
        </div>
      </header>
      <div aria-hidden className="h-14 w-full" />
    </>
  );
}
