"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearIcon } from "@/components/icons";

const links = [
  { href: "/inventory", label: "Inventory" },
  { href: "/stats", label: "Stats" },
  { href: "/chat", label: "Recipes" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-10 bg-cream/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-2 overflow-x-auto">
        <Link
          href="/"
          className="font-display font-semibold text-lg text-navy shrink-0"
        >
          Provisions
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-body text-sm px-2.5 py-1.5 whitespace-nowrap ${
                  active
                    ? "font-semibold text-navy"
                    : "font-medium text-stone-500 hover:text-navy"
                }`}
              >
                {active && (
                  <span
                    className="absolute left-1 right-1 bottom-1 h-2 bg-gold -z-10"
                    style={{
                      clipPath:
                        "polygon(0 0,100% 0,100% 55%,80% 100%,60% 55%,40% 100%,20% 55%,0 100%)",
                    }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/settings"
            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
              pathname === "/settings"
                ? "bg-navy text-cream"
                : "text-stone-500 hover:bg-white"
            }`}
            aria-label="Settings"
          >
            <GearIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}
