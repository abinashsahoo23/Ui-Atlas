import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Search, X } from "lucide-react";
import { Suspense } from "react";
import { CatalogEntryCard } from "@/features/catalog/components/catalog-entry-card";
import { LibraryCategorySidebar } from "@/features/catalog/components/library-category-sidebar";
import { SortSelect } from "@/features/catalog/components/sort-select";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ShimmerText, WaveRippleHeading } from "@/app/kinetic-text-effects";
import {
  categoryDefinitions,
  getCategory,
  searchCatalogEntries,
} from "@/features/catalog/lib/catalog";
import styles from "../library.module.css";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ q?: string | string[]; sort?: string | string[] }>;
};

export function generateStaticParams() {
  return categoryDefinitions.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  return category ? { title: category.title } : {};
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <Suspense fallback={<p className={styles.loading} role="status">Loading category…</p>}>
      <CategoryContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryContent({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ q?: string | string[]; sort?: string | string[] }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = Array.isArray(resolvedSearchParams.q)
    ? resolvedSearchParams.q[0] ?? ""
    : resolvedSearchParams.q ?? "";
  const sort = Array.isArray(resolvedSearchParams.sort)
    ? resolvedSearchParams.sort[0] ?? "default"
    : resolvedSearchParams.sort ?? "default";

  const entries = searchCatalogEntries(query, {
    category: category.slug,
    sort,
  });

  const isFiltered = Boolean(query || (sort && sort !== "default"));

  return (
    <div className={styles.page}>
      <ScrollReveal as="header" className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/library">
              <ArrowLeft size={13} aria-hidden="true" /> LIBRARY
            </Link>{" "}
            / CATEGORY
          </p>
          <h1>
            <WaveRippleHeading text={category.title} periodChar="" />
            <span aria-hidden="true">.</span>
          </h1>
          <p className={styles.intro}>
            <ShimmerText speed="slow" theme="silver">{category.description}</ShimmerText>
          </p>
        </div>
        <p className={styles.headingNote}>
          <strong>{String(entries.length).padStart(2, "0")}</strong>
          <br />
          {entries.length === 1 ? "entry" : "entries"}
        </p>
      </ScrollReveal>

      <div className={styles.browseLayout}>
        <LibraryCategorySidebar activeSlug={category.slug} query={query} sort={sort} />

        <ScrollReveal as="section" className={styles.results} aria-labelledby="category-results-title">
          <div className={styles.toolbar}>
            <div>
              <p className={styles.sectionEyebrow}>COLLECTION / {category.slug.toUpperCase()}</p>
              <h2 id="category-results-title">
                <WaveRippleHeading text={query
                  ? `Search in ${category.title}`
                  : entries.length
                    ? "Studies in this category"
                    : "Space for the next study"} periodChar="" />
              </h2>
            </div>

            <div className={styles.searchControls}>
              <form action={`/library/${category.slug}`} className={styles.search} role="search">
                <Search size={17} aria-hidden="true" />
                <label className="sr-only" htmlFor="category-search">
                  Search within {category.title}
                </label>
                <input
                  id="category-search"
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder={`Search ${category.title}…`}
                />
                {sort !== "default" && <input type="hidden" name="sort" value={sort} />}
                <button type="submit">Search</button>
              </form>

              <form action={`/library/${category.slug}`} method="get">
                {query && <input type="hidden" name="q" value={query} />}
                <SortSelect defaultValue={sort} />
              </form>

              {isFiltered && (
                <Link
                  href={`/library/${category.slug}`}
                  className={styles.clearFilterLink}
                  aria-label="Clear active search in this category"
                >
                  <X size={13} aria-hidden="true" /> Clear search
                </Link>
              )}
            </div>
          </div>

          <p className={styles.resultCount}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
            {query ? ` matching “${query}” in ${category.title}` : ` in ${category.title}`}
            {sort === "alpha-asc" ? " (A–Z)" : sort === "alpha-desc" ? " (Z–A)" : ""}
          </p>

          {entries.length > 0 ? (
            <div className={styles.entryGrid}>
              {entries.map((entry, index) => (
                <CatalogEntryCard key={entry.id} item={entry} index={index} />
              ))}
            </div>
          ) : query ? (
            <div className={styles.empty}>
              <span aria-hidden="true">00</span>
              <div>
                <h3><WaveRippleHeading text={`No entries found in ${category.title}`} periodChar="" />.</h3>
                <p>No components in this category matched the current search.</p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                  <Link href={`/library/${category.slug}`}>
                    Clear search in {category.title} <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                  <Link href={`/library?q=${encodeURIComponent(query)}`}>
                    Search all categories <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.empty}>
              <span aria-hidden="true">
                {String(categoryDefinitions.indexOf(category) + 1).padStart(2, "0")}
              </span>
              <div>
                <h3><WaveRippleHeading text="This category is ready for examples" periodChar="" />.</h3>
                <p>When you add an original study or a clearly attributed reference, it will appear here.</p>
                <Link href="/library">
                  Back to the full index <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
