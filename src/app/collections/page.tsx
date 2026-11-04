import { SavedCollection } from "@/features/collections/components/saved-collection";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./collections.module.css";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Collections",
  description: "View component studies saved locally in this browser.",
  path: "/collections",
  robots: { index: false, follow: false },
});

export default function CollectionsPage() {
  return (
    <div className={styles.page}>
      <ScrollReveal as="header" className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>YOUR LOCAL INDEX</p>
          <h1><WaveRippleHeading text="Collections" periodChar="" /><span aria-hidden="true">.</span></h1>
          <p className={styles.intro}>
            <ShimmerText speed="slow" theme="silver">
              A quiet place for the patterns you want to keep close. Saved entries stay in this browser.
            </ShimmerText>
          </p>
        </div>
        <span className={styles.storageLabel}><span aria-hidden="true" /> STORED ON THIS DEVICE</span>
      </ScrollReveal>
      <ScrollReveal className={styles.collectionReveal}>
        <SavedCollection entries={catalogEntries} />
      </ScrollReveal>
    </div>
  );
}
