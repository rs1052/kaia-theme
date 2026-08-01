import { mkdir, writeFile } from "node:fs/promises";
import { format } from "prettier";
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
  foregroundSurfacePairs,
  isReferenceEquivalent,
  palettes,
  structuralBorderTokens,
  tokenRoleOverrides,
} from "../src/semantic.js";
import { variantDefinitions } from "../src/variants.js";
import {
  file,
  read2026DarkReference,
  read2026LightReference,
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
const references = {
  dark: await read2026DarkReference(),
  light: await read2026LightReference(),
};
const toOklch = converter("oklch");
const toRgb = converter("rgb");
const inSrgb = inGamut("rgb");
const structuralBorders = new Set(structuralBorderTokens);
const semanticStateToken =
  /terminal\.ansi|error|warning|info|success|added|inserted|deleted|removed|modified|conflict|gitDecoration|scmGraph|testing|debugIcon|merge|diffEditor|problems/i;
type RgbColor = NonNullable<ReturnType<typeof toRgb>>;
function composite(value: string, backdrop: string | RgbColor): RgbColor {
  const color = toRgb(parse(value)!)!;
  const base =
    typeof backdrop === "string" ? toRgb(parse(backdrop)!)! : backdrop;
  const alpha = color.alpha ?? 1;
  return {
    mode: "rgb" as const,
    r: color.r * alpha + base.r * (1 - alpha),
    g: color.g * alpha + base.g * (1 - alpha),
    b: color.b * alpha + base.b * (1 - alpha),
  };
}
const contrastPairs = [
  ["editor.foreground", "editor.background"],
  ["descriptionForeground", "editor.background"],
  ["editorLineNumber.foreground", "editor.background"],
  ["sideBar.foreground", "sideBar.background"],
  ["activityBar.foreground", "activityBar.background"],
  ["statusBar.foreground", "statusBar.background"],
  ["panelTitle.activeForeground", "panel.background"],
  ["input.foreground", "input.background"],
  ["dropdown.foreground", "dropdown.background"],
  ["button.foreground", "button.background"],
  ["menu.foreground", "menu.background"],
  ["notifications.foreground", "notifications.background"],
  ["terminal.foreground", "terminal.background"],
  ...Object.entries(foregroundSurfacePairs),
] as const;
const report: Record<string, unknown> = {
  vscode: inventory.vscode,
  themes: {},
};
const baseline: Record<string, unknown> = {
  vscode: inventory.vscode,
  themes: {},
};
let failed = false;
for (const definition of variantDefinitions) {
  const { id: variant, output, reference: referenceKind } = definition;
  const name = output.replace("themes/", "").replace(".json", "");
  const reference = references[referenceKind];
  const theme = await readJson<Generated>(output);
  const uncovered = inventory.tokens.filter(
    (token) => !(token in theme.colors),
  );
  const contrasts = contrastPairs
    .filter(
      ([foreground, background]) =>
        theme.colors[foreground] && theme.colors[background],
    )
    .map(([foreground, background]) => {
      const effectiveBackground = composite(
        theme.colors[background],
        theme.colors["editor.background"],
      );
      return {
        foreground,
        background,
        ratio: wcagContrast(
          composite(theme.colors[foreground], effectiveBackground),
          effectiveBackground,
        ),
        minimum:
          foreground === "editorLineNumber.foreground"
            ? (["kaia", "subtle", "oled"] as string[]).includes(variant)
              ? 2.5
              : 3
            : 4.5,
      };
    })
    .map((entry) => ({
      ...entry,
      passes: entry.ratio >= entry.minimum,
    }));
  const failures = contrasts.filter(({ passes }) => !passes);
  if (
    uncovered.length ||
    failures.length ||
    (theme as { type?: string }).type !== definition.themeType
  )
    failed = true;
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
    const expected = classifyReferenceColor(
      token,
      referenceColor.value,
      definition.themeType,
    );
    const actual = classifyReferenceColor(
      token,
      generatedColor,
      definition.themeType,
    );
    if (!expected || !actual) return [];
    return [{ token, expected, actual, source: referenceColor.source }];
  });
  const isIntentionalOverride = (
    token: string,
    expected: { kind: string },
    actual: { chroma: number },
  ) => {
    if (token in tokenRoleOverrides || structuralBorders.has(token))
      return true;
    if (
      (definition.id === "light" || definition.family === "grayscale") &&
      expected.kind === "chromatic" &&
      actual.chroma <= 0.02
    )
      return true;
    if (definition.themeType !== "light") return false;
    if (token === "button.background") return true;
    return (
      /error|invalid|deleted|removed|conflict|warning|modified|success|added|inserted|untracked/i.test(
        token,
      ) &&
      token.toLowerCase().includes("background") &&
      (parse(theme.colors[token])?.alpha ?? 1) < 1
    );
  };
  const intentionalOverrides = referenceClassifications.filter(
    ({ token, expected, actual }) =>
      isIntentionalOverride(token, expected, actual),
  );
  const mismatches = referenceClassifications.filter(
    ({ token, expected, actual }) =>
      !isIntentionalOverride(token, expected, actual) &&
      !isReferenceEquivalent(
        token,
        matchReferenceColor(token, reference).value,
        theme.colors[token],
        definition.themeType,
      ),
  );
  const opaqueDiagnosticBackgrounds = Object.entries(theme.colors)
    .filter(([token]) =>
      /^editor(?:Error|Warning|Info)\.background$/.test(token),
    )
    .filter(([, value]) => (parse(value)?.alpha ?? 1) === 1)
    .map(([token]) => token);
  const whiteLargeSurfaces =
    definition.themeType === "light"
      ? [
          "editor.background",
          "sideBar.background",
          "panel.background",
          "activityBar.background",
          "titleBar.activeBackground",
          "statusBar.background",
          "menu.background",
          "editorWidget.background",
        ].filter((token) => theme.colors[token]?.toLowerCase() === "#ffffff")
      : [];
  const oledSurfaceFailures = definition.oled
    ? [
        "editor.background",
        "sideBar.background",
        "activityBar.background",
        "panel.background",
        "titleBar.activeBackground",
        "statusBar.background",
        "menu.background",
        "editorWidget.background",
        "input.background",
        "dropdown.background",
        "terminal.background",
      ].filter((token) => theme.colors[token] !== "#000000")
    : [];
  const textMateSyntax = theme.tokenColors.flatMap((rule) => {
    if (!rule || typeof rule !== "object") return [];
    const record = rule as Record<string, unknown>;
    const settings = record.settings as Record<string, unknown> | undefined;
    if (typeof settings?.foreground !== "string") return [];
    const scope = Array.isArray(record.scope)
      ? record.scope.join(" ")
      : String(record.scope ?? "");
    return [{ source: "textMate", scope, color: settings.foreground }];
  });
  const semanticSyntax = Object.entries(theme.semanticTokenColors).flatMap(
    ([scope, value]) =>
      typeof value === "string"
        ? [{ source: "semantic", scope, color: value }]
        : [],
  );
  const syntax = [...textMateSyntax, ...semanticSyntax];
  const ordinarySyntax = syntax.filter(
    ({ scope }) => !/invalid|error|warning|debug/i.test(scope),
  );
  const syntaxContrast = ordinarySyntax.map(({ source, scope, color }) => {
    const ratio = wcagContrast(
      composite(color, theme.colors["editor.background"]),
      parse(theme.colors["editor.background"])!,
    );
    const minimum = /comment/i.test(scope)
      ? 3
      : /line-number\.find-in-files/i.test(scope)
        ? (["kaia", "subtle", "oled"] as string[]).includes(variant)
          ? 2.5
          : 3
        : 4.5;
    return { source, scope, color, ratio, minimum, passes: ratio >= minimum };
  });
  const syntaxContrastFailures = syntaxContrast.filter(({ passes }) => !passes);
  const grayscaleSyntax =
    definition.family === "grayscale"
      ? ordinarySyntax.filter(
          ({ color }) => (toOklch(parse(color)!)?.c ?? 0) > 0.01,
        )
      : [];
  const grayscaleUiChromaViolations =
    definition.family === "grayscale"
      ? Object.entries(theme.colors)
          .filter(([token]) => !semanticStateToken.test(token))
          .filter(([, color]) => (toOklch(parse(color)!)?.c ?? 0) > 0.02)
          .map(([token, color]) => ({ token, color }))
      : [];
  const opaqueSyntaxColors = new Set(
    ordinarySyntax
      .map(({ color }) => color.toLowerCase())
      .filter((color) => (parse(color)?.alpha ?? 1) === 1),
  );
  const grayscaleLadder =
    definition.family === "grayscale"
      ? [...opaqueSyntaxColors]
          .map((hex) => ({ hex, l: toOklch(parse(hex)!)!.l }))
          .sort((left, right) => left.l - right.l)
          .map((entry, index, entries) => ({
            ...entry,
            deltaFromPrevious:
              index === 0 ? null : entry.l - entries[index - 1].l,
          }))
      : [];
  const grayscaleLevels = grayscaleLadder.length;
  const grayscaleSpacingViolations = grayscaleLadder.filter(
    ({ deltaFromPrevious }) =>
      deltaFromPrevious !== null && deltaFromPrevious < 0.06,
  );
  const ansiContrast = Object.entries(theme.colors)
    .filter(([token]) => token.startsWith("terminal.ansi"))
    .map(([token, color]) => ({
      token,
      color,
      ratio: wcagContrast(
        parse(color)!,
        parse(theme.colors["terminal.background"])!,
      ),
    }));
  const ansiContrastFailures = ansiContrast.filter(({ ratio }) => ratio < 3);
  if (
    opaqueDiagnosticBackgrounds.length ||
    mismatches.length ||
    whiteLargeSurfaces.length ||
    oledSurfaceFailures.length ||
    grayscaleSyntax.length ||
    grayscaleUiChromaViolations.length ||
    syntaxContrastFailures.length ||
    ansiContrastFailures.length ||
    grayscaleSpacingViolations.length ||
    (definition.family === "grayscale" && grayscaleLevels < 5)
  )
    failed = true;
  report.themes = {
    ...(report.themes as object),
    [name]: {
      variant,
      themeType: definition.themeType,
      reference: referenceKind,
      family: definition.family,
      oled: definition.oled,
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
        whiteLargeSurfaces,
        oledSurfaceFailures,
        grayscaleSyntaxChromaViolations: grayscaleSyntax.length,
        grayscaleUiChromaViolations,
        grayscaleLevels,
        grayscaleLadder,
        grayscaleSpacingViolations,
      },
      contrast: contrasts,
      syntaxContrast: {
        checked: syntaxContrast.length,
        failures: syntaxContrastFailures,
      },
      ansiContrast: {
        checked: ansiContrast.length,
        failures: ansiContrastFailures,
      },
      referencePolarity: {
        backgroundTokens: Object.keys(theme.colors).filter((token) =>
          token.includes("background"),
        ).length,
        foregroundTokens: Object.keys(theme.colors).filter((token) =>
          token.includes("foreground"),
        ).length,
        themeType: definition.themeType,
        contrastFailures: failures,
      },
    },
  };
}
for (const [name, path] of [
  ["kaia-old", "themes/kaia-old.json"],
  ["kaia-subtle-old", "themes/kaia-subtle-old.json"],
] as const) {
  const oldTheme = await readThemeJsonc<Generated>(path);
  const baselineUncovered = inventory.tokens.filter(
    (token) => !(token in oldTheme.colors),
  );
  baseline.themes = {
    ...(baseline.themes as object),
    [name]: {
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
await writeFile(
  file("reports/theme-audit.json"),
  await format(stableJson(report), { parser: "json" }),
);
await writeFile(
  file("reports/theme-audit.md"),
  `# Theme audit\n\nVS Code ${inventory.vscode.tag} (${inventory.vscode.commit})\n\n\`npm run audit:themes\` generated the machine-readable report.\n`,
);
await writeFile(
  file("reports/baseline-theme-audit.json"),
  await format(stableJson(baseline), { parser: "json" }),
);
await writeFile(
  file("reports/baseline-theme-audit.md"),
  `# Preserved-theme baseline\n\nVS Code ${inventory.vscode.tag} (${inventory.vscode.commit})\n\nThis report records coverage before generated-token expansion.\n`,
);
if (failed) process.exitCode = 1;
