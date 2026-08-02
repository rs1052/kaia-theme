import { rm, mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { scanVisibleContrastCandidates } from "./contrast-helper.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const artifacts = resolve(root, "tests/browser-audit/artifacts/latest");
const port = process.env.KAIA_AUDIT_PORT ?? "8080";
const baseURL = `http://127.0.0.1:${port}`;
const password = process.env.KAIA_AUDIT_PASSWORD ?? "kaia-audit-local-only";
const headed = process.env.KAIA_AUDIT_HEADED === "1";

const report = {
  generatedAt: new Date().toISOString(),
  baseURL,
  mode: headed ? "headed" : "headless",
  startup: null,
  variants: [],
};

function artifactPath(name) {
  return resolve(artifacts, name);
}

function reportPath(path) {
  return relative(root, path);
}

async function becomesVisible(locator, timeout = 5_000) {
  try {
    await locator.waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

async function screenshot(page, variant, scene) {
  const path = artifactPath(`${variant}-${scene}.png`);
  await page.screenshot({ path, animations: "disabled" });
  return reportPath(path);
}

async function login(page) {
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  if (new URL(page.url()).pathname === "/login") {
    await page.getByRole("textbox", { name: "PASSWORD" }).fill(password);
    await page.getByRole("button", { name: "SUBMIT" }).click();
  }
  await page.locator(".monaco-workbench").waitFor({ timeout: 60_000 });
}

async function dismissWorkspaceTrust(page) {
  const continueButton = page.getByRole("button", {
    name: "Trust Folder & Continue",
  });
  if (await becomesVisible(continueButton, 1_000)) await continueButton.click();
  const banner = page.getByRole("banner", { name: /Restricted Mode/ });
  if (await becomesVisible(banner)) {
    await banner.getByRole("button", { name: "Manage" }).click({ force: true });
    const trust = page.getByRole("button", { name: "Trust", exact: true });
    if (await becomesVisible(trust)) await trust.click();
  }
  const close = page.getByRole("button", { name: /Close Modal Editor/ });
  if (await becomesVisible(close)) await close.click();
}

async function normalizeLayout(page) {
  const hideSecondary = page.getByRole("button", {
    name: /Hide Secondary Side Bar/,
  });
  if (await hideSecondary.isVisible().catch(() => false))
    await hideSecondary.click();
  await page.keyboard.press("Control+Shift+E");
}

async function openExplorerFile(page, name) {
  await page.keyboard.press("Control+Shift+E");
  const source = page.getByRole("treeitem", { name: "src", exact: true });
  if (
    (await source.isVisible().catch(() => false)) &&
    (await source.getAttribute("aria-expanded")) !== "true"
  )
    await source.click();
  const file = page.getByRole("treeitem", { name, exact: true });
  await file.dblclick();
  await page.waitForTimeout(750);
}

async function runCommand(page, command) {
  await page.keyboard.press("F1");
  const input = page.getByRole("textbox", {
    name: "Type the name of a command to run.",
  });
  await input.fill(`>${command}`);
  await page
    .getByRole("option", {
      name: new RegExp(`^${command.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
    })
    .first()
    .click();
}

async function selectTheme(page, label) {
  await runCommand(page, "Preferences: Color Theme");
  const themeInput = page.getByRole("textbox", { name: /Select Color Theme/ });
  await themeInput.fill(label);
  await page.getByRole("option", { name: label, exact: true }).click();
  await page.waitForFunction(
    (expected) =>
      document.querySelector(".monaco-workbench")?.className.includes(expected),
    label === "Kaia OLED" ? "kaia-oled-json" : "kaia-json",
  );
}

async function workbenchColors(page) {
  return page.locator(".monaco-workbench").evaluate((element) => {
    const style = getComputedStyle(element);
    const tokens = [
      "foreground",
      "editor-background",
      "editor-foreground",
      "sideBar-background",
      "sideBar-foreground",
      "activityBar-background",
      "activityBar-foreground",
      "panel-background",
      "panelTitle-activeForeground",
      "input-background",
      "input-foreground",
      "button-background",
      "button-foreground",
      "statusBarItem-errorBackground",
      "statusBarItem-errorForeground",
      "statusBarItem-warningBackground",
      "statusBarItem-warningForeground",
      "list-hoverBackground",
      "list-focusBackground",
      "focusBorder",
      "editor-findMatchBackground",
      "editor-findMatchHighlightBackground",
    ];
    return Object.fromEntries(
      tokens.map((token) => [
        token,
        style.getPropertyValue(`--vscode-${token}`).trim(),
      ]),
    );
  });
}

async function interactionStyles(locator) {
  const read = () =>
    locator.evaluate((element) => {
      const values = (node) => {
        const style = getComputedStyle(node);
        return {
          element: `${node.tagName.toLowerCase()}.${[...node.classList].slice(0, 3).join(".")}`,
          color: style.color,
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          outline: style.outline,
          boxShadow: style.boxShadow,
          opacity: style.opacity,
        };
      };
      return [
        values(element),
        ...[...element.querySelectorAll("*")]
          .filter((node) => {
            const rect = node.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .slice(0, 8)
          .map(values),
      ];
    });
  const idle = await read();
  await locator.hover({ force: true });
  const hover = await read();
  await locator.focus();
  const focus = await read();
  return {
    idle,
    hover,
    focus,
    hoverChanged: JSON.stringify(idle) !== JSON.stringify(hover),
    focusChanged: JSON.stringify(idle) !== JSON.stringify(focus),
  };
}

async function scan(page, scene) {
  const candidates = await page.evaluate(scanVisibleContrastCandidates);
  const grouped = new Map();
  for (const candidate of candidates) {
    const key = JSON.stringify([
      candidate.selector,
      candidate.foreground,
      candidate.effectiveBackground,
      candidate.ratio,
    ]);
    const existing = grouped.get(key);
    if (existing) {
      existing.occurrences += 1;
      if (
        existing.examples.length < 5 &&
        !existing.examples.includes(candidate.text)
      )
        existing.examples.push(candidate.text);
    } else {
      grouped.set(key, {
        ...candidate,
        occurrences: 1,
        examples: [candidate.text],
      });
    }
  }
  const unique = [...grouped.values()];
  return {
    scene,
    checked: candidates.length,
    unique: unique.length,
    below3: unique.filter(({ ratio }) => ratio < 3).slice(0, 50),
    below4_5: unique
      .filter(({ ratio }) => ratio >= 3 && ratio < 4.5)
      .slice(0, 100),
  };
}

async function captureEditor(page, variant) {
  await openExplorerFile(page, "App.tsx");
  const result = {
    scene: "editor",
    screenshot: await screenshot(page, variant, "editor"),
    contrast: await scan(page, "editor"),
  };
  const app = page.getByRole("treeitem", { name: "App.tsx", exact: true });
  result.explorerInteraction = await interactionStyles(app);
  await page.locator(".monaco-editor .view-lines").last().click();
  return result;
}

async function captureFind(page, variant) {
  await page.keyboard.press("Control+F");
  const input = page.getByRole("textbox", { name: "Find", exact: true });
  await input.fill("Card");
  await page.waitForTimeout(300);
  const result = {
    scene: "find",
    screenshot: await screenshot(page, variant, "find"),
    contrast: await scan(page, "find"),
  };
  await page.keyboard.press("Escape");
  return result;
}

async function captureQuickInput(page, variant) {
  await page.keyboard.press("F1");
  const input = page.getByRole("textbox", {
    name: "Type the name of a command to run.",
  });
  await input.fill(">Preferences");
  await page.waitForTimeout(300);
  const result = {
    scene: "quick-input",
    screenshot: await screenshot(page, variant, "quick-input"),
    contrast: await scan(page, "quick-input"),
  };
  await page.keyboard.press("Escape");
  return result;
}

async function captureActivityViews(page, variant) {
  const scenes = [];
  for (const [name, slug] of [
    [/Search/, "search"],
    [/Source Control/, "source-control"],
    [/Extensions/, "extensions"],
  ]) {
    const tab = page.getByRole("tab", { name });
    const interaction = await interactionStyles(tab);
    await tab.click();
    await page.waitForTimeout(500);
    scenes.push({
      scene: slug,
      interaction,
      screenshot: await screenshot(page, variant, slug),
      contrast: await scan(page, slug),
    });
  }
  return scenes;
}

async function captureProblems(page, variant) {
  await openExplorerFile(page, "diagnostics.js");
  await page.keyboard.press("Control+Shift+M");
  await page.waitForTimeout(500);
  const result = {
    scene: "problems",
    screenshot: await screenshot(page, variant, "problems"),
    contrast: await scan(page, "problems"),
  };
  await page.keyboard.press("Control+J");
  await page.getByRole("tab", { name: /Explorer/ }).click();
  return result;
}

async function captureTerminal(page, variant) {
  await runCommand(page, "Terminal: Create New Terminal");
  const trust = page.getByRole("button", { name: "Trust Folder & Continue" });
  if (await becomesVisible(trust, 2_000)) await trust.click();
  const terminal = page.locator(".xterm-helper-textarea").last();
  await terminal.waitFor({ timeout: 15_000 });
  await terminal.fill("node terminal-ansi.mjs");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1_000);
  const result = {
    scene: "terminal",
    screenshot: await screenshot(page, variant, "terminal"),
    contrast: await scan(page, "terminal"),
  };
  await page.keyboard.press("Control+J");
  await page.getByRole("tab", { name: /Explorer/ }).click();
  return result;
}

async function auditVariant(page, definition) {
  console.log(`Auditing ${definition.label}...`);
  await selectTheme(page, definition.label);
  const variant = {
    id: definition.id,
    label: definition.label,
    workbenchColors: await workbenchColors(page),
    scenes: [],
  };
  variant.scenes.push(await captureEditor(page, definition.id));
  variant.scenes.push(await captureFind(page, definition.id));
  variant.scenes.push(await captureQuickInput(page, definition.id));
  variant.scenes.push(...(await captureActivityViews(page, definition.id)));
  variant.scenes.push(await captureProblems(page, definition.id));
  variant.scenes.push(await captureTerminal(page, definition.id));
  return variant;
}

function markdownReport() {
  const count = (value, noun) => `${value} ${noun}${value === 1 ? "" : "s"}`;
  const candidateSummary = (scenes) => {
    const candidates = new Map();
    for (const scene of scenes)
      for (const candidate of [
        ...scene.contrast.below3,
        ...scene.contrast.below4_5,
      ]) {
        const key = JSON.stringify([
          candidate.selector,
          candidate.foreground,
          candidate.effectiveBackground,
          candidate.ratio,
        ]);
        const entry = candidates.get(key) ?? { ...candidate, scenes: [] };
        if (!entry.scenes.includes(scene.scene)) entry.scenes.push(scene.scene);
        candidates.set(key, entry);
      }
    return [...candidates.values()];
  };
  const lines = [
    "# Browser audit evidence",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report contains automated candidates for agent review, not confirmed defects.",
    "",
  ];
  if (report.startup) {
    lines.push(
      "## Startup state",
      "",
      `- **restricted-mode**: ${count(report.startup.contrast.below3.length, "candidate")} below 3:1; ${count(report.startup.contrast.below4_5.length, "candidate")} from 3:1 to 4.5:1; evidence: \`${report.startup.screenshot}\``,
      "",
    );
  }
  for (const variant of report.variants) {
    lines.push(`## ${variant.label}`, "");
    for (const scene of variant.scenes) {
      const noHover = scene.interaction?.hoverChanged === false;
      const noFocus = scene.interaction?.focusChanged === false;
      lines.push(
        `- **${scene.scene}**: ${count(scene.contrast.below3.length, "candidate")} below 3:1; ${count(scene.contrast.below4_5.length, "candidate")} from 3:1 to 4.5:1; evidence: \`${scene.screenshot}\`${
          noHover ? "; no computed hover delta" : ""
        }${noFocus ? "; no computed focus delta" : ""}`,
      );
    }
    lines.push("", "### Unique candidate summary", "");
    for (const candidate of candidateSummary(variant.scenes))
      lines.push(
        `- **${candidate.ratio}:1** — \`${candidate.selector}\`; examples: ${candidate.examples.map((example) => `\`${example}\``).join(", ")}; scenes: ${candidate.scenes.join(", ")}`,
      );
    lines.push("");
  }
  lines.push(
    "Review the JSON report for selectors, measured colors, token values, and interaction-state details.",
    "",
  );
  return lines.join("\n");
}

await rm(artifacts, { recursive: true, force: true });
await mkdir(artifacts, { recursive: true });

const browser = await chromium.launch({ headless: !headed });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "en-US",
    timezoneId: "UTC",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await login(page);
  await selectTheme(page, "Kaia");
  if (
    await becomesVisible(page.getByRole("banner", { name: /Restricted Mode/ }))
  )
    report.startup = {
      scene: "restricted-mode",
      screenshot: await screenshot(page, "startup", "restricted-mode"),
      workbenchColors: await workbenchColors(page),
      contrast: await scan(page, "restricted-mode"),
    };
  await dismissWorkspaceTrust(page);
  await normalizeLayout(page);
  for (const definition of [
    { id: "kaia", label: "Kaia" },
    { id: "kaia-oled", label: "Kaia OLED" },
  ])
    report.variants.push(await auditVariant(page, definition));
} finally {
  await browser.close();
}

await writeFile(
  artifactPath("report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
await writeFile(artifactPath("report.md"), markdownReport());
console.log(`Browser audit evidence: ${reportPath(artifactPath("report.md"))}`);
