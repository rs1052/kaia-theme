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
function terminalRole(token: string): Role | undefined {
  const role = ansiRoles[token];
  if (!role) return undefined;
  return role;
}

function terminalColor(token: string, variant: Variant): string | undefined {
  const role = terminalRole(token);
  if (!role) return undefined;
  return palettes[variant][role];
}

function semanticize(value: unknown, variant: Variant): unknown {
  if (typeof value !== "string") return value;
  const match = value.match(/^(#[0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
  if (!match) return value;
  const role = roleByLegacyHex[match[1].toLowerCase()];
  if (!role) return value;
  const resolved = palettes[variant][role];
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
  return semanticize(value, variant);
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
  for (const token of registeredTokens) {
    const ansi = terminalColor(token, variant);
    if (ansi) {
      colors[token] = ansi;
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
  for (const [foreground, background] of Object.entries(foregroundSurfacePairs))
    if (colors[foreground] && colors[background])
      colors[foreground] = contrastingForeground(
        colors[background],
        palettes[variant],
      );
  return {
    name: variants[variant].label,
    $schema: "vscode://schemas/color-theme",
    type: variants[variant].themeType,
    semanticHighlighting: true,
    colors,
    tokenColors: walk(legacy.tokenColors, variant) as unknown[],
    semanticTokenColors: semanticTokenColors(variant),
  };
}

function semanticTokenColors(variant: Variant): Record<string, string> {
  const palette = palettes[variant];
  return {
    variable: palette.strong,
    parameter: palette.orange,
    property: palette.blue,
    function: palette.green,
    method: palette.green,
    type: palette.accent,
    class: palette.accent,
    enumMember: palette.blue,
    namespace: palette.accent,
    comment: palette.muted,
    string: palette.accent,
    number: palette.purple,
    keyword: palette.accent,
    operator: palette.red,
  };
}
