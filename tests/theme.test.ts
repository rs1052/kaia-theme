import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { converter, parse, wcagContrast } from "culori";
import {
  classifyReferenceColor,
  isReferenceEquivalent,
  mapReferenceColor,
  oledSurfaceRoles,
  palettes,
  roleForToken,
  structuralBorderTokens,
  transformHex,
} from "../src/semantic.js";
import {
  matchReferenceColor,
  resolveReferenceTheme,
} from "../src/reference.js";
import { generateTheme, type Theme } from "../src/theme.js";
import { readThemeJsonc } from "../scripts/common.js";

test("semantic source is hexadecimal and parses with Culori", () => {
  for (const palette of Object.values(palettes))
    for (const color of Object.values(palette)) assert.ok(parse(color));
});

test("OLED neutral surfaces are uniformly true black", () => {
  assert.deepEqual(oledSurfaceRoles, {
    deepest: "#000000",
    border: "#000000",
    chrome: "#000000",
    canvas: "#000000",
    surfaceRaised: "#000000",
    filter: "#000000",
    active: "#000000",
  });
  for (const [role, color] of Object.entries(oledSurfaceRoles)) {
    assert.equal(palettes.oled[role as keyof typeof palettes.oled], color);
    assert.equal(color, "#000000", role);
  }
  assert.equal(palettes.oled.onAccent, "#000000");
});

test("semantic generation provides ANSI and semantic token mappings", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: { "editor.background": "#212121", "editor.foreground": "#f5f5f5" },
    tokenColors: [],
  };
  const generated = generateTheme(legacy, "kaia", [
    "terminal.ansiRed",
    "new.background",
    "new.foreground",
  ]);
  assert.equal(generated.colors["terminal.ansiRed"], palettes.kaia.red);
  assert.equal(generated.colors["new.background"], palettes.kaia.chrome);
  assert.equal(generated.semanticTokenColors?.string, palettes.kaia.accent);
  assert.ok(
    wcagContrast(
      parse(generated.colors["editor.foreground"])!,
      parse(generated.colors["editor.background"])!,
    ) >= 4.5,
  );
});

test("OLED generation resolves legacy canvas aliases to true black", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {
      "editor.background": "#212121",
      "dropdown.background": "#212121",
    },
    tokenColors: [],
  };
  const generated = generateTheme(legacy, "oled", [
    "editor.background",
    "dropdown.background",
  ]);
  assert.equal(generated.name, "Kaia OLED");
  assert.equal(generated.colors["editor.background"], "#000000");
  assert.equal(generated.colors["dropdown.background"], "#000000");
});

test("structural workbench borders are visible in every generated variant", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: Object.fromEntries(
      structuralBorderTokens.map((token) => [token, "#121212"]),
    ),
    tokenColors: [],
  };
  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, [
      ...structuralBorderTokens,
    ]);
    for (const token of structuralBorderTokens)
      assert.equal(
        generated.colors[token],
        palettes[variant].structuralBorder,
        `${variant}: ${token}`,
      );
  }
});

test("editor selections preserve readable syntax contrast", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {
      "editor.selectionBackground": "#fff59ddd",
      "editor.selectionForeground": "#bdbdbd",
      "editor.selectionHighlightBackground": "#fff59d60",
    },
    tokenColors: [],
  };
  const selectedTextRoles = [
    "muted",
    "normal",
    "strong",
    "red",
    "orange",
    "accent",
    "green",
    "cyan",
    "blue",
    "purple",
  ] as const;
  const toRgb = converter("rgb");

  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, [
      "editor.selectionBackground",
      "editor.selectionForeground",
      "editor.selectionHighlightBackground",
    ]);
    const overlay = toRgb(
      parse(generated.colors["editor.selectionBackground"])!,
    )!;
    const editor = toRgb(parse(palettes[variant].canvas)!)!;
    const alpha = overlay.alpha ?? 1;
    const selection = {
      mode: "rgb" as const,
      r: overlay.r * alpha + editor.r * (1 - alpha),
      g: overlay.g * alpha + editor.g * (1 - alpha),
      b: overlay.b * alpha + editor.b * (1 - alpha),
    };
    assert.equal(
      generated.colors["editor.selectionBackground"],
      palettes[variant].selectionBackground,
    );
    assert.equal(
      generated.colors["editor.selectionForeground"],
      palettes[variant].strong,
    );
    assert.equal(
      generated.colors["editor.selectionHighlightBackground"],
      palettes[variant].highlightOverlay,
    );
    assert.ok(
      (parse(generated.colors["editor.selectionHighlightBackground"])!.alpha ??
        1) < (overlay.alpha ?? 1),
    );
    for (const role of selectedTextRoles)
      assert.ok(
        wcagContrast(parse(palettes[variant][role])!, selection) >=
          (role === "muted" ? 4 : 4.5),
        `${variant}: ${role}`,
      );
  }
});

