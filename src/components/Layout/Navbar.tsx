"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const base =
      "text-sm font-medium uppercase tracking-widest text-text-muted relative py-2 transition-colors duration-300 hover:text-secondary group";
    const active = "text-primary text-shadow-glow";

    return `${base} ${isActive ? active : ""}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10 shadow-lg transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-[4.5rem] flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-3 opacity-100 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary rounded flex items-center justify-center text-primary font-bold font-mono shadow-[0_0_10px_rgba(0,243,255,0.1)]">
            V
          </div>
          <span className="text-xl font-extrabold tracking-widest uppercase text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            VaultShield
          </span>
        </Link>

        <div className="flex gap-8">
          <Link href="/" className={getLinkClasses("/")}>
            Dashboard
            <span
              className={`absolute bottom-0 left-0 h-[1px] bg-secondary shadow-[0_0_5px_var(--secondary)] transition-all duration-300 ease-in-out ${pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
          <Link href="/features" className={getLinkClasses("/features")}>
            Features
            <span
              className={`absolute bottom-0 left-0 h-[1px] bg-secondary shadow-[0_0_5px_var(--secondary)] transition-all duration-300 ease-in-out ${pathname === "/features" ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
          <Link href="/about" className={getLinkClasses("/about")}>
            Mission
            <span
              className={`absolute bottom-0 left-0 h-[1px] bg-secondary shadow-[0_0_5px_var(--secondary)] transition-all duration-300 ease-in-out ${pathname === "/about" ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </Link>
        </div>

        <button
          className="px-4 py-2 bg-primary/10 border border-primary text-primary font-mono text-xs uppercase cursor-pointer transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]"
          onClick={() => alert("Wallet Connect Placeholder")}
        >
          Connect ID
        </button>
      </div>
    </nav>
  );
}
