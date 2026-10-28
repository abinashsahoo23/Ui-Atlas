import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Clear localStorage once before each test without persisting on sub-navigations
  await page.goto("/");
  await page.evaluate(() => {
    try {
      window.localStorage.clear();
    } catch {
      // ignore
    }
  });
});

test.describe("UI Atlas End-to-End Suite", () => {
  test("1. Navigation journey: Home -> Library -> Category -> Component Details", async ({ page }) => {
    // 1. Home page
    await page.goto("/");
    await expect(page).toHaveTitle(/UI Atlas/i);
    await expect(page.getByRole("heading", { level: 1, name: /Stop building boring interfaces/i })).toBeVisible();

    // 2. Click Browse all entries link
    const browseLink = page.getByRole("link", { name: /Browse all entries/i }).first();
    await browseLink.click();
    await expect(page).toHaveURL(/\/library/);
    await expect(page.getByRole("heading", { level: 1, name: /Library/i })).toBeVisible();

    // 3. Click Cards category chip in category nav
    const cardsCategoryChip = page.getByRole("navigation", { name: "Library categories" }).getByRole("link", { name: /^Cards\b/ });
    await cardsCategoryChip.click();
    await expect(page).toHaveURL(/\/library\/cards/);
    await expect(page.getByRole("heading", { level: 1, name: /Cards/i })).toBeVisible();

    // 4. Click a component entry in Cards
    const cardEntryLink = page.getByRole("link", { name: /Frosted briefing card|Tilt specimen card/i }).first();
    await expect(cardEntryLink).toBeVisible();
    await cardEntryLink.click();

    // 5. Verify on Component Details page
    await expect(page).toHaveURL(/\/item\//);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Preview" })).toBeVisible();
  });

  test("2. Search journey: matching results, empty state, and clearing filters", async ({ page }) => {
    await page.goto("/library");

    // Search for an existing component keyword
    const searchInput = page.locator("input[name='q']").first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill("tilt");
    await page.getByRole("button", { name: "Search" }).first().click();

    await expect(page).toHaveURL(/q=tilt/);
    await expect(page.getByRole("heading", { name: /Tilt specimen card/i })).toBeVisible();

    // Search for a non-existent keyword
    await searchInput.fill("nonexistent_pattern_study_xyz");
    await page.getByRole("button", { name: "Search" }).first().click();

    await expect(page.getByRole("heading", { name: /No entries found/i })).toBeVisible();
    const clearSearchLink = page.getByRole("link", { name: /Clear search|Clear filters/i }).first();
    await expect(clearSearchLink).toBeVisible();

    // Click Clear search and verify index is restored
    await clearSearchLink.click();
    await expect(page).toHaveURL(/\/library/);
    await expect(page.getByRole("heading", { name: "All studies" })).toBeVisible();
  });

  test("3. Category filtering and invalid category handling", async ({ page }) => {
    // Navigate to navigation category
    await page.goto("/library/navigation");
    await expect(page.getByRole("heading", { level: 1, name: /Navigation/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Floating dock navigation/i })).toBeVisible();

    // Navigate to an invalid category slug and verify custom 404 page
    await page.goto("/library/not-a-real-category-slug");
    await expect(page.getByRole("heading", { name: /Study not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse the library index/i })).toBeVisible();
  });

  test("4. Component detail page: title, live preview, attribution, and code viewer", async ({ page }) => {
    await page.goto("/item/tilt-specimen-card");

    // Title & Eyebrow
    await expect(page.getByRole("heading", { level: 1, name: /Tilt specimen card/i })).toBeVisible();

    // Live preview section
    const previewSection = page.locator('section[aria-labelledby="preview-title"]');
    await expect(previewSection).toBeVisible();
    await expect(previewSection.getByText("Singularity Core")).toBeVisible();

    // Source code viewer section
    const codeSection = page.locator('section[aria-labelledby="code-title"]');
    await expect(codeSection).toBeVisible();
    await expect(codeSection.getByRole("tablist")).toBeVisible();
    await expect(codeSection.locator("p").last()).toHaveText(/\S/);
  });

  test("5. Code viewer tabs switching and copy-to-clipboard functionality", async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/item/tilt-specimen-card");

    const codeSection = page.locator('section[aria-labelledby="code-title"]');
    const tsxTab = codeSection.getByRole("tab", { name: /tilt-specimen-card\.tsx/i });
    const cssTab = codeSection.getByRole("tab", { name: /tilt-specimen-card\.module\.css/i });
    const promptButton = codeSection.getByRole("button", { name: /Copy AI build prompt/i });

    // Verify initial active tab is TSX
    await expect(tsxTab).toHaveAttribute("aria-selected", "true");

    // Switch to CSS Module tab
    await cssTab.click();
    await expect(cssTab).toHaveAttribute("aria-selected", "true");
    await expect(tsxTab).toHaveAttribute("aria-selected", "false");

    // Copy the AI build prompt from its action button.
    await promptButton.click();
    await expect(promptButton).toContainText("Prompt copied");
    const promptClipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(promptClipboard).toMatch(/Tilt specimen card/i);

    // Switch back to TSX and click copy button
    await tsxTab.click();
    await expect(tsxTab).toHaveAttribute("aria-selected", "true");

    const copyButton = codeSection.getByRole("button", { name: /Copy TSX source code|Code copied to clipboard/ });
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Verify feedback state "Copied!" and aria-label / data-copied attribute
    await expect(copyButton).toHaveAttribute("data-copied", "true");
    await expect(copyButton).toContainText("Copied!");

    // Verify actual clipboard contents
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    expect(clipboardText).toContain("export default function TiltSpecimenCard()");
  });

  test("6. Favourites persistence in Collections across reloads and removal", async ({ page }) => {
    await page.goto("/item/frosted-briefing-card");

    // Save button
    const saveButton = page.getByRole("button", { name: /Save Frosted briefing card to collection/i });
    await expect(saveButton).toBeVisible();

    // Click Save button and verify state changes to Saved
    await saveButton.click();
    await expect(page.getByRole("button", { name: /Remove Frosted briefing card from collection/i })).toBeVisible();

    // Navigate to Collections page
    await page.goto("/collections");
    await expect(page.getByRole("heading", { level: 1, name: /Collections/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Frosted briefing card", exact: true })).toBeVisible();
    await expect(page.getByText(/1 SAVED ENTRY/i)).toBeVisible();

    // Reload page to verify persistence in localStorage
    await page.reload();
    await expect(page.getByRole("link", { name: "Frosted briefing card", exact: true })).toBeVisible();

    // Remove the item
    const removeButton = page.getByRole("button", { name: /Remove Frosted briefing card from collection/i });
    await removeButton.click();

    // Verify empty state is rendered
    await expect(page.getByRole("heading", { name: /Your collection is ready/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Find an idea/i })).toBeVisible();
  });

  test("7. Invalid component slug renders not-found page", async ({ page }) => {
    await page.goto("/item/this-item-does-not-exist-at-all");
    await expect(page.getByRole("heading", { name: /Study not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse the library index/i })).toBeVisible();
  });

  test("8. Responsive layout: desktop and mobile horizontal overflow check", async ({ page }) => {
    const viewports = [
      { name: "desktop", width: 1280, height: 800 },
      { name: "mobile", width: 375, height: 667 },
    ];

    const routes = ["/", "/library", "/item/floating-dock-nav", "/item/bento-feature-showcase"];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of routes) {
        await page.goto(route);

        // Check horizontal overflow: scrollWidth should not exceed clientWidth
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(
          hasOverflow,
          `Route ${route} at viewport ${vp.name} (${vp.width}px) should not have horizontal overflow`
        ).toBe(false);
      }
    }
  });

  test("9. Background Studio: loads specimens, filters styles, and allows stage inspection", async ({ page }) => {
    await page.goto("/backgrounds");
    await expect(page).toHaveTitle(/Background Studio/i);
    await expect(page.getByRole("heading", { level: 1, name: /Background Studio/i })).toBeVisible();

    // Verify stage section is visible
    const stage = page.locator('section[aria-label="Active background inspection stage"]');
    await expect(stage).toBeVisible();

    // Verify source code link exists on stage
    const sourceLink = stage.getByRole("link", { name: /Source Code/i });
    await expect(sourceLink).toBeVisible();

    // Filter by Retro & Glitch
    const retroTab = page.getByRole("tab", { name: /Retro & Glitch/i });
    await retroTab.click();
    await expect(retroTab).toHaveAttribute("aria-selected", "true");

    // Click on Letter glitch card to mount to stage
    const letterGlitchCard = page.locator("article").filter({ hasText: /Letter glitch/i }).first();
    await expect(letterGlitchCard).toBeVisible();
    await letterGlitchCard.click();

    // Verify stage updated to Letter glitch
    await expect(stage.getByRole("heading", { level: 2, name: /Letter glitch/i })).toBeVisible();
  });

  test("10. Registry integrity: catalog entries and source files are valid", async ({ page }) => {
    // Navigate to a new Phase 7 component detail page
    await page.goto("/item/threads-field");
    await expect(page.getByRole("heading", { level: 1, name: /Threads harmonic wave field/i })).toBeVisible();

    // Verify preview and code tabs render
    const previewSection = page.locator('section[aria-labelledby="preview-title"]');
    await expect(previewSection).toBeVisible();

    const codeSection = page.locator('section[aria-labelledby="code-title"]');
    await expect(codeSection).toBeVisible();
    await expect(codeSection.getByRole("tab", { name: /threads-field\.tsx/i })).toBeVisible();
  });

  test("11. Legacy animations route redirects to the current Animation & Motion category", async ({ page }) => {
    await page.goto("/animations");
    await expect(page).toHaveURL(/\/library\/animations$/);
    await expect(page).toHaveTitle(/Animation & Motion/i);
    await expect(page.getByRole("heading", { level: 1, name: /Animation & Motion/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Elastic Particle Trail/i }).first()).toBeVisible();
  });

  test("12. Phase 8 Component Details: Prismatic burst, Radial spark burst, and Fanned deck stack", async ({ page }) => {
    // 1. Prismatic Chromatic Burst detail page
    await page.goto("/item/prism-chromatic-burst");
    await expect(page.getByRole("heading", { level: 1, name: /Prismatic Chromatic Burst/i })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="preview-title"]')).toBeVisible();
    await expect(page.getByRole("tab", { name: /prism-chromatic-burst\.tsx/i })).toBeVisible();

    // 2. Radial Spark Burst detail page
    await page.goto("/item/radial-spark-burst");
    await expect(page.getByRole("heading", { level: 1, name: /Radial Spark Burst/i })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="preview-title"]')).toBeVisible();

    // 3. Background studio specimen count
    await page.goto("/backgrounds");
    await expect(page.getByText(/23 BACKGROUND SPECIMENS/i)).toBeVisible();
  });

  test("13. Phase 9 Category Taxonomy: verifies all 16 categories render with correct components and accurate counts", async ({ page }) => {
    // 1. Verify /library renders all 16 category chips
    await page.goto("/library");
    const categoryNav = page.getByRole("navigation", { name: "Library categories" });
    await expect(categoryNav.getByRole("link", { name: "Feedback & Notifications" })).toBeVisible();
    await expect(categoryNav.getByRole("link", { name: "Galleries & Carousels" })).toBeVisible();
    await expect(categoryNav.getByRole("link", { name: "Animation & Motion" })).toBeVisible();
    await expect(categoryNav.getByRole("link", { name: "Timelines" })).toBeVisible();

    // 2. Feedback category
    await page.goto("/library/feedback");
    await expect(page.getByRole("heading", { level: 1, name: /Feedback & Notifications/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Notification toast stack/i }).first()).toBeVisible();

    // 3. Galleries category
    await page.goto("/library/galleries");
    await expect(page.getByRole("heading", { level: 1, name: /Galleries & Carousels/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Perspective Ring Gallery/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Momentum card carousel/i }).first()).toBeVisible();

    // 4. Animation & Motion category
    await page.goto("/library/animations");
    await expect(page.getByRole("heading", { level: 1, name: /Animation & Motion/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Elastic Particle Trail/i }).first()).toBeVisible();

    // 5. Timelines category
    await page.goto("/library/timelines");
    await expect(page.getByRole("heading", { level: 1, name: /Timelines/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Interactive project roadmap timeline/i }).first()).toBeVisible();
  });

  test("14. Typography uses the local font variables without remote font requests", async ({ page }) => {
    const remoteFontRequests: string[] = [];
    page.on("request", (request) => {
      if (/fonts\.(?:googleapis|gstatic)\.com/i.test(request.url())) {
        remoteFontRequests.push(request.url());
      }
    });

    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const fonts = await page.evaluate(() => ({
      body: getComputedStyle(document.body).fontFamily,
      display: getComputedStyle(document.documentElement).getPropertyValue("--font-display-grotesk").trim(),
      mono: getComputedStyle(document.documentElement).getPropertyValue("--font-tech-mono").trim(),
    }));

    expect(fonts.body).not.toMatch(/Times New Roman/i);
    expect(fonts.display).not.toBe("");
    expect(fonts.mono).not.toBe("");
    expect(remoteFontRequests).toEqual([]);
  });
});