test("editor text highlights use transparent gray roles", () => {
  const highlightRoles = {
    "editor.findMatchBackground": "selectionBackground",
    "editor.findMatchHighlightBackground": "highlightStrongOverlay",
    "editor.inactiveSelectionBackground": "highlightStrongOverlay",
    "editor.selectionHighlightBackground": "highlightOverlay",
    "editor.wordHighlightBackground": "highlightOverlay",
    "editor.wordHighlightStrongBackground": "highlightStrongOverlay",
    "editor.wordHighlightTextBackground": "highlightOverlay",
    "editorBracketMatch.background": "highlightStrongOverlay",
    "editorCommentsWidget.rangeActiveBackground": "highlightStrongOverlay",
    "editorCommentsWidget.rangeBackground": "highlightSubtleOverlay",
    "peekViewEditor.matchHighlightBackground": "highlightOverlay",
    "peekViewResult.matchHighlightBackground": "highlightOverlay",
    "peekViewResult.selectionBackground": "highlightStrongOverlay",
    "terminal.selectionBackground": "selectionBackground",
  } as const;
  const tokens = Object.keys(highlightRoles);
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: Object.fromEntries(tokens.map((token) => [token, "#fff59d80"])),
    tokenColors: [],
  };

  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, tokens);
    for (const [token, role] of Object.entries(highlightRoles))
      assert.equal(
        generated.colors[token],
        palettes[variant][role],
        `${variant}: ${token}`,
      );
  }
});

test("window borders use neutral gray instead of the accent", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, [
      "window.activeBorder",
      "window.inactiveBorder",
    ]);
    assert.equal(
      generated.colors["window.activeBorder"],
      palettes[variant].windowBorder,
    );
    assert.equal(
      generated.colors["window.inactiveBorder"],
      palettes[variant].windowBorder,
    );
    assert.equal(palettes[variant].windowBorder, "#3a3a3a");
  }
});

test("token fallback classification is deterministic", () => {
  assert.equal(roleForToken("widget.errorForeground"), "red");
  assert.equal(roleForToken("widget.background"), "chrome");
  assert.notEqual(
    roleForToken("activeSessionView.foreground"),
    roleForToken("activeSessionView.background"),
  );
});

