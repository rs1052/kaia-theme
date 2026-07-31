import {
  converter,
  formatHex,
  formatHex8,
  parse,
  toGamut,
  wcagContrast,
  wcagLuminance,
} from "culori";

export type Variant = "kaia" | "subtle" | "oled";

/** Hexadecimal source palette extracted from the preserved Kaia theme. */
export const basePalette = {
  transparent: "#00000000",
  deepest: "#111111",
  border: "#121212",
  chrome: "#1a1a1a",
  canvas: "#212121",
  surfaceRaised: "#303030",
  filter: "#373737",
  active: "#424242",
  rangeBorder: "#505050",
  structuralBorder: "#333333",
  selectionBackground: "#ffffff20",
  windowBorder: "#3a3a3a",
  subtle: "#616161",
  muted: "#9e9e9e",
  secondary: "#bdbdbd",
  normal: "#eeeeee",
  strong: "#f5f5f5",
  panelTitle: "#e0e0e0",
  white: "#ffffff",
  accent: "#fff59d",
  accentBright: "#fff9c4",
  onAccent: "#212121",
  red: "#ef9a9a",
  redBright: "#ffcdd2",
  orange: "#ffcc80",
  yellow: "#ffeb3b",
  yellowSoft: "#ffecb3",
  green: "#a5d6a7",
  greenBright: "#c8e6c9",
  greenSoft: "#dcedc8",
  cyan: "#80deea",
  cyanBright: "#b2ebf2",
  blue: "#81d4fa",
  blueStrong: "#2196f3",
  blueBright: "#bbdefb",
  purple: "#ce93d8",
  purpleBright: "#e1bee7",
  purpleSoft: "#d1c4e9",
  coralSoft: "#ffccbc",
  pinkSoft: "#f8bbd0",
  highlightSubtleOverlay: "#ffffff10",
  highlightOverlay: "#ffffff14",
  highlightStrongOverlay: "#ffffff18",
  diffAddedLine: "#a5d6a719",
  diffRemovedLine: "#ef9a9a19",
} as const;

export type Role = keyof typeof basePalette;

export interface OklchTransform {
  readonly lightnessDelta: number;
  readonly chromaMultiplier: number;
}

export const variants = {
  kaia: { label: "Kaia", transform: {} },
  subtle: {
    label: "Kaia Subtle",
    transform: {
      accent: { lightnessDelta: 0.02, chromaMultiplier: 0.72 },
      status: { lightnessDelta: 0.055, chromaMultiplier: 0.65 },
      syntax: { lightnessDelta: 0.045, chromaMultiplier: 0.68 },
    },
  },
  oled: { label: "Kaia OLED", transform: {} },
} as const;

const toOklch = converter("oklch");
const mapToSrgb = toGamut("rgb", "oklch");

export function transformHex(hex: string, transform: OklchTransform): string {
  const parsed = parse(hex);
  if (!parsed) throw new Error(`Invalid hexadecimal color: ${hex}`);
  const oklch = toOklch(parsed);
  if (!oklch) throw new Error(`Cannot convert color to OKLCH: ${hex}`);
  const mapped = mapToSrgb({
    ...oklch,
    l: Math.max(0, Math.min(1, oklch.l + transform.lightnessDelta)),
    c: Math.max(0, oklch.c * transform.chromaMultiplier),
  });
  return (parsed.alpha ?? 1) < 1
    ? formatHex8({ ...mapped, alpha: parsed.alpha })!.toLowerCase()
    : formatHex(mapped)!.toLowerCase();
}

const accentRoles = new Set<Role>(["accent", "accentBright"]);
const statusRoles = new Set<Role>(["red", "orange", "green", "blue"]);
const syntaxRoles = new Set<Role>(["yellow", "cyan", "purple"]);

function createSubtlePalette(): Record<Role, string> {
  const result = { ...basePalette } as Record<Role, string>;
  for (const role of Object.keys(basePalette) as Role[]) {
    const transform = accentRoles.has(role)
      ? variants.subtle.transform.accent
      : statusRoles.has(role)
        ? variants.subtle.transform.status
        : syntaxRoles.has(role)
          ? variants.subtle.transform.syntax
          : undefined;
    if (transform) result[role] = transformHex(basePalette[role], transform);
  }
  result.diffAddedLine = `${result.green.slice(0, 7)}19`;
  result.diffRemovedLine = `${result.red.slice(0, 7)}19`;
  return result;
}

