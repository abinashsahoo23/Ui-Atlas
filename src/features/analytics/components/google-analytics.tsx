"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  getSafeCurrentPageUrl,
  getSafeReferrer,
  syncGoogleConsent,
  trackAnalyticsEvent,
  trackPageView,
} from "@/features/analytics/lib/analytics";
import {
  readCookiePreferences,
  subscribeToCookieConsentChanges,
} from "@/features/consent/lib/cookie-consent";

function RouteAnalytics({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const lastRouteKey = useRef<string | null>(null);
  const lastPathname = useRef<string | null>(null);
  const lastPageLocation = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      lastRouteKey.current = null;
      lastPathname.current = null;
      lastPageLocation.current = null;
      return;
    }

    const routeKey = `${pathname}?${searchKey}`;
    if (lastRouteKey.current === routeKey) return;

    const pageLocation = getSafeCurrentPageUrl(pathname);
    const pageReferrer = lastPageLocation.current ?? getSafeReferrer();
    trackPageView(document.title, pageLocation, pageReferrer);

    if (lastPathname.current !== pathname) {
      const itemMatch = pathname.match(/^\/item\/([^/]+)\/?$/);
      if (itemMatch) {
        trackAnalyticsEvent("component_view", {
          component_slug: decodeURIComponent(itemMatch[1]),
        });
      }

      const categoryMatch = pathname.match(/^\/library\/([^/]+)\/?$/);
      if (categoryMatch) {
        trackAnalyticsEvent("category_select", {
          category_slug: decodeURIComponent(categoryMatch[1]),
        });
      }

      if (pathname === "/backgrounds") {
        trackAnalyticsEvent("background_studio_view");
      }
    }

    lastRouteKey.current = routeKey;
    lastPathname.current = pathname;
    lastPageLocation.current = pageLocation;
  }, [enabled, pathname, searchKey]);

  return null;
}

export function GoogleAnalytics() {
  const [analyticsGranted, setAnalyticsGranted] = useState(false);
  const [loadTag, setLoadTag] = useState(false);

  useEffect(() => {
    const sync = () => {
      const granted = syncGoogleConsent(readCookiePreferences());
      setAnalyticsGranted(granted);
      if (granted) setLoadTag(true);
    };

    sync();
    return subscribeToCookieConsentChanges(sync);
  }, []);

  return (
    <>
      {loadTag && (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}
      <Suspense fallback={null}>
        <RouteAnalytics enabled={analyticsGranted} />
      </Suspense>
    </>
  );
}
