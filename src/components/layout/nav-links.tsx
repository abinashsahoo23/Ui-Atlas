"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Info, Layers3, Sparkles, Menu, X } from "lucide-react";
import styles from "./site-shell.module.css";

export function NavLinks() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStudio = pathname === "/backgrounds";
  const isCollections = pathname === "/collections";
  const isAbout = pathname === "/about";
  const isLibrary = pathname.startsWith("/library") || pathname.startsWith("/item/");

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navWrapper} aria-label="Primary navigation">
        <button
          type="button"
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>

        <div className={`${styles.navigation} ${mobileMenuOpen ? styles.mobileOpen : ""}`}>
          <Link
            className={styles.navLink}
            href="/library"
            data-active={isLibrary}
            aria-current={isLibrary ? "page" : undefined}
            title="Component Library"
            onClick={closeMenu}
          >
            <Layers3 size={15} aria-hidden="true" />
            <span>Library</span>
          </Link>
          <Link
            className={styles.navLink}
            href="/backgrounds"
            data-active={isStudio}
            aria-current={isStudio ? "page" : undefined}
            title="Background Studio"
            onClick={closeMenu}
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>Backgrounds</span>
          </Link>
          <Link
            className={styles.navLink}
            href="/collections"
            data-active={isCollections}
            aria-current={isCollections ? "page" : undefined}
            title="Saved Collections"
            onClick={closeMenu}
          >
            <Bookmark size={15} aria-hidden="true" />
            <span>Collections</span>
          </Link>
          <Link
            className={styles.navLink}
            href="/about"
            data-active={isAbout}
            aria-current={isAbout ? "page" : undefined}
            title="About UI Atlas"
            onClick={closeMenu}
          >
            <Info size={15} aria-hidden="true" />
            <span>About</span>
          </Link>
          <Link className={styles.navCta} href="/library" onClick={closeMenu} title="Explore Library">
            <span>Explore Library</span>
          </Link>
        </div>
      </nav>

      <nav className={styles.mobileTabBar} aria-label="Quick sections">
        <Link className={styles.mobileTab} href="/library" aria-current={isLibrary ? "page" : undefined} onClick={closeMenu}>
          <Layers3 size={17} aria-hidden="true" />
          <span>Library</span>
        </Link>
        <Link className={styles.mobileTab} href="/backgrounds" aria-current={isStudio ? "page" : undefined} onClick={closeMenu}>
          <Sparkles size={17} aria-hidden="true" />
          <span>Backgrounds</span>
        </Link>
        <Link className={styles.mobileTab} href="/collections" aria-current={isCollections ? "page" : undefined} onClick={closeMenu}>
          <Bookmark size={17} aria-hidden="true" />
          <span>Saved</span>
        </Link>
        <Link className={styles.mobileTab} href="/about" aria-current={isAbout ? "page" : undefined} onClick={closeMenu}>
          <Info size={17} aria-hidden="true" />
          <span>About</span>
        </Link>
      </nav>
    </>
  );
}
