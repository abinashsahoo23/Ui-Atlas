import fs from "node:fs";
import path from "node:path";
import { catalogEntries } from "@/features/catalog/data/catalog";

export type ExampleSourceFiles = {
  previewKey: string;
  category: string;
  tsx: string;
  css: string;
  hasCss: boolean;
};

/**
 * Reads the actual source code of a registered example directly from disk.
 * Runs in Server Components / static generation at build or request time.
 */
export function getExampleSource(previewKey: string): ExampleSourceFiles | null {
  const entry = catalogEntries.find((candidate) => candidate.previewKey === previewKey);
  if (!entry) {
    return null;
  }

  const examplesRoot = path.join(process.cwd(), "src", "registry", "examples");
  const sourceDirectory = fs
    .readdirSync(examplesRoot, { withFileTypes: true })
    .find(
      (directory) =>
        directory.isDirectory() &&
        fs.existsSync(path.join(examplesRoot, directory.name, `${entry.previewKey}.tsx`))
    );

  if (!sourceDirectory) {
    return null;
  }

  const examplesDir = path.join(examplesRoot, sourceDirectory.name);
  const tsxPath = path.join(examplesDir, `${entry.previewKey}.tsx`);
  const cssPath = path.join(examplesDir, `${entry.previewKey}.module.css`);

  let tsx = "";
  let css = "";
  let hasCss = false;

  try {
    if (fs.existsSync(tsxPath)) {
      tsx = fs.readFileSync(tsxPath, "utf-8");
    }
  } catch (error) {
    console.error(`Failed to read TSX for ${previewKey}:`, error);
  }

  try {
    if (fs.existsSync(cssPath)) {
      css = fs.readFileSync(cssPath, "utf-8");
      hasCss = true;
    }
  } catch (error) {
    console.error(`Failed to read CSS for ${previewKey}:`, error);
  }

  return {
    previewKey: entry.previewKey,
    category: entry.category,
    tsx,
    css,
    hasCss,
  };
}
