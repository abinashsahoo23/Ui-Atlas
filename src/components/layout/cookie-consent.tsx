"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { HoverScrambleTitle, ShimmerText } from "@/app/kinetic-text-effects";
import {
  readCookiePreferences,
  requestCookieSettings,
  saveCookiePreferences,
  subscribeToCookieSettingsRequests,
  type CookiePreferences,
} from "@/features/consent/lib/cookie-consent";
import styles from "./cookie-consent.module.css";

const ESSENTIAL_ONLY: CookiePreferences = { essential: true, functional: false, analytics: false };

export function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [functionalChoice, setFunctionalChoice] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    const savedPreferences = readCookiePreferences();
    setPreferences(savedPreferences);
    setFunctionalChoice(savedPreferences?.functional ?? false);
    setAnalyticsChoice(savedPreferences?.analytics ?? false);
    setIsVisible(savedPreferences === null);
    setIsReady(true);

    return subscribeToCookieSettingsRequests(() => {
      const currentPreferences = readCookiePreferences();
      setPreferences(currentPreferences);
      setFunctionalChoice(currentPreferences?.functional ?? false);
      setAnalyticsChoice(currentPreferences?.analytics ?? false);
      setSaveError(false);
      setIsManaging(true);
      setIsVisible(true);
    });
  }, []);

  function applyPreferences(nextPreferences: CookiePreferences) {
    setSaveError(false);
    if (!saveCookiePreferences(nextPreferences)) {
      setSaveError(true);
      return;
    }

    const saved = readCookiePreferences();
    setPreferences(saved);
    setIsVisible(false);
    setIsManaging(false);
  }

  function acceptAll() {
    applyPreferences({ essential: true, functional: true, analytics: true });
  }

  function rejectOptional() {
    applyPreferences(ESSENTIAL_ONLY);
  }

  function cancelPreferences() {
    if (readCookiePreferences()) {
      setIsVisible(false);
      setIsManaging(false);
      return;
    }
    setIsManaging(false);
  }

  if (!isReady || !isVisible) return null;

  return (
    <div className={styles.container}>
      <section
        className={styles.panel}
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        role="region"
      >
        <div className={styles.panelInner}>
          <div className={styles.intro}>
            <span className={styles.iconFrame} aria-hidden="true">
              <Cookie size={17} />
            </span>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>
                <ShimmerText speed="slow" theme="indigo">PRIVACY / YOUR CHOICE</ShimmerText>
              </p>
              <h2 id="cookie-consent-title" className={styles.title}>
                <HoverScrambleTitle text="Cookies, your call." />
              </h2>
              <p id="cookie-consent-description" className={styles.description}>
                One essential cookie remembers your choice. Functional storage keeps saved examples on this device. Analytics is optional and helps us understand how UI Atlas is used.
              </p>
            </div>
          </div>

          <div className={styles.actions} aria-label="Cookie consent choices">
            <button type="button" className={styles.acceptAll} onClick={acceptAll}>
              Accept all
            </button>
            <button type="button" className={styles.secondaryButton} onClick={rejectOptional}>
              Reject all
            </button>
            <button type="button" className={styles.secondaryButton} onClick={rejectOptional}>
              Accept essential only
            </button>
            <button
              type="button"
              className={styles.manageButton}
              onClick={() => {
                setFunctionalChoice(preferences?.functional ?? false);
                setAnalyticsChoice(preferences?.analytics ?? false);
                setIsManaging((current) => !current);
                setSaveError(false);
              }}
              aria-expanded={isManaging}
              aria-controls="cookie-preferences"
            >
              {isManaging ? "Hide preferences" : "Manage preferences"}
            </button>
          </div>

          {saveError && (
            <p className={styles.error} role="status">
              Your choice could not be saved in this browser. Please check its cookie settings and try again.
            </p>
          )}

          {isManaging && (
            <div className={styles.preferences} id="cookie-preferences">
              <div className={styles.preferenceRow}>
                <div>
                  <strong>Essential storage</strong>
                  <p>Remembers your privacy choice. Always on.</p>
                </div>
                <span className={styles.alwaysOn}>ALWAYS ON</span>
              </div>
              <label className={styles.preferenceRow} htmlFor="functional-storage">
                <span>
                  <strong>Functional storage</strong>
                  <p>Remembers the examples you save on this device.</p>
                </span>
                <input
                  id="functional-storage"
                  className={styles.checkbox}
                  type="checkbox"
                  checked={functionalChoice}
                  onChange={(event) => setFunctionalChoice(event.currentTarget.checked)}
                />
              </label>
              <label className={styles.preferenceRow} htmlFor="analytics-storage">
                <span>
                  <strong>Analytics</strong>
                  <p>Allows Google Analytics to measure site visits and feature interactions.</p>
                </span>
                <input
                  id="analytics-storage"
                  className={styles.checkbox}
                  type="checkbox"
                  checked={analyticsChoice}
                  onChange={(event) => setAnalyticsChoice(event.currentTarget.checked)}
                />
              </label>
              <p className={styles.note}>
                Turning functional storage off removes saved examples from this device. Analytics remains disabled unless you opt in.
              </p>

              <div className={styles.preferenceActions}>
                <button
                  type="button"
                  className={styles.acceptAll}
                  onClick={() => applyPreferences({
                    essential: true,
                    functional: functionalChoice,
                    analytics: analyticsChoice,
                  })}
                >
                  Save preferences
                </button>
                <button type="button" className={styles.secondaryButton} onClick={cancelPreferences}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function CookieSettingsTrigger() {
  return (
    <button
      className={styles.settingsTrigger}
      type="button"
      onClick={requestCookieSettings}
      aria-label="Open cookie settings"
    >
      Cookie settings
    </button>
  );
}
