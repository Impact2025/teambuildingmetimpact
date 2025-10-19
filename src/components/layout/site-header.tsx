import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/images/Logo Teambuilding met Impact.png"
            alt="Teambuilding met Impact Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-semibold text-neutral-900">
              Teambuilding met Impact
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/over-ons"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-[#006D77]"
          >
            Over ons
          </Link>
          <Link
            href="/missie"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-[#006D77]"
          >
            Onze missie
          </Link>
          <Link
            href="/programmas"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-[#006D77]"
          >
            Programma&#39;s
          </Link>
          <Link
            href="/viewer"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-[#006D77]"
          >
            LEGO&#174; Viewer
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-neutral-700 transition-colors hover:text-[#006D77]"
          >
            Blog
          </Link>
          <Link
            href="#contact"
            className="rounded-xl bg-[#006D77] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#005862]"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}