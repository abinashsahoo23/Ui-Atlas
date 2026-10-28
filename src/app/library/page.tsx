import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Suspense } from "react";
import { CatalogEntryCard } from "@/features/catalog/components/catalog-entry-card";
import { LibraryCategorySidebar } from "@/features/catalog/components/library-category-sidebar";
import { SortSelect } from "@/features/catalog/components/sort-select";
import { searchCatalogEntries } from "@/features/catalog/lib/catalog";
import { catalogEntries } from "@/features/catalog/data/catalog";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import styles from "./library.module.css";

export const metadata: Metadata = { title: "Library" };

type SearchParams = Promise<{
  q?: string | string[];
  sort?: string | string[];
  category?: string | string[];
}>;

export default function LibraryPage({ searchParams }: { searchParams: SearchParams }) {
  const totalCount = catalogEntries.length;

  return (
    <div className={styles.page}>
      <ScrollReveal as="header" className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>THE INDEX / VOL. 01</p>
          <h1>
            <WaveRippleHeading text="Library" periodChar="" />
            <span aria-hidden="true">.</span>
          </h1>
          <p className={styles.intro}>
            <ShimmerText speed="slow" theme="silver">
              Browse original interface studies, each with a live preview and notes for adapting the idea.
            </ShimmerText>
          </p>
        </div>
        <p className={styles.headingNote}>
          <strong>01—{String(totalCount).padStart(2, "0")}</strong>
          <br />
          {totalCount} studies in total
        </p>
      </ScrollReveal>

      <Suspense fallback={<p className={styles.loading} role="status">Loading the index…</p>}>
        <LibraryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LibraryContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const sort = Array.isArray(params.sort) ? params.sort[0] ?? "default" : params.sort ?? "default";
  const activeCategory = Array.isArray(params.category)
    ? params.category[0] ?? ""
    : params.category ?? "";

  const entries = searchCatalogEntries(query, {
    category: activeCategory || undefined,
    sort,
  });

  const isFiltered = Boolean(query || activeCategory || (sort && sort !== "default"));

  return (
    <div className={styles.browseLayout}>
      <LibraryCategorySidebar activeSlug={activeCategory} query={query} sort={sort} />

      <ScrollReveal as="section" className={styles.results} aria-labelledby="results-title">
        <div className={styles.toolbar}>
          <div>
            <p className={styles.sectionEyebrow}>SEARCHABLE REFERENCES</p>
            <h2 id="results-title">
              <WaveRippleHeading text={query ? "Search results" : "All studies"} periodChar="" />
            </h2>
          </div>

          <div className={styles.searchControls}>
            <form action="/library" className={styles.search} role="search">
              <Search size={17} aria-hidden="true" />
              <label className="sr-only" htmlFor="library-search">
                Search the library
              </label>
              <input
                id="library-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search title, style, or tag"
              />
              {sort !== "default" && <input type="hidden" name="sort" value={sort} />}
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              <button type="submit">Search</button>
            </form>

            <form action="/library" method="get">
              {query && <input type="hidden" name="q" value={query} />}
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              <SortSelect defaultValue={sort} />
            </form>

            {isFiltered && (
              <Link href="/library" className={styles.clearFilterLink} aria-label="Clear active filters">
                <X size={13} aria-hidden="true" /> Clear filters
              </Link>
            )}
          </div>
        </div>

        <p className={styles.resultCount}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
          {query ? ` matching “${query}”` : " in the index"}
          {activeCategory ? ` in ${activeCategory}` : ""}
          {sort === "alpha-asc" ? " (A–Z)" : sort === "alpha-desc" ? " (Z–A)" : ""}
        </p>

        {entries.length > 0 ? (
          <div className={styles.entryGrid}>
            {entries.map((entry, index) => (
              <CatalogEntryCard key={entry.id} item={entry} index={index} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span aria-hidden="true">00</span>
            <div>
              <h3><WaveRippleHeading text="No entries found" periodChar="" /></h3>
              <p>
                {query
                  ? `No components matched “${query}”. Try another keyword or clear search.`
                  : "No components found with the current filter."}
              </p>
              <div className={styles.emptyActions}>
                <Link href="/library" className={styles.emptyClearBtn}>
                  Clear search <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <div className={styles.emptySuggestions}>
                  <span>Suggested keywords:</span>
                  <Link href="/library?q=dock">dock</Link>
                  <Link href="/library?q=tilt">tilt</Link>
                  <Link href="/library?q=bento">bento</Link>
                  <Link href="/library?q=pricing">pricing</Link>
                  <Link href="/library?q=glass">glass</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
