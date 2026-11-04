import { test, expect, type Page } from "@playwright/test";

type DataLayerCommand = unknown[];

async function getDataLayer(page: Page): Promise<DataLayerCommand[]> {
  return page.evaluate(() => {
    const dataLayer = (window as Window & { dataLayer?: unknown[][] }).dataLayer ?? [];
    return dataLayer.map((command) => Array.from(command));
  });
}

function countEvent(commands: DataLayerCommand[], eventName: string) {
  return commands.filter((command) => command[0] === "event" && command[1] === eventName).length;
}

test("GA4 is consent-gated, tracks page views and UI actions once, and persists preference changes", async ({ page }) => {
  test.setTimeout(90000);

  let googleTagRequests = 0;
  page.on("request", (request) => {
    if (request.url().startsWith("https://www.googletagmanager.com/gtag/js")) {
      googleTagRequests += 1;
    }
  });
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );

  await page.goto("/");
  await expect.poll(async () => (await getDataLayer(page)).some(
    (command) => command[0] === "consent" && command[1] === "default",
  )).toBe(true);
  expect(googleTagRequests).toBe(0);

  await page.getByRole("button", { name: "Accept essential only", exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f0.a0");
  expect(googleTagRequests).toBe(0);

  await page.getByRole("button", { name: "Open cookie settings" }).click();
  await page.getByRole("checkbox", { name: /^Functional storage/ }).check();
  await page.getByRole("checkbox", { name: /^Analytics/ }).check();
  await page.getByRole("button", { name: "Save preferences", exact: true }).click();

  await expect.poll(() => googleTagRequests).toBe(1);
  await expect.poll(async () => (await getDataLayer(page)).some(
    (command) => command[0] === "config" && command[1] === "G-YTLXRV3YKD",
  )).toBe(true);
  await expect.poll(async () => countEvent(await getDataLayer(page), "page_view")).toBe(1);
  const consentCommands = await getDataLayer(page);
  expect(consentCommands).toContainEqual([
    "consent",
    "default",
    expect.objectContaining({ analytics_storage: "denied", ad_user_data: "denied" }),
  ]);
  expect(consentCommands).toContainEqual([
    "consent",
    "update",
    expect.objectContaining({ analytics_storage: "granted", ad_personalization: "denied" }),
  ]);

  await page.locator("#home-search").fill("test@example.com");
  await page.locator("#home-search").press("Enter");
  await expect(page).toHaveURL(/\/library\?q=test%40example\.com$/);
  await expect.poll(async () => countEvent(await getDataLayer(page), "page_view")).toBe(2);
  const searchCommands = (await getDataLayer(page)).filter(
    (command) => command[0] === "event" && command[1] === "component_search",
  );
  expect(searchCommands).toHaveLength(1);
  expect(searchCommands[0][2]).toEqual(expect.objectContaining({ search_surface: "home", search_length: 16 }));
  expect(JSON.stringify(searchCommands)).not.toContain("test@example.com");
  const pageViewCommands = (await getDataLayer(page)).filter(
    (command) => command[0] === "event" && command[1] === "page_view",
  );
  expect(JSON.stringify(pageViewCommands)).not.toContain("test@example.com");

  await page.getByLabel("Sort entries").selectOption("alpha-asc");
  await expect.poll(async () => countEvent(await getDataLayer(page), "filter_select")).toBe(1);
  await expect.poll(async () => countEvent(await getDataLayer(page), "page_view")).toBe(3);

  await page.goto("/library/cards");
  await expect.poll(async () => countEvent(await getDataLayer(page), "category_select")).toBe(1);
  await expect.poll(async () => countEvent(await getDataLayer(page), "page_view")).toBe(1);

  await page.goto("/item/frosted-briefing-card");
  await expect.poll(async () => countEvent(await getDataLayer(page), "component_view")).toBe(1);
  await page.getByRole("button", { name: "Copy TSX source code" }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "react_code_copy")).toBe(1);
  await page.getByRole("button", { name: "Copy AI build prompt" }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "ai_prompt_copy")).toBe(1);
  await page.getByRole("button", { name: /Save Frosted briefing card to collection/i }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "collection_add")).toBe(1);

  await page.getByRole("link", { name: "Collections", exact: true }).first().click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "navigation_click")).toBe(1);
  await page.getByRole("button", { name: /Remove Frosted briefing card from collection/i }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "collection_remove")).toBe(1);

  await page.goto("/backgrounds");
  await expect.poll(async () => countEvent(await getDataLayer(page), "background_studio_view")).toBe(1);
  await page.getByRole("searchbox", { name: "Filter background specimens" }).fill("fluid");
  await page.getByRole("searchbox", { name: "Filter background specimens" }).press("Enter");
  await expect.poll(async () => countEvent(await getDataLayer(page), "background_studio_search")).toBe(1);
  await page.getByRole("tab", { name: "Fluid & Waves" }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "background_studio_filter_select")).toBe(1);
  await page.getByRole("button", { name: /Show .* in the inspection stage/ }).first().click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "background_studio_stage_select")).toBe(1);
  await page.getByRole("button", { name: "Expand stage" }).click();
  await expect.poll(async () => countEvent(await getDataLayer(page), "background_studio_fullscreen_toggle")).toBe(1);
  await page.getByRole("button", { name: "Exit expanded stage" }).click();

  await page.getByRole("link", { name: "Library", exact: true }).first().click();
  await expect(page).toHaveURL(/\/library$/);
  await expect.poll(async () => countEvent(await getDataLayer(page), "navigation_click")).toBe(1);

  await page.reload();
  await expect(page.getByRole("heading", { name: "Cookies, your call." })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f1.a1");
  await expect.poll(async () => countEvent(await getDataLayer(page), "page_view")).toBe(1);

  await page.getByRole("button", { name: "Open cookie settings" }).click();
  await page.getByRole("checkbox", { name: /^Analytics/ }).uncheck();
  await page.getByRole("button", { name: "Save preferences", exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.cookie)).toContain("ui-atlas-consent=v3.f1.a0");
  await expect.poll(async () => (await getDataLayer(page)).some(
    (command) => command[0] === "consent" && command[1] === "update" &&
      (command[2] as { analytics_storage?: string }).analytics_storage === "denied",
  )).toBe(true);

  const eventsAfterRevocation = await getDataLayer(page);
  await page.getByRole("link", { name: "Backgrounds", exact: true }).first().click();
  await expect(page).toHaveURL(/\/backgrounds$/);
  expect(await getDataLayer(page)).toEqual(eventsAfterRevocation);
});
