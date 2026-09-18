"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingAddButton() {
  const pathname = usePathname();
  if (pathname === "/add") return null;

  return (
    <Link
      href="/add"
      aria-label="Add item"
      className="fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-navy text-cream flex items-center justify-center shadow-lg hover:opacity-90"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
