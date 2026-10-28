import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import styles from "./not-found.module.css";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <ScrollReveal className={styles.card}>
        <div className={styles.badge}>
          <Compass size={14} aria-hidden="true" />
          <span>ERROR 404 / UNKNOWN REFERENCE</span>
        </div>
        <h1 className={styles.title}>
          <WaveRippleHeading text="Study not found" periodChar="" />
          <span aria-hidden="true">.</span>
        </h1>
        <p className={styles.intro}>
          <ShimmerText speed="slow" theme="silver">
            The study, component slug, or category you requested is not indexed in this edition of UI Atlas.
          </ShimmerText>
        </p>
        <div className={styles.actions}>
          <Link href="/library" className={styles.primaryLink}>
            <ArrowLeft size={14} aria-hidden="true" /> Browse the library index
          </Link>
          <Link href="/" className={styles.secondaryLink}>
            Return home
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
