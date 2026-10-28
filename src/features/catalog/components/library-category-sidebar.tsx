import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { catalogEntries } from "../data/catalog";
import { categoryDefinitions } from "../data/categories";
import { LibrarySidebarViewportGuard } from "./library-sidebar-viewport-guard";
import styles from "./library-category-sidebar.module.css";

type LibraryCategorySidebarProps = {
  activeSlug: string;
  query: string;
  sort: string;
};

function buildLibraryHref(path: string, query: string, sort: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (sort && sort !== "default") params.set("sort", sort);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

export function LibraryCategorySidebar({
  activeSlug,
  query,
  sort,
}: LibraryCategorySidebarProps) {
  const currentLocation = categoryDefinitions.find((category) => category.slug === activeSlug)?.title ?? "All studies";

  return (
    <LibrarySidebarViewportGuard>
      <div className={styles.desktopPanel}>
        <CategoryLinks activeSlug={activeSlug} query={query} sort={sort} />
      </div>

      <details className={styles.mobileDrawer}>
        <summary className={styles.summary}>
          <span className={styles.drawerGlyph} aria-hidden="true"><span /><span /><span /><span /></span>
          <span className={styles.summaryText}>{currentLocation}</span>
          <ChevronDown className={styles.chevron} size={15} aria-hidden="true" />
        </summary>
        <CategoryLinks activeSlug={activeSlug} query={query} sort={sort} />
      </details>
    </LibrarySidebarViewportGuard>
  );
}

function CategoryLinks({ activeSlug, query, sort }: LibraryCategorySidebarProps) {
  const currentLocation = categoryDefinitions.find((category) => category.slug === activeSlug)?.title ?? "All studies";

  return (
    <div className={styles.panel}>
      <header className={styles.panelHeader}>
        <h2>{currentLocation}</h2>
      </header>

      <nav aria-label="Library categories">
        <ul className={styles.linkList}>
          <li>
            <Link
              className={`${styles.link} ${styles.allLink} ${!activeSlug ? styles.active : ""}`}
              href={buildLibraryHref("/library", query, sort)}
              aria-current={!activeSlug ? "page" : undefined}
            >
              <span className={styles.title}>All studies</span>
              <span className={styles.count}>{String(catalogEntries.length).padStart(2, "0")}</span>
            </Link>
          </li>
          {categoryDefinitions.map((category) => {
            const count = catalogEntries.filter((entry) => entry.category === category.slug).length;
            const isActive = activeSlug === category.slug;

            return (
              <li key={category.slug}>
                <Link
                  className={`${styles.link} ${isActive ? styles.active : ""}`}
                  href={buildLibraryHref(`/library/${category.slug}`, query, sort)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={styles.title}>{category.title}</span>
                  <span className={styles.count}>{String(count).padStart(2, "0")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
