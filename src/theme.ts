import {
  ansiRoles,
  classifyReferenceColor,
  contrastingForeground,
  foregroundSurfacePairs,
  isReferenceEquivalent,
  mapReferenceColor,
  oledTokenRoleOverrides,
  palettes,
  roleForToken,
  structuralBorderTokens,
  textInputBorderTokens,
  tokenRoleOverrides,
  transformHex,
  type Role,
  type Variant,
  variants,
} from "./semantic.js";
import {
  matchReferenceColor,
  type ResolvedReferenceTheme,
} from "./reference.js";
import type { ThemeType } from "./variants.js";

export interface Theme {
  name?: string;
  $schema: string;
  type: ThemeType;
  semanticHighlighting?: boolean;
  colors: Record<string, string>;
  tokenColors: unknown[];
  semanticTokenColors?: Record<string, unknown>;
}

const roleByLegacyHex = Object.entries(palettes.kaia)
  .filter(([, hex]) => hex.length === 7)
  .reduce<Record<string, Role>>((roles, [role, hex]) => {
    // Palette aliases (notably canvas/onAccent) resolve to their first,
    // structural role so a light editor never inherits a dark button ink.
    roles[hex.toLowerCase()] ??= role as Role;
    return roles;
  }, {});

const structuralBorders = new Set(structuralBorderTokens);
const textInputBorders = new Set<string>(textInputBorderTokens);
const lightForegroundSurfacePairs: Readonly<Record<string, string>> = {
  "editor.foreground": "editor.background",
  "sideBar.foreground": "sideBar.background",
  "activityBar.foreground": "activityBar.background",
  "statusBar.foreground": "statusBar.background",
  "panelTitle.activeForeground": "panel.background",
  "input.foreground": "input.background",
  "dropdown.foreground": "dropdown.background",
  "menu.foreground": "menu.background",
  "notifications.foreground": "notifications.background",
  "terminal.foreground": "terminal.background",
};

function terminalRole(token: string, variant: Variant): Role | undefined {
  const role = ansiRoles[token];
  if (!role) return undefined;
  if (
    variants[variant].family === "grayscale" &&
    token === "terminal.ansiBlack"
  )
    return "muted";
  if (variants[variant].themeType === "dark") return role;
  if (token === "terminal.ansiBlack") return "strong";
  if (token === "terminal.ansiWhite") return "normal";
  if (token === "terminal.ansiBrightBlack") return "muted";
  if (token === "terminal.ansiBrightYellow") return "yellow";
  if (token === "terminal.ansiBrightWhite") return "strong";
  return role;
}

const neutralAnsiTokens = new Set([
  "terminal.ansiBlack",
  "terminal.ansiWhite",
  "terminal.ansiBrightBlack",
  "terminal.ansiBrightWhite",
]);

function terminalColor(token: string, variant: Variant): string | undefined {
  const role = terminalRole(token, variant);
  if (!role) return undefined;
  const definition = variants[variant];
  if (neutralAnsiTokens.has(token)) return palettes[variant][role];
  const chromaticSource =
    definition.family === "grayscale"
      ? palettes.kaia[role]
      : palettes[variant][role];
  return definition.themeType === "light"
    ? transformHex(palettes.kaia[role], {
        lightnessDelta: -0.4,
        chromaMultiplier: 0.9,
      })
    : chromaticSource;
}

function lightStatusOverlay(
  token: string,
  variant: Variant,
): string | undefined {
  if (
    variants[variant].themeType !== "light" ||
    !token.toLowerCase().includes("background")
  )
    return undefined;
  const lower = token.toLowerCase();
  const role: Role | undefined = /error|invalid|deleted|removed|conflict/.test(
    lower,
  )
    ? "red"
    : /warning/.test(lower)
      ? "orange"
      : /modified/.test(lower)
        ? "blue"
        : /success|added|inserted|untracked/.test(lower)
          ? "green"
          : undefined;
  return role ? `${palettes[variant][role].slice(0, 7)}24` : undefined;
}

