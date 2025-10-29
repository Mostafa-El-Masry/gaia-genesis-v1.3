'use client';
import Link from 'next/link';
const LINKS = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/apollo', label: 'Apollo' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/health', label: 'Health' },
  { href: '/labs', label: 'Labs' },
  { href: '/wealth', label: 'Wealth' },
  { href: '/search', label: 'Search' },
  { href: '/sync', label: 'Sync & Backup' },
];
export default function Intro() {
  return (
    <main className="min-h-[100svh] bg-white text-black grid place-items-center p-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight">GAIA</h1>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href}
                className="block rounded-xl border border-black/10 bg-white px-4 py-3 text-lg font-semibold hover:border-black/30 hover:shadow-md active:scale-[.99] transition">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
