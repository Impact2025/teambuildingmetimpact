"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";

import { SignOutButton } from "@/components/admin/sign-out-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Overzicht" },
  { href: "/admin/sessions", label: "Sessies" },
  { href: "/admin/timer", label: "Timer" },
  { href: "/admin/uploads", label: "Bouwwerken" },
  { href: "/admin/analysis", label: "AI-analyse" },
  { href: "/admin/quotes", label: "Offertes" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/checklists", label: "Checklists" },
  { href: "/admin/settings", label: "Instellingen" },
];

type AdminNavProps = {
  userName?: string | null;
};

export function AdminNav({ userName }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-neutral-200 bg-white/90 px-6 py-10 shadow-sm shadow-neutral-100 lg:flex lg:flex-col lg:justify-between">
      <div className="space-y-10">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Facilitator
          </p>
          <h2 className="text-lg font-semibold text-neutral-900">
            {userName ?? "Workshopleider"}
          </h2>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block rounded-xl px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm shadow-neutral-300"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-700">Dagstatus</p>
          <p>Start de timer in het overzicht om de presentatie-viewer te synchroniseren.</p>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