test("reference include resolution applies child overrides and records sources", async () => {
  const directory = await mkdtemp(join(tmpdir(), "kaia-reference-"));
  try {
    await writeFile(
      join(directory, "parent.json"),
      '{ "colors": { "surface": "#111111", "foreground": "#cccccc" } }',
    );
    await writeFile(
      join(directory, "child.json"),
      '{ "include": "./parent.json", "colors": { "surface": "#222222" } }',
    );
    const resolved = await resolveReferenceTheme(join(directory, "child.json"));
    assert.equal(resolved.colors.surface.value, "#222222");
    assert.match(resolved.colors.surface.source, /child\.json$/);
    assert.equal(resolved.sources.length, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("reference include resolution reports cycles and missing files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "kaia-reference-"));
  try {
    await writeFile(join(directory, "a.json"), '{ "include": "./b.json" }');
    await writeFile(join(directory, "b.json"), '{ "include": "./a.json" }');
    await assert.rejects(
      resolveReferenceTheme(join(directory, "a.json")),
      /cycle/,
    );
    await assert.rejects(
      resolveReferenceTheme(join(directory, "missing.json")),
      /Unable to read reference theme/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("missing tokens use explicit 2026 Dark archetypes", () => {
  const reference = {
    sources: ["2026-dark.json"],
    colors: {
      foreground: { value: "#bfbfbf", source: "2026-dark.json" },
      "editor.foreground": { value: "#bbbeBF", source: "2026-dark.json" },
      "editor.background": { value: "#121314", source: "2026-dark.json" },
      "editorWidget.background": { value: "#202122", source: "2026-dark.json" },
      "diffEditor.removedLineBackground": {
        value: "#c93c3726",
        source: "2026-dark.json",
      },
      "diffEditor.insertedLineBackground": {
        value: "#347d3926",
        source: "2026-dark.json",
      },
      "inputValidation.errorBackground": {
        value: "#3a1d1d",
        source: "2026-dark.json",
      },
      "inputValidation.warningBackground": {
        value: "#352a05",
        source: "2026-dark.json",
      },
      "list.activeSelectionBackground": {
        value: "#ffffff22",
        source: "2026-dark.json",
      },
      "list.hoverBackground": { value: "#ffffff14", source: "2026-dark.json" },
      "list.errorForeground": { value: "#f48771", source: "2026-dark.json" },
      errorForeground: { value: "#f48771", source: "2026-dark.json" },
      "list.warningForeground": { value: "#e5ba7d", source: "2026-dark.json" },
      "gitDecoration.addedResourceForeground": {
        value: "#73c991",
        source: "2026-dark.json",
      },
      descriptionForeground: { value: "#8c8c8c", source: "2026-dark.json" },
      disabledForeground: { value: "#555555", source: "2026-dark.json" },
      focusBorder: { value: "#3994bcb3", source: "2026-dark.json" },
      "widget.border": { value: "#2a2b2cff", source: "2026-dark.json" },
      "panel.border": { value: "#2a2b2cff", source: "2026-dark.json" },
      "scrollbar.shadow": { value: "#191b1d4d", source: "2026-dark.json" },
    },
  };
  const errorLine = matchReferenceColor(
    "testing.message.error.lineBackground",
    reference,
  );
  assert.equal(errorLine.direct, false);
  assert.equal(errorLine.referenceToken, "diffEditor.removedLineBackground");
  assert.equal(errorLine.value, "#c93c3726");
  const unknownForeground = matchReferenceColor(
    "futureWidget.foreground",
    reference,
  );
  assert.equal(unknownForeground.referenceToken, "foreground");
});

test("reference mapping retains neutral, chromatic, overlay, and polarity classes", () => {
  const surface = mapReferenceColor("commandPalette.background", "#1e1e1e")!;
  const foreground = mapReferenceColor("commandPalette.foreground", "#cccccc")!;
  const overlay = mapReferenceColor(
    "diffEditor.insertedLineBackground",
    "#2ea04333",
  )!;
  const diagnostic = mapReferenceColor("editorError.background", "#f8514933")!;
  assert.equal(classifyReferenceColor("surface", surface)?.kind, "neutral");
  assert.equal(
    classifyReferenceColor("foreground", foreground)?.kind,
    "neutral",
  );
  assert.ok(
    classifyReferenceColor("foreground", foreground)!.lightness >
      classifyReferenceColor("surface", surface)!.lightness,
  );
  assert.equal(classifyReferenceColor("overlay", overlay)?.kind, "chromatic");
  assert.match(overlay, /^#[0-9a-f]{8}$/);
  assert.equal(overlay.slice(-2), "33");
  assert.match(diagnostic, /^#[0-9a-f]{8}$/);
  assert.equal(diagnostic.slice(-2), "33");
});

test("existing incompatible assignments are remapped by visual type", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {
      "button.background": "#303030",
      "button.foreground": "#9e9e9e",
      "editor.background": "#212121",
      "quickInputList.focusBackground": "#303030",
    },
    tokenColors: [],
  };
  const reference = {
    sources: ["2026-dark.json"],
    colors: {
      "button.background": { value: "#297aa0", source: "2026-dark.json" },
      "button.foreground": { value: "#ffffff", source: "2026-dark.json" },
      "editor.background": { value: "#121314", source: "2026-dark.json" },
      "quickInputList.focusBackground": {
        value: "#297aa0",
        source: "2026-dark.json",
      },
    },
  };
  const tokens = Object.keys(reference.colors);
  const generated = generateTheme(legacy, "kaia", tokens, reference);
  assert.equal(generated.colors["editor.background"], "#212121");
  assert.notEqual(generated.colors["button.background"], "#303030");
  assert.equal(generated.colors["button.background"], palettes.kaia.accent);
  assert.equal(generated.colors["button.foreground"], palettes.kaia.onAccent);
  assert.notEqual(
    generated.colors["quickInputList.focusBackground"],
    "#303030",
  );
  for (const token of tokens.filter((token) => token !== "button.foreground"))
    assert.ok(
      isReferenceEquivalent(
        token,
        reference.colors[token as keyof typeof reference.colors].value,
        generated.colors[token],
      ),
    );
});

test("occurrence highlights and activity-bar focus outlines use explicit roles", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  const generated = generateTheme(legacy, "kaia", [
    "editor.wordHighlightTextBackground",
    "editor.wordHighlightTextBorder",
    "editorError.background",
    "editorWarning.background",
    "editorInfo.background",
    "activityBar.activeFocusBorder",
    "contrastActiveBorder",
    "contrastBorder",
  ]);
  assert.equal(
    generated.colors["editor.wordHighlightTextBackground"],
    "#ffffff14",
  );
  assert.equal(generated.colors["editor.wordHighlightTextBorder"], "#00000000");
  assert.equal(generated.colors["editorError.background"], "#00000000");
  assert.equal(generated.colors["editorWarning.background"], "#00000000");
  assert.equal(generated.colors["editorInfo.background"], "#00000000");
  assert.equal(generated.colors["activityBar.activeFocusBorder"], "#00000000");
  assert.equal(generated.colors.contrastActiveBorder, "#00000000");
  assert.equal(generated.colors.contrastBorder, "#00000000");
});

test("alpha overlay roles cannot replace opaque legacy text roles", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {
      "editor.foreground": "#f5f5f5",
      "editor.wordHighlightBackground": "#f5f5f526",
    },
    tokenColors: [
      { scope: "source.json", settings: { foreground: "#f5f5f5" } },
    ],
  };
  const generated = generateTheme(legacy, "kaia", []);
  assert.equal(generated.colors["editor.foreground"], "#f5f5f5");
  assert.equal(generated.colors["editor.wordHighlightBackground"], "#f5f5f526");
  assert.deepEqual(generated.tokenColors, legacy.tokenColors);
});

test("diff line and gutter backgrounds are translucent overlays", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  const tokens = [
    "diffEditor.insertedLineBackground",
    "diffEditor.removedLineBackground",
    "diffEditorGutter.insertedLineBackground",
    "diffEditorGutter.removedLineBackground",
  ];
  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, tokens);
    for (const token of tokens) {
      const color = generated.colors[token];
      assert.match(color, /^#[0-9a-f]{8}$/);
      assert.ok(Number.parseInt(color.slice(7), 16) < 0x40);
    }
  }
});

test("quick input focus rows visibly differ from the palette background", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  const tokens = [
    "quickInput.background",
    "quickInput.list.focusBackground",
    "quickInputList.focusBackground",
    "quickInputList.focusForeground",
  ];
  const reference = {
    sources: ["2026-dark.json"],
    colors: Object.fromEntries(
      tokens.map((token) => [
        token,
        {
          value: token.includes("focusBackground")
            ? "#297aa0"
            : token.endsWith("background")
              ? "#202122"
              : "#ffffff",
          source: "2026-dark.json",
        },
      ]),
    ),
  };
  const generated = generateTheme(legacy, "kaia", tokens, reference);
  assert.equal(
    classifyReferenceColor(
      "quickInput.background",
      generated.colors["quickInput.background"],
    )?.kind,
    "neutral",
  );
  assert.equal(
    classifyReferenceColor(
      "quickInputList.focusBackground",
      generated.colors["quickInputList.focusBackground"],
    )?.kind,
    "chromatic",
  );
  assert.equal(
    generated.colors["quickInputList.focusBackground"],
    palettes.kaia.accent,
  );
  assert.equal(
    generated.colors["quickInputList.focusForeground"],
    palettes.kaia.onAccent,
  );
  assert.notEqual(
    generated.colors["quickInputList.focusBackground"],
    generated.colors["quickInput.background"],
  );
  assert.ok(
    wcagContrast(
      parse(generated.colors["quickInputList.focusForeground"])!,
      parse(generated.colors["quickInputList.focusBackground"])!,
    ) >= 4.5,
  );
});

test("bright workbench surfaces use dark contrasting foregrounds", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  const pairs = [
    ["activityBarBadge.foreground", "activityBarBadge.background"],
    ["activityErrorBadge.foreground", "activityErrorBadge.background"],
    ["activityWarningBadge.foreground", "activityWarningBadge.background"],
    ["badge.foreground", "badge.background"],
    ["button.foreground", "button.background"],
    [
      "extensionButton.prominentForeground",
      "extensionButton.prominentBackground",
    ],
    ["quickInputList.focusForeground", "quickInputList.focusBackground"],
    ["statusBarItem.remoteForeground", "statusBarItem.remoteBackground"],
  ] as const;
  const tokens = [...new Set(pairs.flat())];
  const reference = {
    sources: ["2026-dark.json"],
    colors: Object.fromEntries(
      tokens.map((token) => [
        token,
        {
          value: token.endsWith("foreground") ? "#ffffff" : "#297aa0",
          source: "2026-dark.json",
        },
      ]),
    ),
  };
  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, tokens, reference);
    for (const [foreground, background] of pairs)
      assert.ok(
        wcagContrast(
          parse(generated.colors[foreground])!,
          parse(generated.colors[background])!,
        ) >= 4.5,
        `${variant}: ${foreground} on ${background}`,
      );
  }
});

