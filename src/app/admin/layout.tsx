import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminNav } from "@/components/admin/admin-nav";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminNav userName={session.user.name} />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white/80 px-6 py-6 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Workshopdashboard
            </p>
            <h1 className="text-xl font-semibold text-neutral-900">
              Welkom terug{session.user.name ? `, ${session.user.name}` : ""}
            </h1>
          </div>
          <div className="hidden rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-500 lg:block">
            Dagmodus synchroniseert automatisch met de presentatie-viewer.
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 pb-16 pt-10">{children}</main>
      </div>
    </div>
  );
}
