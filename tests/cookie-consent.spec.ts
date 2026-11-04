import { test, expect } from "@playwright/test";

const CONSENT_COOKIE = "ui-atlas-consent";
const SAVED_IDS_KEY = "ui-atlas:saved-entry-ids:v1";

async function clearConsentState(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(({ consentCookie, savedIdsKey }) => {
    window.localStorage.removeItem(savedIdsKey);
    document.cookie = consentCookie + "=; Max-Age=0; Path=/";
  }, { consentCookie: CONSENT_COOKIE, savedIdsKey: SAVED_IDS_KEY });
  await page.reload();
}

async function expectNoConsentBanner(page: import("@playwright/test").Page) {
  await expect(page.getByRole("heading", { name: "Cookies, your call." })).toHaveCount(0);
}

test.describe("Cookie consent", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://www.googletagmanager.com/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
    );
  });

  test("shows a full-width banner and Manage Preferences can grant functional storage", async ({ page }) => {
    await clearConsentState(page);

    const banner = page.getByRole("region", { name: /cookies, your call/i });
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("button", { name: "Accept all", exact: true })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Reject all", exact: true })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Accept essential only", exact: true })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Manage preferences", exact: true })).toBeVisible();
    await expect(banner).toContainText("Analytics is optional");

    const geometry = await banner.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, width: rect.width, viewportWidth: window.innerWidth };
    });
    expect(geometry.left).toBe(0);
    expect(geometry.width).toBe(geometry.viewportWidth);

    await page.setViewportSize({ width: 375, height: 667 });
    const mobileGeometry = await banner.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, bottom: rect.bottom, height: rect.height, width: rect.width };
    });
    const mobileNavigation = await page.getByRole("navigation", { name: "Quick sections" }).boundingBox();
    expect(mobileGeometry.left).toBe(0);
    expect(mobileGeometry.width).toBe(375);
    expect(mobileGeometry.height).toBeLessThan(300);
    expect(mobileNavigation).not.toBeNull();
    expect(mobileGeometry.bottom).toBeLessThanOrEqual(mobileNavigation!.y);
    await page.setViewportSize({ width: 1280, height: 720 });

    await banner.getByRole("button", { name: "Manage preferences", exact: true }).click();
    const functionalStorage = page.getByRole("checkbox", { name: /functional storage/i });
    await expect(functionalStorage).not.toBeChecked();
    await functionalStorage.check();
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();

    await expectNoConsentBanner(page);
    await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f1.a0");

    await page.goto("/item/frosted-briefing-card");
    await page.getByRole("button", { name: /Save Frosted briefing card to collection/i }).click();
    await expect(page.getByRole("button", { name: /Remove Frosted briefing card from collection/i })).toBeVisible();
    const savedValue = await page.evaluate((key) => window.localStorage.getItem(key), SAVED_IDS_KEY);
    expect(savedValue).toContain("atlas-frosted-card-001");
  });

  test("Accept all persists on reload and a returning page, and enables saved examples", async ({ page, context }) => {
    await clearConsentState(page);
    await page.getByRole("button", { name: "Accept all", exact: true }).click();
    await expectNoConsentBanner(page);
    await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f1.a1");

    await page.reload();
    await expectNoConsentBanner(page);
    const returningPage = await context.newPage();
    await returningPage.goto("/collections");
    await expectNoConsentBanner(returningPage);
    await expect(returningPage.getByRole("heading", { name: /Your collection is ready/i })).toBeVisible();

    await page.goto("/item/frosted-briefing-card");
    await page.getByRole("button", { name: /Save Frosted briefing card to collection/i }).click();
    await expect(page.getByRole("button", { name: /Remove Frosted briefing card from collection/i })).toBeVisible();
  });

  test("Reject all blocks optional storage and saving asks for consent", async ({ page }) => {
    await clearConsentState(page);
    await page.getByRole("button", { name: "Reject all", exact: true }).click();
    await expectNoConsentBanner(page);
    await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f0.a0");

    await page.goto("/item/frosted-briefing-card");
    await page.getByRole("button", { name: /Save Frosted briefing card to collection/i }).click();
    await expect(page.getByRole("checkbox", { name: /functional storage/i })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /functional storage/i })).not.toBeChecked();
    expect(await page.evaluate((key) => window.localStorage.getItem(key), SAVED_IDS_KEY)).toBeNull();
  });

  test("Accept essential only remembers the choice without enabling saved-example storage", async ({ page }) => {
    await clearConsentState(page);
    await page.getByRole("button", { name: "Accept essential only", exact: true }).click();
    await expectNoConsentBanner(page);
    await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f0.a0");

    await page.reload();
    await expectNoConsentBanner(page);
    await page.getByRole("button", { name: "Open cookie settings" }).click();
    await expect(page.getByRole("checkbox", { name: /functional storage/i })).not.toBeChecked();
  });

  test("turning functional storage off clears saved examples and persists the new choice", async ({ page }) => {
    await clearConsentState(page);
    await page.getByRole("button", { name: "Accept all", exact: true }).click();
    await page.goto("/item/frosted-briefing-card");
    await page.getByRole("button", { name: /Save Frosted briefing card to collection/i }).click();
    await expect(page.getByRole("button", { name: /Remove Frosted briefing card from collection/i })).toBeVisible();

    await page.getByRole("button", { name: "Open cookie settings" }).click();
    const functionalStorage = page.getByRole("checkbox", { name: /functional storage/i });
    await expect(functionalStorage).toBeChecked();
    await functionalStorage.uncheck();
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();

    await expectNoConsentBanner(page);
    await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f0.a1");
    expect(await page.evaluate((key) => window.localStorage.getItem(key), SAVED_IDS_KEY)).toBeNull();

    await page.goto("/collections");
    await expect(page.getByRole("heading", { name: /Your collection is ready/i })).toBeVisible();
    await page.reload();
    await expectNoConsentBanner(page);

    await page.getByRole("button", { name: "Open cookie settings" }).click();
    await expect(page.getByRole("checkbox", { name: /functional storage/i })).not.toBeChecked();
  });
});