export const oledSurfaceRoles: Readonly<Partial<Record<Role, string>>> = {
  deepest: "#000000",
  border: "#000000",
  chrome: "#000000",
  canvas: "#000000",
  surfaceRaised: "#000000",
  filter: "#000000",
  active: "#000000",
};

function createOledPalette(): Record<Role, string> {
  return {
    ...basePalette,
    ...oledSurfaceRoles,
    // This role shares the legacy canvas hex; keeping both black preserves
    // OLED surfaces while retaining maximum contrast on bright accents.
    onAccent: "#000000",
  };
}

export const palettes: Record<Variant, Record<Role, string>> = {
  kaia: { ...basePalette },
  subtle: createSubtlePalette(),
  oled: createOledPalette(),
};

export const ansiRoles: Readonly<Record<string, Role>> = {
  "terminal.ansiBlack": "subtle",
  "terminal.ansiRed": "red",
  "terminal.ansiGreen": "greenBright",
  "terminal.ansiYellow": "yellow",
  "terminal.ansiBlue": "blueStrong",
  "terminal.ansiMagenta": "purple",
  "terminal.ansiCyan": "cyan",
  "terminal.ansiWhite": "normal",
  "terminal.ansiBrightBlack": "secondary",
  "terminal.ansiBrightRed": "redBright",
  "terminal.ansiBrightGreen": "greenBright",
  "terminal.ansiBrightYellow": "accent",
  "terminal.ansiBrightBlue": "blueBright",
  "terminal.ansiBrightMagenta": "purpleBright",
  "terminal.ansiBrightCyan": "cyanBright",
  "terminal.ansiBrightWhite": "strong",
};

/** Explicit assignments for tokens whose names do not describe their visual intent. */
export const tokenRoleOverrides: Readonly<Record<string, Role>> = {
  "activityBar.activeBorder": "accent",
  "activityBarTop.activeBorder": "accent",
  "activityBar.activeFocusBorder": "transparent",
  contrastActiveBorder: "transparent",
  contrastBorder: "transparent",
  "button.foreground": "onAccent",
  "activityBarBadge.foreground": "onAccent",
  "activityErrorBadge.foreground": "onAccent",
  "activityWarningBadge.foreground": "onAccent",
  "badge.foreground": "onAccent",
  "extensionButton.prominentForeground": "onAccent",
  "quickInputList.focusForeground": "onAccent",
  "quickInputList.focusHighlightForeground": "onAccent",
  "quickInputList.focusIconForeground": "onAccent",
  "statusBarItem.remoteForeground": "onAccent",
  "statusBarItem.remoteHoverForeground": "onAccent",
  "editor.findMatchBackground": "selectionBackground",
  "editor.findMatchHighlightBackground": "highlightStrongOverlay",
  "editor.inactiveSelectionBackground": "highlightStrongOverlay",
  "editor.selectionBackground": "selectionBackground",
  "editor.selectionForeground": "strong",
  "editor.selectionHighlightBackground": "highlightOverlay",
  "editor.wordHighlightBackground": "highlightOverlay",
  "editor.wordHighlightStrongBackground": "highlightStrongOverlay",
  "editor.wordHighlightTextBackground": "highlightOverlay",
  "editor.wordHighlightTextBorder": "transparent",
  "editorBracketMatch.background": "highlightStrongOverlay",
  "editorCommentsWidget.rangeActiveBackground": "highlightStrongOverlay",
  "editorCommentsWidget.rangeBackground": "highlightSubtleOverlay",
  "peekViewEditor.matchHighlightBackground": "highlightOverlay",
  "peekViewResult.matchHighlightBackground": "highlightOverlay",
  "peekViewResult.selectionBackground": "highlightStrongOverlay",
  "terminal.selectionBackground": "selectionBackground",
  "editorError.background": "transparent",
  "editorWarning.background": "transparent",
  "editorInfo.background": "transparent",
  "diffEditor.insertedLineBackground": "diffAddedLine",
  "diffEditor.removedLineBackground": "diffRemovedLine",
  "diffEditorGutter.insertedLineBackground": "diffAddedLine",
  "diffEditorGutter.removedLineBackground": "diffRemovedLine",
  "diffEditor.insertedTextBorder": "transparent",
  "diffEditor.removedTextBorder": "transparent",
  "scmGraph.foreground1": "accent",
  "scmGraph.foreground2": "green",
  "scmGraph.foreground3": "cyan",
  "scmGraph.foreground4": "purple",
  "scmGraph.foreground5": "orange",
  "scmGraph.historyItemBaseRefColor": "accent",
  "scmGraph.historyItemRefColor": "accent",
  "scmGraph.historyItemRemoteRefColor": "purple",
  "scmGraph.historyItemHoverAdditionsForeground": "green",
  "scmGraph.historyItemHoverDeletionsForeground": "red",
  "scmGraph.historyItemHoverLabelForeground": "onAccent",
  "window.activeBorder": "windowBorder",
  "window.inactiveBorder": "windowBorder",
};

