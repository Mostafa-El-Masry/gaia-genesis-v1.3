"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GaiaWordmark } from "./Brand";
export function TopLeftHome() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="corner">
      <Link href="/" aria-label="Back to GAIA Intro">
        <div className="g-badge" aria-hidden>
          <Image src="/gaia-intro.svg" width={40} height={40} alt="GAIA Logo" />
        </div>
        <span className="g-text sr-only md:not-sr-only md:ml-2">
          <GaiaWordmark />
        </span>
      </Link>
    </div>
  );
}