function semanticize(
  value: unknown,
  variant: Variant,
  syntax = false,
): unknown {
  if (typeof value !== "string") return value;
  const match = value.match(/^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
  if (!match) return value;
  const role = roleByLegacyHex[match[1].toLowerCase()];
  if (!role) return value;
  const syntaxRole =
    syntax && variants[variant].themeType === "light"
      ? role === "accent"
        ? "yellow"
        : role === "accentBright"
          ? "yellowSoft"
          : role === "white"
            ? "strong"
            : role
      : role;
  const resolved = palettes[variant][syntaxRole];
  return match[2]
    ? `${resolved.slice(0, 7)}${match[2].toLowerCase()}`
    : resolved;
}

function walk(value: unknown, variant: Variant): unknown {
  if (Array.isArray(value)) return value.map((entry) => walk(entry, variant));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, walk(entry, variant)]),
    );
  return semanticize(value, variant, true);
}

function grayscaleTokenColors(
  tokenColors: unknown[],
  variant: Variant,
): unknown[] {
  if (variants[variant].family !== "grayscale")
    return walk(tokenColors, variant) as unknown[];
  const neutralRoleByLegacyRole: Partial<Record<Role, Role>> = {
    subtle: "muted",
    muted: "muted",
    secondary: "secondary",
    normal: "normal",
    strong: "strong",
    panelTitle: "strong",
    white: "strong",
    accent: "strong",
    accentBright: "strong",
    red: "normal",
    redBright: "strong",
    orange: "secondary",
    yellow: "muted",
    yellowSoft: "secondary",
    green: "strong",
    greenBright: "strong",
    greenSoft: "secondary",
    cyan: "muted",
    cyanBright: "secondary",
    blue: "secondary",
    blueStrong: "muted",
    blueBright: "strong",
    purple: "normal",
    purpleBright: "strong",
    purpleSoft: "secondary",
    coralSoft: "normal",
    pinkSoft: "secondary",
  };
  return tokenColors.map((rule) => {
    if (!rule || typeof rule !== "object") return walk(rule, variant);
    const record = rule as Record<string, unknown>;
    const scopes = Array.isArray(record.scope)
      ? record.scope.join(" ")
      : String(record.scope ?? "");
    const diagnostic = /invalid|error|warning|debug/.test(scopes);
    const comment = /comment/.test(scopes);
    const settings = record.settings;
    if (!settings || typeof settings !== "object") return walk(rule, variant);
    const mapped = walk(settings, variant) as Record<string, unknown>;
    if (!diagnostic && typeof settings === "object") {
      const foreground = (settings as Record<string, unknown>).foreground;
      if (typeof foreground === "string") {
        const match = foreground.match(/^(#[0-9a-fA-F]{6})/);
        const legacyRole = match && roleByLegacyHex[match[1].toLowerCase()];
        const neutralRole = comment
          ? "subtle"
          : legacyRole
            ? (neutralRoleByLegacyRole[legacyRole] ?? "normal")
            : "normal";
        mapped.foreground = palettes[variant][neutralRole];
      }
    }
    return { ...record, settings: mapped };
  });
}

export function generateTheme(
  legacy: Theme,
  variant: Variant,
  registeredTokens: string[],
  reference?: ResolvedReferenceTheme,
): Theme {
  const colors = Object.fromEntries(
    Object.entries(legacy.colors).map(([token, value]) => [
      token,
      semanticize(value, variant) as string,
    ]),
  );
  // The three established outputs predate explicit ANSI remapping and must
  // remain byte-identical. New schemes remap legacy ANSI entries deliberately.
  if (!(["kaia", "subtle", "oled"] as Variant[]).includes(variant))
    for (const token of Object.keys(colors)) {
      const ansi = terminalColor(token, variant);
      if (ansi) colors[token] = ansi;
    }
  for (const token of registeredTokens) {
    const ansi = terminalColor(token, variant);
    if (ansi) {
      colors[token] = ansi;
      continue;
    }
    const statusOverlay = lightStatusOverlay(token, variant);
    if (statusOverlay) {
      colors[token] = statusOverlay;
      continue;
    }
    const override =
      (variants[variant].oled
        ? (oledTokenRoleOverrides[token] ??
          (textInputBorders.has(token) ? "structuralBorder" : undefined))
        : undefined) ??
      tokenRoleOverrides[token] ??
      (structuralBorders.has(token) ? "structuralBorder" : undefined);
    if (override !== undefined) {
      colors[token] = palettes[variant][override];
      continue;
    }
    const referenceValue = reference
      ? matchReferenceColor(token, reference).value
      : undefined;
    if (referenceValue !== undefined) {
      const referenceClassification = classifyReferenceColor(
        token,
        referenceValue,
        variants[variant].themeType,
      );
      const requiresBrandAccent =
        referenceClassification?.role === "accent" ||
        referenceClassification?.role === "accentBright";
      if (
        requiresBrandAccent ||
        !colors[token] ||
        !isReferenceEquivalent(
          token,
          referenceValue,
          colors[token],
          variants[variant].themeType,
        )
      )
        colors[token] =
          mapReferenceColor(
            token,
            referenceValue,
            palettes[variant],
            variants[variant].themeType,
          ) ?? palettes[variant][roleForToken(token)];
      continue;
    }
    colors[token] ??= palettes[variant][roleForToken(token)];
  }
  if (variants[variant].themeType === "light") {
    // Light references use pale controls; preserve the warm surface hierarchy
    // rather than inheriting a dark legacy control alias.
    colors["button.background"] = palettes[variant].accent;
    colors["input.background"] = palettes[variant].chrome;
    colors["input.foreground"] = palettes[variant].normal;
  }
  const readablePairs =
    variants[variant].themeType === "light"
      ? { ...foregroundSurfacePairs, ...lightForegroundSurfacePairs }
      : foregroundSurfacePairs;
  for (const [foreground, background] of Object.entries(readablePairs))
    if (colors[foreground] && colors[background])
      colors[foreground] = contrastingForeground(
        colors[background],
        palettes[variant],
        variants[variant].themeType === "light"
          ? palettes[variant].canvas
          : undefined,
      );
  return {
    name: variants[variant].label,
    $schema: "vscode://schemas/color-theme",
    type: variants[variant].themeType,
    semanticHighlighting: true,
    colors,
    tokenColors: grayscaleTokenColors(legacy.tokenColors, variant),
    semanticTokenColors: semanticTokenColors(variant),
  };
}

function semanticTokenColors(variant: Variant): Record<string, string> {
  const palette = palettes[variant];
  if (variants[variant].family === "grayscale")
    return {
      variable: palette.strong,
      parameter: palette.secondary,
      property: palette.muted,
      function: palette.normal,
      method: palette.normal,
      type: palette.strong,
      class: palette.strong,
      enumMember: palette.secondary,
      namespace: palette.strong,
      comment: palette.subtle,
      string: palette.secondary,
      number: palette.normal,
      keyword: palette.muted,
      operator: palette.normal,
    };
  return {
    variable: palette.strong,
    parameter: palette.orange,
    property: palette.blue,
    function: palette.green,
    method: palette.green,
    type:
      variants[variant].themeType === "light" ? palette.yellow : palette.accent,
    class:
      variants[variant].themeType === "light" ? palette.yellow : palette.accent,
    enumMember: palette.blue,
    namespace:
      variants[variant].themeType === "light" ? palette.yellow : palette.accent,
    comment: palette.muted,
    string:
      variants[variant].themeType === "light" ? palette.yellow : palette.accent,
    number: palette.purple,
    keyword:
      variants[variant].themeType === "light" ? palette.yellow : palette.accent,
    operator: palette.red,
  };
}
