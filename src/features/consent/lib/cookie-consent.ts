export type CookiePreferences = {
  essential: true;
  functional: boolean;
  analytics: boolean;
};

export type CookiePreferenceCategory = keyof CookiePreferences;

const CONSENT_COOKIE_NAME = "ui-atlas-consent";
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const CONSENT_CHANGED_EVENT = "ui-atlas:cookie-consent-changed";
const COOKIE_SETTINGS_REQUEST_EVENT = "ui-atlas:cookie-settings-request";

function getConsentCookieValue(): string | null {
  if (typeof document === "undefined") return null;

  try {
    const prefix = CONSENT_COOKIE_NAME + "=";
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix));
    return cookie ? cookie.slice(prefix.length) : null;
  } catch {
    return null;
  }
}

export function readCookiePreferences(): CookiePreferences | null {
  const value = getConsentCookieValue();
  if (!value) return null;

  if (value === "v3.f1.a1") return { essential: true, functional: true, analytics: true };
  if (value === "v3.f1.a0") return { essential: true, functional: true, analytics: false };
  if (value === "v3.f0.a1") return { essential: true, functional: false, analytics: true };
  if (value === "v3.f0.a0") return { essential: true, functional: false, analytics: false };

  // Previous versions did not request analytics consent, so keep it disabled.
  if (value === "v2.f1" || value === "v1.all") {
    return { essential: true, functional: true, analytics: false };
  }
  if (value === "v2.f0" || value === "v1.reject-all" || value === "v1.essential-only") {
    return { essential: true, functional: false, analytics: false };
  }

  return null;
}

export function hasCookieConsent(category: CookiePreferenceCategory): boolean {
  if (category === "essential") return true;
  return readCookiePreferences()?.[category] === true;
}

export function saveCookiePreferences(preferences: CookiePreferences): boolean {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }

  const normalized: CookiePreferences = {
    essential: true,
    functional: preferences.functional === true,
    analytics: preferences.analytics === true,
  };

  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      CONSENT_COOKIE_NAME +
      "=v3.f" +
      (normalized.functional ? "1" : "0") +
      ".a" +
      (normalized.analytics ? "1" : "0") +
      "; Max-Age=" +
      CONSENT_MAX_AGE_SECONDS +
      "; Path=/; SameSite=Lax" +
      secure;

    if (normalized.functional) {
      if (!hasCookieConsent("functional")) return false;
    } else {
      // A clear choice must discard previously stored optional data.
      try {
        window.localStorage.removeItem("ui-atlas:saved-entry-ids:v1");
      } catch {
        // Browser storage can be disabled independently of cookies.
      }
      if (readCookiePreferences()?.functional !== false) return false;
    }

    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, { detail: normalized }),
    );
    return true;
  } catch {
    return false;
  }
}

export function subscribeToCookieConsentChanges(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_CHANGED_EVENT, listener);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, listener);
}

export function requestCookieSettings(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_REQUEST_EVENT));
  }
}

export function subscribeToCookieSettingsRequests(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COOKIE_SETTINGS_REQUEST_EVENT, listener);
  return () => window.removeEventListener(COOKIE_SETTINGS_REQUEST_EVENT, listener);
}
