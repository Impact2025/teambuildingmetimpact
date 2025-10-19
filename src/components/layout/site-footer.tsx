import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/Logo Teambuilding met Impact.png"
                alt="Teambuilding met Impact Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-semibold text-neutral-900">
                Teambuilding met Impact
              </span>
            </Link>
            <p className="max-w-md text-sm text-neutral-600">
              Betekenisvolle teambuilding met LEGO&#174; Serious Play en maatschappelijke projecten.
              Bouw aan sterke teams én een betere wereld.
            </p>
            <p className="text-sm text-neutral-600">
              Onderdeel van{" "}
              <a
                href="https://weareimpact.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006D77] underline hover:text-[#005862]"
              >
                WeAreImpact
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Navigatie
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Home
              </Link>
              <Link
                href="/over-ons"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Over ons
              </Link>
              <Link
                href="/missie"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Onze missie
              </Link>
              <Link
                href="/programmas"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Programma&#39;s
              </Link>
              <Link
                href="/viewer"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                LEGO&#174; Viewer
              </Link>
              <Link
                href="/blog"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Blog
              </Link>
              <Link
                href="#contact"
                className="text-sm text-neutral-600 transition-colors hover:text-[#006D77]"
              >
                Contact
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <p>06 144 70977</p>
              <p>info@teambuildingmetimpact.nl</p>
              <p className="pt-2">
                Luzernestraat 43<br />
                2153 GM Nieuw-Vennep
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} Teambuilding met Impact. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}