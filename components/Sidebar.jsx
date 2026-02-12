"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "RealTime", href: "/realtime" },
  { name: "Configuration", href: "/configure" },
  { name: "Page Three", href: "/page-three" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-black px-6 py-8">
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm transition
                ${
                  active
                    ? "bg-white text-black"
                    : "text-muted hover:bg-border hover:text-white"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
