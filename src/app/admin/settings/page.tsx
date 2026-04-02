import { auth } from "@/auth";
import { ProfileForm } from "@/components/admin/settings/profile-form";
import { PasswordForm } from "@/components/admin/settings/password-form";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <hr className="border-neutral-200" />;
}

export default async function AdminSettingsPage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Account
        </p>
        <h1 className="text-2xl font-semibold text-neutral-900">Instellingen</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Beheer je profielgegevens en accountbeveiliging.
        </p>
      </div>

      <Section
        title="Profiel"
        description="Je naam en e-mailadres worden gebruikt voor aanmelding en communicatie."
      >
        <ProfileForm name={user.name ?? ""} email={user.email ?? ""} />
      </Section>

      <Divider />

      <Section
        title="Beveiliging"
        description="Verander je wachtwoord. Gebruik minimaal 8 tekens met een mix van letters en cijfers."
      >
        <PasswordForm />
      </Section>

      <Divider />

      <Section
        title="Systeem"
        description="Alleen-lezen overzicht van je account en omgeving."
      >
        <dl className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Rol
            </dt>
            <dd className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {user.role ?? "Admin"}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Gebruikers-ID
            </dt>
            <dd className="font-mono text-xs text-neutral-500">{user.id}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Platform
            </dt>
            <dd className="text-sm text-neutral-600">Teambuilding met Impact — LSP Workshop App</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Omgeving
            </dt>
            <dd className="text-sm text-neutral-600">
              {process.env.NODE_ENV === "production" ? "Productie (Vercel)" : "Ontwikkeling"}
            </dd>
          </div>
        </dl>
      </Section>
    </div>
  );
}
