import {
  ansiRoles,
  classifyReferenceColor,
  contrastingForeground,
  foregroundSurfacePairs,
  isReferenceEquivalent,
  mapReferenceColor,
  palettes,
  roleForToken,
  structuralBorderTokens,
  tokenRoleOverrides,
  type Role,
  type Variant,
  variants,
} from "./semantic.js";
import {
  matchReferenceColor,
  type ResolvedReferenceTheme,
} from "./reference.js";

export interface Theme {
  name?: string;
  $schema: string;
  type: "dark";
  semanticHighlighting?: boolean;
  colors: Record<string, string>;
  tokenColors: unknown[];
  semanticTokenColors?: Record<string, unknown>;
}

const roleByLegacyHex = Object.fromEntries(
  Object.entries(palettes.kaia)
    .filter(([, hex]) => hex.length === 7)
    .map(([role, hex]) => [hex.toLowerCase(), role as Role]),
) as Record<string, Role>;

const structuralBorders = new Set(structuralBorderTokens);

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
    const override =
      tokenRoleOverrides[token] ??
      ansiRoles[token] ??
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
      );
      const requiresBrandAccent =
        referenceClassification?.role === "accent" ||
        referenceClassification?.role === "accentBright";
      if (
        requiresBrandAccent ||
        !colors[token] ||
        !isReferenceEquivalent(token, referenceValue, colors[token])
      )
        colors[token] =
          mapReferenceColor(token, referenceValue, palettes[variant]) ??
          palettes[variant][roleForToken(token)];
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
    type: "dark",
    semanticHighlighting: true,
    colors,
    tokenColors: walk(legacy.tokenColors, variant) as unknown[],
    semanticTokenColors: {
      variable: palettes[variant].strong,
      parameter: palettes[variant].orange,
      property: palettes[variant].blue,
      function: palettes[variant].green,
      method: palettes[variant].green,
      type: palettes[variant].accent,
      class: palettes[variant].accent,
      enumMember: palettes[variant].blue,
      namespace: palettes[variant].accent,
      comment: palettes[variant].muted,
      string: palettes[variant].accent,
      number: palettes[variant].purple,
      keyword: palettes[variant].accent,
      operator: palettes[variant].red,
    },
  };
}
