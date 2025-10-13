import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-100 via-neutral-100 to-neutral-200 px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white/90 shadow-xl shadow-neutral-200 backdrop-blur-sm">
        <div className="space-y-6 px-10 py-12">
          <header className="space-y-1 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
              LEGO® SERIOUS PLAY®
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Workshop Companion
            </h1>
            <p className="text-sm text-neutral-500">
              Meld je aan als facilitator om sessies, timers en presentaties te beheren.
            </p>
          </header>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
