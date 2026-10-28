import Link from "next/link";
import type { ReactNode } from "react";
import { NavLinks } from "./nav-links";
import { CtaGradientWaves } from "./cta-gradient-waves";
import { FooterArtBanner } from "./footer-art-banner";
import { GlitchText, GlitchAuroraText, ShimmerText } from "@/app/kinetic-text-effects";
import styles from "./site-shell.module.css";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="UI Atlas home">
          <span className={styles.brandMark} aria-hidden="true" />
          <span className={styles.brandText}>
            <span className={styles.brandName}>UI Atlas</span>
          </span>
        </Link>
        <div className={styles.headerMeta}>
          <NavLinks />
        </div>
      </header>
      <main className={styles.main} id="main-content">
        {children}
      </main>
      <footer className={styles.footer} data-site-footer>
        <div className={styles.footerCard}>
          {/* Top CTA Card ("Above Footer Card") */}
          <div className={styles.ctaCard}>
            <CtaGradientWaves />
            <div className={styles.ctaCardInner}>
              <h2 className={styles.ctaHeadline}>
                <GlitchText text="BUILD SOMETHING" /> <br />
                <GlitchAuroraText text="PEOPLE REMEMBER" className={styles.highlightRed} />
                <span className={styles.periodRed}>.</span>
              </h2>
              <p className={styles.ctaSub}>
                <ShimmerText speed="slow" theme="silver">
                  Start with the free library. When you need the complete system, UI Atlas is ready.
                </ShimmerText>
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/library" className={styles.ctaBtnPrimary}>
                  <span>Explore Full Library</span>
                  <span className={styles.ctaBtnArrow} aria-hidden="true">→</span>
                </Link>
                <Link href="/library" className={styles.ctaBtnSecondary}>
                  <span>Browse free components</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Nav & Brand Section */}
          <div className={styles.footerTop}>
            <div className={styles.footerBrandCol}>
              <Link className={styles.brand} href="/" aria-label="UI Atlas home">
                <span className={styles.brandMark} aria-hidden="true" />
                <span className={styles.brandName}>UI Atlas</span>
              </Link>
              <p className={styles.footerDesc}>
                A local-first library of interface ideas and reusable React previews.
              </p>
            </div>

            <nav className={styles.footerNav} aria-label="Footer Navigation">
              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Explore</span>
                <Link href="/library" className={styles.footerLink}>Library</Link>
                <Link href="/backgrounds" className={styles.footerLink}>Background Studio</Link>
                <Link href="/collections" className={styles.footerLink}>
                  Collections
                </Link>
                <Link href="/library/animations" className={styles.footerLink}>Animations</Link>
              </div>

              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Project</span>
                <Link href="/about" className={styles.footerLink}>About UI Atlas</Link>
                <Link href="/changelog" className={styles.footerLink}>Changelog</Link>
                <Link href="/licenses" className={styles.footerLink}>Licenses & attribution</Link>
              </div>

              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Taxonomy</span>
                <Link href="/library/backgrounds" className={styles.footerLink}>Backgrounds</Link>
                <Link href="/library/text-effects" className={styles.footerLink}>Kinetic Text</Link>
                <Link href="/library/navigation" className={styles.footerLink}>Navigation</Link>
                <Link href="/library/galleries" className={styles.footerLink}>3D Spatial</Link>
              </div>
            </nav>

            <div className={styles.footerLegal}>
              <span>© 2026 UI Atlas</span>
              <span>·</span>
              <span>Built with precision</span>
              <span>·</span>
              <Link href="/licenses" className={styles.footerLegalLink}>Licenses & attribution</Link>
            </div>
          </div>

          {/* Bottom Art Banner */}
          <FooterArtBanner />
        </div>
      </footer>
    </div>
  );
}
