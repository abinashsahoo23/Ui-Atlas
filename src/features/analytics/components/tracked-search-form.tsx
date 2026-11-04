"use client";

import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { trackAnalyticsEvent } from "@/features/analytics/lib/analytics";

export function TrackedSearchForm({
  action,
  className,
  searchSurface,
  children,
}: {
  action: string;
  className?: string;
  searchSurface: string;
  children: ReactNode;
}) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get("q");
    const query = typeof searchValue === "string" ? searchValue.trim() : "";

    if (query) {
      trackAnalyticsEvent("component_search", {
        search_surface: searchSurface,
        search_length: Math.min(query.length, 200),
      });
    }

    const destination = new URL(action, window.location.origin);
    const parameters = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === "string") parameters.append(key, value);
    });
    const queryString = parameters.toString();
    router.push(`${destination.pathname}${queryString ? `?${queryString}` : ""}`);
  }

  return (
    <form
      action={action}
      method="get"
      className={className}
      role="search"
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}
