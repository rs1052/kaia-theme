import { mkdir, writeFile } from "node:fs/promises";
import {
  converter,
  inGamut,
  parse,
  toGamut,
  wcagContrast,
  wcagLuminance,
} from "culori";
import {
  classifyReferenceColor,
  isReferenceEquivalent,
  palettes,
  structuralBorderTokens,
  tokenRoleOverrides,
} from "../src/semantic.js";
import {
  file,
  read2026DarkReference,
  readJson,
  readThemeJsonc,
  stableJson,
} from "./common.js";
import { matchReferenceColor } from "../src/reference.js";

interface Generated {
  colors: Record<string, string>;
  tokenColors: unknown[];
  semanticTokenColors: Record<string, unknown>;
}
const inventory = await readJson<{
  vscode: { tag: string; commit: string };
  tokens: string[];
}>("references/vscode-1.130.0-workbench-colors.json");
const reference = await read2026DarkReference();
const toOklch = converter("oklch");
const inSrgb = inGamut("rgb");
const structuralBorders = new Set(structuralBorderTokens);
const report: Record<string, unknown> = {
  vscode: inventory.vscode,
  themes: {},
};
const baseline: Record<string, unknown> = {
  vscode: inventory.vscode,
  themes: {},
};
let failed = false;
for (const [name, variant, oldName] of [
  ["kaia", "kaia", "kaia-old"],
  ["kaia-subtle", "subtle", "kaia-subtle-old"],
  ["kaia-oled", "oled", "kaia-old"],
] as const) {
  const theme = await readJson<Generated>(`themes/${name}.json`);
  const oldTheme = await readThemeJsonc<Generated>(`themes/${oldName}.json`);
  const uncovered = inventory.tokens.filter(
    (token) => !(token in theme.colors),
  );
  const pairs = [
    ["editor.foreground", "editor.background"],
    ["button.foreground", "button.background"],
    ["input.foreground", "input.background"],
  ] as const;
  const contrasts = pairs.map(([foreground, background]) => ({
    foreground,
    background,
    ratio: wcagContrast(
      parse(theme.colors[foreground])!,
      parse(theme.colors[background])!,
    ),
  }));
  const failures = contrasts.filter(({ ratio }) => ratio < 3);
  if (uncovered.length || failures.length) failed = true;
  const palette = Object.entries(palettes[variant]).map(([role, hex]) => {
    const color = parse(hex)!;
    const oklch = toOklch(color)!;
    return {
      role,
      hex,
      oklch: { l: oklch.l, c: oklch.c, h: oklch.h },
      luminance: wcagLuminance(color),
      inSrgb: inSrgb(color),
      gamutMapped: toGamut("rgb", "oklch")(color),
    };
  });
  const referenceClassifications = inventory.tokens.flatMap((token) => {
    const referenceColor = matchReferenceColor(token, reference);
    const generatedColor = theme.colors[token];
    if (!referenceColor || !generatedColor) return [];
    const expected = classifyReferenceColor(token, referenceColor.value);
    const actual = classifyReferenceColor(token, generatedColor);
    if (!expected || !actual) return [];
    return [{ token, expected, actual, source: referenceColor.source }];
  });
  const intentionalOverrides = referenceClassifications.filter(
    ({ token }) => token in tokenRoleOverrides || structuralBorders.has(token),
  );
  const mismatches = referenceClassifications.filter(
    ({ token }) =>
      !(token in tokenRoleOverrides) &&
      !structuralBorders.has(token) &&
      !isReferenceEquivalent(
        token,
        matchReferenceColor(token, reference).value,
        theme.colors[token],
      ),
  );
  const opaqueDiagnosticBackgrounds = Object.entries(theme.colors)
    .filter(([token]) =>
      /^editor(?:Error|Warning|Info)\.background$/.test(token),
    )
    .filter(([, value]) => (parse(value)?.alpha ?? 1) === 1)
    .map(([token]) => token);
  if (opaqueDiagnosticBackgrounds.length || mismatches.length) failed = true;
  report.themes = {
    ...(report.themes as object),
    [name]: {
      workbenchTokens: Object.keys(theme.colors).length,
      tokenColorRules: theme.tokenColors.length,
      semanticTokenRules: Object.keys(theme.semanticTokenColors).length,
      semanticPalette: palette,
      coverage: {
        assigned: inventory.tokens.length - uncovered.length,
        fallback: 0,
        unresolved: uncovered,
      },
      referenceMapping: {
        resolvedSources: reference.sources,
        comparedWithReference: referenceClassifications.length,
        directReference: inventory.tokens.filter(
          (token) => matchReferenceColor(token, reference).direct,
        ).length,
        archetypeReference: inventory.tokens.filter(
          (token) => !matchReferenceColor(token, reference).direct,
        ).length,
        neutral: referenceClassifications.filter(
          ({ expected }) => expected.kind === "neutral",
        ).length,
        chromatic: referenceClassifications.filter(
          ({ expected }) => expected.kind === "chromatic",
        ).length,
        intentionalOverrides: intentionalOverrides.map(({ token }) => token),
        mismatches: mismatches.length,
        mismatchTokens: mismatches.map(({ token }) => token),
        opaqueDiagnosticBackgrounds,
      },
      contrast: contrasts,
      referencePolarity: {
        darkBackgroundTokens: Object.keys(theme.colors).filter((token) =>
          token.includes("background"),
        ).length,
        lightForegroundTokens: Object.keys(theme.colors).filter((token) =>
          token.includes("foreground"),
        ).length,
        exceptionsBelow3: failures,
      },
    },
  };
  const baselineUncovered = inventory.tokens.filter(
    (token) => !(token in oldTheme.colors),
  );
  baseline.themes = {
    ...(baseline.themes as object),
    [oldName]: {
      workbenchTokens: Object.keys(oldTheme.colors).length,
      tokenColorRules: oldTheme.tokenColors.length,
      coverage: {
        assigned: inventory.tokens.length - baselineUncovered.length,
        unresolved: baselineUncovered.length,
      },
    },
  };
}
await mkdir(file("reports"), { recursive: true });
await writeFile(file("reports/theme-audit.json"), stableJson(report));
await writeFile(
  file("reports/theme-audit.md"),
  `# Theme audit\n\nVS Code ${inventory.vscode.tag} (${inventory.vscode.commit})\n\n\`npm run audit:themes\` generated the machine-readable report.\n`,
);
await writeFile(
  file("reports/baseline-theme-audit.json"),
  stableJson(baseline),
);
await writeFile(
  file("reports/baseline-theme-audit.md"),
  `# Preserved-theme baseline\n\nVS Code ${inventory.vscode.tag} (${inventory.vscode.commit})\n\nThis report records coverage before generated-token expansion.\n`,
);
if (failed) process.exitCode = 1;
