"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => (pathname === path ? styles.active : "");

  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon}>V</div>
          <span className={styles.logoText}>VaultShield</span>
        </Link>

        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${isActive("/")}`}>
            Dashboard
          </Link>
          <Link
            href="/features"
            className={`${styles.link} ${isActive("/features")}`}
          >
            Features
          </Link>
          <Link
            href="/about"
            className={`${styles.link} ${isActive("/about")}`}
          >
            Mission
          </Link>
        </div>

        <button
          className={styles.glowButton}
          onClick={() => alert("Wallet Connect Placeholder")}
        >
          Connect ID
        </button>
      </div>
    </nav>
  );
}
