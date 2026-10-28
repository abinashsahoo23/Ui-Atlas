import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ExternalLink, FileText, Fingerprint, Scale, Type } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./licenses.module.css";

export const metadata: Metadata = {
  title: "Licenses & attribution",
  description: "Review the attribution and license records for UI Atlas examples, fonts, and runtime packages.",
};

const catalogLicenseGroups = catalogEntries.reduce<Array<{ attribution: string; license: string; count: number }>>(
  (groups, entry) => {
    const group = groups.find((item) => item.attribution === entry.attribution && item.license === entry.license);
    if (group) group.count += 1;
    else groups.push({ attribution: entry.attribution, license: entry.license, count: 1 });
    return groups;
  },
  [],
);

const fonts = [
  { name: "Inter", role: "Interface typography", credit: "The Inter Project Authors", project: "https://github.com/rsms/inter", notice: "docs/licenses/Inter-OFL.txt" },
  { name: "Pixelify Sans", role: "Display typography", credit: "The Pixelify Sans Project Authors", project: "https://github.com/eifetx/Pixelify-Sans", notice: "docs/licenses/Pixelify-Sans-OFL.txt" },
  { name: "JetBrains Mono", role: "Technical labels and code", credit: "The JetBrains Mono Project Authors", project: "https://github.com/JetBrains/JetBrainsMono", notice: "docs/licenses/JetBrains-Mono-OFL.txt" },
];

const runtimePackages = [
  { name: "Next.js", packageName: "next", license: "MIT" },
  { name: "React", packageName: "react", license: "MIT" },
  { name: "React DOM", packageName: "react-dom", license: "MIT" },
  { name: "Lucide React", packageName: "lucide-react", license: "ISC" },
  { name: "Motion", packageName: "motion", license: "MIT" },
];

const linkedSources = catalogEntries.filter((entry) => entry.sourceUrl).length;

export default function LicensesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}><Scale size={14} aria-hidden="true" /> TRANSPARENCY / SOURCES / TERMS</p>
          <h1><WaveRippleHeading text="Licenses & attribution" periodChar="." /></h1>
          <p className={styles.lead}>
            <ShimmerText speed="slow" theme="silver">
              A clear record of where the examples, typefaces, and runtime libraries come from—and which terms belong to each one.
            </ShimmerText>
          </p>
        </div>
        <div className={styles.heroStamp}>
          <Fingerprint size={23} aria-hidden="true" />
          <span>PROVENANCE<br /><strong>BY ENTRY</strong></span>
        </div>
      </header>

      <div className={styles.notice} role="note">
        <span className={styles.noticeIcon}><FileText size={17} aria-hidden="true" /></span>
        <p><strong>There is no blanket license for the whole catalog.</strong> UI Atlas is marked private in its package metadata. Use the attribution and terms shown on each item page; an “original study” record describes origin and is not itself a general license grant.</p>
        <Link href="/library">Review entries <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>

      <ScrollReveal as="section" className={styles.catalogSection} aria-labelledby="catalog-terms-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>01 / CATALOG</p><h2 id="catalog-terms-title">Example attribution</h2></div>
          <span className={styles.countBadge}>{catalogEntries.length} entries</span>
        </div>
        <div className={styles.licenseGroupGrid}>
          {catalogLicenseGroups.map((group) => (
            <article className={styles.licenseGroup} key={`${group.attribution}-${group.license}`}>
              <span className={styles.groupIcon}><Check size={16} aria-hidden="true" /></span>
              <div>
                <p className={styles.groupCount}>{String(group.count).padStart(2, "0")} CATALOG ENTRIES</p>
                <h3>{group.attribution}</h3>
                <p>{group.license}</p>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.sectionNote}>{linkedSources} current entries include an external source URL. When present, the source and its reuse terms are shown on that entry’s detail page.</p>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.fontSection} aria-labelledby="font-terms-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>02 / TYPE</p><h2 id="font-terms-title">Bundled typefaces</h2></div>
          <span className={styles.countBadge}>SIL OFL 1.1</span>
        </div>
        <div className={styles.fontGrid}>
          {fonts.map((font) => (
            <article className={styles.fontCard} key={font.name}>
              <div className={styles.fontCardTop}><span><Type size={16} aria-hidden="true" /></span><span className={styles.licensePill}>OFL 1.1</span></div>
              <h3>{font.name}</h3>
              <p className={styles.fontRole}>{font.role}</p>
              <p className={styles.credit}>Copyright: {font.credit}</p>
              <a href={font.project} target="_blank" rel="noreferrer">Font project <ExternalLink size={13} aria-hidden="true" /></a>
              <code>{font.notice}</code>
            </article>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.runtimeSection} aria-labelledby="runtime-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>03 / RUNTIME</p><h2 id="runtime-title">Core application packages</h2></div>
          <span className={styles.countBadge}>DIRECT DEPENDENCIES</span>
        </div>
        <div className={styles.packageList}>
          {runtimePackages.map((pkg) => (
            <div className={styles.packageRow} key={pkg.packageName}>
              <span className={styles.packageName}>{pkg.name}<code>{pkg.packageName}</code></span>
              <span className={styles.packageLicense}>{pkg.license}</span>
            </div>
          ))}
        </div>
        <p className={styles.sectionNote}>License identifiers above were checked against the installed direct runtime packages. Transitive packages may carry their own additional notices.</p>
      </ScrollReveal>

      <section className={styles.repositoryNotice} aria-labelledby="repository-notice-title">
        <div className={styles.noticeGlyph}><FileText size={19} aria-hidden="true" /></div>
        <div>
          <p className={styles.eyebrow}>REPOSITORY NOTICE</p>
          <h2 id="repository-notice-title">A separate MIT notice is included for shadcn.</h2>
          <p>The notice is stored at <code>docs/licenses/shadcn-MIT.txt</code>. It applies only to source covered by that notice; it does not change the licensing status of every UI Atlas example.</p>
        </div>
        <span className={styles.mitBadge}>MIT</span>
      </section>
    </div>
  );
}