/** Dividers that establish the workbench layout rather than decorate controls. */
export const structuralBorderTokens: readonly string[] = [
  "activityBar.border",
  "agentsPanel.border",
  "editorGroup.border",
  "editorGroupHeader.border",
  "editorGroupHeader.tabsBorder",
  "panel.border",
  "panelSection.border",
  "panelSectionHeader.border",
  "panelStickyScroll.border",
  "panelTitle.border",
  "sideBar.border",
  "sideBarActivityBarTop.border",
  "sideBarSectionHeader.border",
  "sideBarStickyScroll.border",
  "sideBarTitle.border",
  "statusBar.border",
  "statusBar.debuggingBorder",
  "statusBar.noFolderBorder",
  "terminal.border",
  "terminalOverviewRuler.border",
  "terminalStickyScroll.border",
  "titleBar.border",
  "widget.border",
];

export const foregroundSurfacePairs: Readonly<Record<string, string>> = {
  "activityBarBadge.foreground": "activityBarBadge.background",
  "activityErrorBadge.foreground": "activityErrorBadge.background",
  "activityWarningBadge.foreground": "activityWarningBadge.background",
  "badge.foreground": "badge.background",
  "button.foreground": "button.background",
  "extensionButton.prominentForeground": "extensionButton.prominentBackground",
  "quickInputList.focusForeground": "quickInputList.focusBackground",
  "quickInputList.focusHighlightForeground": "quickInputList.focusBackground",
  "quickInputList.focusIconForeground": "quickInputList.focusBackground",
  "statusBarItem.remoteForeground": "statusBarItem.remoteBackground",
};

export function contrastingForeground(
  background: string,
  palette: Readonly<Record<Role, string>>,
): string {
  const parsedBackground = parse(background);
  if (!parsedBackground)
    throw new Error(`Invalid paired background: ${background}`);
  const candidates = [palette.onAccent, palette.strong];
  return candidates.reduce((best, candidate) =>
    wcagContrast(parse(candidate)!, parsedBackground) >
    wcagContrast(parse(best)!, parsedBackground)
      ? candidate
      : best,
  );
}

const neutralRoles: readonly Role[] = [
  "deepest",
  "border",
  "chrome",
  "canvas",
  "surfaceRaised",
  "filter",
  "active",
  "rangeBorder",
  "subtle",
  "muted",
  "secondary",
  "normal",
  "strong",
  "panelTitle",
  "white",
];
const statusRoleForToken: Readonly<Record<string, Role>> = {
  error: "red",
  warning: "orange",
  info: "blue",
  success: "green",
  added: "green",
  inserted: "green",
  deleted: "red",
  removed: "red",
  modified: "blue",
};
const chromaThreshold = 0.025;

export interface ColorClassification {
  readonly kind: "neutral" | "chromatic";
  readonly alpha: number;
  readonly luminance: number;
  readonly lightness: number;
  readonly chroma: number;
  readonly role: Role;
}

function nearestRole(roles: readonly Role[], luminance: number): Role {
  return roles.reduce((closest, role) => {
    const closestDistance = Math.abs(
      wcagLuminance(parse(basePalette[closest])!) - luminance,
    );
    return Math.abs(wcagLuminance(parse(basePalette[role])!) - luminance) <
      closestDistance
      ? role
      : closest;
  });
}

function chromaticRole(token: string): Role {
  const lower = token.toLowerCase();
  for (const [term, role] of Object.entries(statusRoleForToken))
    if (lower.includes(term)) return role;
  return lower.includes("hover") ? "accentBright" : "accent";
}