test("SCM graph references use Kaia chromatic roles", () => {
  const legacy: Theme = {
    $schema: "x",
    type: "dark",
    colors: {},
    tokenColors: [],
  };
  const tokens = [
    "scmGraph.foreground1",
    "scmGraph.foreground2",
    "scmGraph.foreground3",
    "scmGraph.foreground4",
    "scmGraph.foreground5",
    "scmGraph.historyItemRefColor",
  ];
  const generated = generateTheme(legacy, "kaia", tokens);
  assert.equal(
    generated.colors["scmGraph.historyItemRefColor"],
    palettes.kaia.accent,
  );
  assert.equal(new Set(tokens.map((token) => generated.colors[token])).size, 5);
});

test("OKLCH transforms preserve hue and alpha", () => {
  const toOklch = converter("oklch");
  const source = toOklch(parse("#ef9a9a80")!)!;
  const outputHex = transformHex("#ef9a9a80", {
    lightnessDelta: 0.04,
    chromaMultiplier: 0.7,
  });
  const output = toOklch(parse(outputHex)!)!;
  assert.equal(outputHex.length, 9);
  assert.ok(Math.abs((source.h ?? 0) - (output.h ?? 0)) < 1);
  assert.ok(output.c < source.c);
  assert.ok(output.l > source.l);
});

test("preserved legacy themes parse as JSONC without being rewritten", async () => {
  const theme = await readThemeJsonc<Theme>("themes/kaia-subtle-old.json");
  assert.equal(theme.type, "dark");
  assert.ok(theme.tokenColors.length > 0);
});

test("generated theme colors are valid six- or eight-digit hex", async () => {
  const legacy = await readThemeJsonc<Theme>("themes/kaia-old.json");
  for (const variant of ["kaia", "subtle", "oled"] as const) {
    const generated = generateTheme(legacy, variant, [
      "editor.background",
      "editor.foreground",
    ]);
    const colors: string[] = [];
    JSON.stringify(generated, (_key, value: unknown) => {
      if (typeof value === "string" && value.startsWith("#"))
        colors.push(value);
      return value;
    });
    for (const color of colors) {
      assert.match(color, /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/);
      assert.ok(parse(color));
    }
  }
});
