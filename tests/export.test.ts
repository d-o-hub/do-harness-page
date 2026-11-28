/// <reference types="bun-types" />
import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

/* Smoke gate over the static export in out/ (produced by
   `bun run build:pages`). These checks verify the artifact GitHub Pages
   serves, not the source: basePath-pinned asset URLs, SEO files, the
   branded 404, and the fail-closed data-release-version marker. */

const PAGES_ORIGIN = "https://d-o-hub.github.io/do-harness-page";

function readOut(path: string): string {
  return readFileSync(`out/${path}`, "utf8");
}

describe("static export", () => {
  test("index.html exists and is branded", () => {
    const html = readOut("index.html");
    expect(html).toContain("do-harness");
    expect(html).toContain('href="/do-harness-page/_next/');
  });

  test("index.html leaks no localhost URLs", () => {
    const html = readOut("index.html");
    expect(html).not.toContain("http://localhost:3000");
  });

  test("data-release-version marker, when rendered, is a version tag", () => {
    const html = readOut("index.html");
    const match = html.match(/data-release-version="([^"]*)"/);
    if (!match) return;
    expect(match[1]).toMatch(/^v\d+\.\d+\.\d+/);
  });

  test("robots.txt carries the Sitemap line", () => {
    const robots = readOut("robots.txt");
    expect(robots).toContain(`Sitemap: ${PAGES_ORIGIN}/sitemap.xml`);
  });

  test("sitemap.xml lists the canonical page URL", () => {
    const sitemap = readOut("sitemap.xml");
    expect(sitemap).toContain(`<loc>${PAGES_ORIGIN}</loc>`);
  });

  test("branded 404.html exists", () => {
    const notFound = readOut("404.html");
    expect(notFound).toContain("do-harness");
  });
});