/** Classify reference paint with Culori; callers retain this in the audit. */
export function classifyReferenceColor(
  token: string,
  value: string,
): ColorClassification | undefined {
  const color = parse(value);
  if (!color) return undefined;
  const oklch = toOklch(color);
  if (!oklch) return undefined;
  const luminance = wcagLuminance(color);
  const chromatic = (oklch.c ?? 0) >= chromaThreshold;
  return {
    kind: chromatic ? "chromatic" : "neutral",
    alpha: color.alpha ?? 1,
    luminance,
    lightness: oklch.l,
    chroma: oklch.c ?? 0,
    role: chromatic
      ? chromaticRole(token)
      : nearestRole(neutralRoles, luminance),
  };
}

/** Map the reference visual type to a Kaia hue or neutral, never its exact RGB. */
export function mapReferenceColor(
  token: string,
  value: string,
  palette: Readonly<Record<Role, string>> = basePalette,
): string | undefined {
  const classification = classifyReferenceColor(token, value);
  if (!classification) return undefined;
  if (classification.alpha === 0) return basePalette.transparent;
  const selected = palette[classification.role];
  if (classification.kind === "neutral")
    return classification.alpha < 1
      ? `${selected.slice(0, 7)}${Math.round(classification.alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
      : selected;
  if (
    classification.role === "accent" ||
    classification.role === "accentBright"
  )
    return classification.alpha < 1
      ? `${selected.slice(0, 7)}${Math.round(classification.alpha * 255)
          .toString(16)
          .padStart(2, "0")}`
      : selected;
  const kaia = toOklch(parse(selected)!);
  if (!kaia) throw new Error(`Cannot convert Kaia role ${classification.role}`);
  const mapped = mapToSrgb({
    ...kaia,
    l: classification.lightness,
    alpha: classification.alpha,
  });
  return classification.alpha < 1
    ? formatHex8(mapped)!.toLowerCase()
    : formatHex(mapped)!.toLowerCase();
}

function alphaClass(alpha: number): "transparent" | "translucent" | "opaque" {
  if (alpha === 0) return "transparent";
  if (alpha < 1) return "translucent";
  return "opaque";
}

function luminanceTier(luminance: number): "dark" | "mid" | "light" {
  if (luminance < 0.08) return "dark";
  if (luminance < 0.4) return "mid";
  return "light";
}

/** Whether a Kaia value has the same visual type as the effective reference. */
export function isReferenceEquivalent(
  token: string,
  referenceValue: string,
  kaiaValue: string,
): boolean {
  const reference = classifyReferenceColor(token, referenceValue);
  const kaia = classifyReferenceColor(token, kaiaValue);
  if (!reference || !kaia) return false;
  if (alphaClass(reference.alpha) !== alphaClass(kaia.alpha)) return false;
  if (reference.alpha === 0 && kaia.alpha === 0) return true;
  if (reference.kind !== kaia.kind) return false;
  return reference.kind === "chromatic"
    ? true
    : luminanceTier(reference.luminance) === luminanceTier(kaia.luminance);
}

export function roleForToken(token: string): Role {
  const lower = token.toLowerCase();
  // Missing references are deliberately safe: a status word cannot turn a
  // background into opaque diagnostic paint.
  if (lower.endsWith("background") || lower.includes("background"))
    return lower.includes("hover") ||
      lower.includes("active") ||
      lower.includes("selected")
      ? "surfaceRaised"
      : "chrome";
  if (
    lower.endsWith("foreground") ||
    lower.includes("foreground") ||
    lower.includes("text")
  ) {
    if (lower.includes("error")) return "red";
    if (lower.includes("warning")) return "orange";
    if (lower.includes("success") || lower.includes("added")) return "green";
    return "normal";
  }
  if (
    lower.includes("error") ||
    lower.includes("deleted") ||
    lower.includes("remove")
  )
    return "red";
  if (lower.includes("warning")) return "orange";
  if (
    lower.includes("success") ||
    lower.includes("added") ||
    lower.includes("inserted")
  )
    return "green";
  if (lower.includes("border"))
    return lower.includes("focus") || lower.includes("active")
      ? "muted"
      : "border";
  if (
    lower.includes("focus") ||
    lower.includes("active") ||
    lower.includes("link")
  )
    return "accent";
  return "muted";
}
