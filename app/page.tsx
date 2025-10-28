import Image from "next/image";
import NoScroll from "@/components/NoScroll";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="h-[100dvh] grid place-items-center bg-white">
      <NoScroll />
      <div className="p-4 md:p-6">
        <Image
          src="/gaia-intro.png"
          alt="GAIA intro artwork"
          width={1200}
          height={1200}
          priority
          className="w-[70vw] max-w-[640px] h-auto soft-mask"
        />
      </div>
      <div className="flex justify-between w-full max-w-3xl px-6 md:px-0 gap-4 mb-12">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Gallery <span aria-hidden>→</span>
        </Link>
        <Link
          href="/apollo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Apollo <span aria-hidden>→</span>
        </Link>
        <Link
          href="/timeline"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Timeline <span aria-hidden>→</span>
        </Link>
        <Link
          href="/health"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Health <span aria-hidden>→</span>
        </Link>
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Labs <span aria-hidden>→</span>
        </Link>
        <Link
          href="/wealth"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-semibold"
        >
          Wealth <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
