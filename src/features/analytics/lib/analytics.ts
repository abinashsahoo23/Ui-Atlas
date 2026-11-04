import {
  hasCookieConsent,
  type CookiePreferences,
} from "@/features/consent/lib/cookie-consent";

export const GA_MEASUREMENT_ID = "G-YTLXRV3YKD";

type AnalyticsValue = string | number | boolean;
type GoogleTagWindow = Window & {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
  __uiAtlasConsentDefaultsSet?: boolean;
  __uiAtlasGoogleTagConfigured?: boolean;
};

function getGoogleTagWindow(): GoogleTagWindow | null {
  if (typeof window === "undefined") return null;

  const tagWindow = window as GoogleTagWindow;
  tagWindow.dataLayer ??= [];
  tagWindow.gtag ??= (...args: unknown[]) => {
    tagWindow.dataLayer?.push(args);
  };
  return tagWindow;
}

function getConsentValues(preferences: CookiePreferences | null) {
  return {
    analytics_storage: preferences?.analytics ? "granted" : "denied",
    functionality_storage: preferences?.functional ? "granted" : "denied",
    security_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  } as const;
}

function getSafePageUrl(value: string): string {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export function syncGoogleConsent(preferences: CookiePreferences | null): boolean {
  const tagWindow = getGoogleTagWindow();
  if (!tagWindow?.gtag) return false;

  if (!tagWindow.__uiAtlasConsentDefaultsSet) {
    tagWindow.gtag("consent", "default", {
      analytics_storage: "denied",
      functionality_storage: "denied",
      security_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    tagWindow.__uiAtlasConsentDefaultsSet = true;
  }

  const analyticsGranted = preferences?.analytics === true;
  tagWindow.gtag("consent", "update", getConsentValues(preferences));

  if (analyticsGranted && !tagWindow.__uiAtlasGoogleTagConfigured) {
    tagWindow.gtag("js", new Date());
    tagWindow.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    tagWindow.__uiAtlasGoogleTagConfigured = true;
  }

  return analyticsGranted;
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, AnalyticsValue> = {},
): boolean {
  if (!hasCookieConsent("analytics")) return false;
  const tagWindow = getGoogleTagWindow();
  if (!tagWindow?.gtag || !tagWindow.__uiAtlasGoogleTagConfigured) return false;

  const safePageLocation = getSafePageUrl(window.location.href);
  tagWindow.gtag("event", eventName, {
    ...parameters,
    page_title: document.title,
    page_location: safePageLocation,
  });
  return true;
}

export function trackPageView(
  pageTitle: string,
  pageLocation: string,
  pageReferrer: string,
) {
  trackAnalyticsEvent("page_view", {
    page_title: pageTitle,
    page_location: getSafePageUrl(pageLocation),
    page_referrer: getSafePageUrl(pageReferrer),
  });
}

export function getSafeCurrentPageUrl(pathname: string): string {
  if (typeof window === "undefined") return pathname;
  return getSafePageUrl(new URL(pathname, window.location.origin).toString());
}

export function getSafeReferrer(): string {
  if (typeof document === "undefined") return "";
  return document.referrer ? getSafePageUrl(document.referrer) : "";
}
