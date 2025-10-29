"use client";

import Link from "next/link";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/apollo", label: "Apollo" },
  { href: "/timeline", label: "Timeline" },
  { href: "/health", label: "Health" },
  { href: "/labs", label: "Labs" },
  { href: "/wealth", label: "Wealth" },
  { href: "/search", label: "Search" }, // ← new
  { href: "/sync", label: "Sync & Backup" }, // centralized
];

export default function Intro() {
  return (
    <main className="min-h-[100vh] bg-white text-black grid place-items-center p-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight">GAIA</h1>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-lg font-semibold
                           hover:border-black hover:shadow-md"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs opacity-60">
          Tip: the small “G/GAIA” button stays on other pages (top-left) to
          return here.
        </p>
      </div>
    </main>
  );
}
