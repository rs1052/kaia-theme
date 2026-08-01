import {
  converter,
  formatHex,
  formatHex8,
  parse,
  toGamut,
  wcagContrast,
  wcagLuminance,
} from "culori";
import type { ThemeType, Variant } from "./variants.js";
export { variants, type Variant } from "./variants.js";

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
  findMatchActiveBackground: "#505050",
  findMatchActiveForeground: "#f5f5f5",
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

const subtleTransform = {
  accent: { lightnessDelta: 0.02, chromaMultiplier: 0.72 },
  status: { lightnessDelta: 0.055, chromaMultiplier: 0.65 },
  syntax: { lightnessDelta: 0.045, chromaMultiplier: 0.68 },
} as const;

const toOklch = converter("oklch");
const toRgb = converter("rgb");
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
      ? subtleTransform.accent
      : statusRoles.has(role)
        ? subtleTransform.status
        : syntaxRoles.has(role)
          ? subtleTransform.syntax
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

function createLightPalette(): Record<Role, string> {
  const result: Record<Role, string> = {
    ...basePalette,
    deepest: "#e4e4e7",
    border: "#d4d4d8",
    chrome: "#e4e4e7",
    canvas: "#f4f4f5",
    surfaceRaised: "#fafafa",
    filter: "#d4d4d8",
    active: "#d4d4d8",
    rangeBorder: "#a1a1aa",
    structuralBorder: "#d4d4d8",
    selectionBackground: "#27272a2e",
    windowBorder: "#a1a1aa",
    subtle: "#71717a",
    muted: "#52525b",
    secondary: "#3f3f46",
    normal: "#27272a",
    strong: "#18181b",
    panelTitle: "#27272a",
    accent: "#3f3f46",
    accentBright: "#27272a",
    onAccent: "#fafafa",
    findMatchActiveBackground: "#3f3f46",
    findMatchActiveForeground: "#fafafa",
    highlightSubtleOverlay: "#27272a12",
    highlightOverlay: "#27272a1c",
    highlightStrongOverlay: "#27272a29",
    diffAddedLine: "#4f7a4f24",
    diffRemovedLine: "#a34a4324",
  };
  for (const role of [
    "red",
    "redBright",
    "orange",
    "yellow",
    "yellowSoft",
    "green",
    "greenBright",
    "greenSoft",
    "cyan",
    "cyanBright",
    "blue",
    "blueStrong",
    "blueBright",
    "purple",
    "purpleBright",
    "purpleSoft",
    "coralSoft",
    "pinkSoft",
  ] as Role[])
    result[role] = transformHex(basePalette[role], {
      lightnessDelta: -0.41,
      chromaMultiplier: 1.12,
    });
  return result;
}

/** Achromatic ladder: surfaces and ordinary syntax deliberately retain five levels. */
function createGrayscalePalette(): Record<Role, string> {
  return {
    ...basePalette,
    deepest: "#101010",
    border: "#181818",
    chrome: "#202020",
    canvas: "#282828",
    surfaceRaised: "#343434",
    filter: "#3d3d3d",
    active: "#484848",
    rangeBorder: "#5a5a5a",
    structuralBorder: "#404040",
    selectionBackground: "#ffffff24",
    windowBorder: "#505050",
    subtle: "#727272",
    muted: "#969696",
    secondary: "#b8b8b8",
    normal: "#dedede",
    strong: "#f5f5f5",
    panelTitle: "#d0d0d0",
    white: "#ffffff",
    accent: "#d0d0d0",
    accentBright: "#f5f5f5",
    onAccent: "#151515",
    findMatchActiveBackground: "#5a5a5a",
    findMatchActiveForeground: "#f5f5f5",
    yellow: "#c4c4c4",
    yellowSoft: "#d8d8d8",
    cyan: "#c8c8c8",
    cyanBright: "#dedede",
    blueStrong: "#b8b8b8",
    blueBright: "#d8d8d8",
    purple: "#c4c4c4",
    purpleBright: "#dedede",
    purpleSoft: "#d0d0d0",
    coralSoft: "#d0d0d0",
    pinkSoft: "#d0d0d0",
    highlightSubtleOverlay: "#ffffff10",
    highlightOverlay: "#ffffff18",
    highlightStrongOverlay: "#ffffff24",
    diffAddedLine: "#a5d6a719",
    diffRemovedLine: "#ef9a9a19",
  };
}

function createGrayscaleLightPalette(): Record<Role, string> {
  const dark = createGrayscalePalette();
  const result: Record<Role, string> = {
    ...dark,
    deepest: "#e4e4e7",
    border: "#d4d4d8",
    chrome: "#e4e4e7",
    canvas: "#f4f4f5",
    surfaceRaised: "#fafafa",
    filter: "#d4d4d8",
    active: "#d4d4d8",
    rangeBorder: "#a1a1aa",
    structuralBorder: "#d4d4d8",
    selectionBackground: "#27272a2e",
    windowBorder: "#a1a1aa",
    subtle: "#717171",
    muted: "#525252",
    secondary: "#3f3f3f",
    normal: "#272727",
    strong: "#181818",
    panelTitle: "#272727",
    white: "#ffffff",
    accent: "#3f3f46",
    accentBright: "#27272a",
    onAccent: "#fafafa",
    findMatchActiveBackground: "#3f3f46",
    findMatchActiveForeground: "#fafafa",
    yellow: "#52525b",
    yellowSoft: "#71717a",
    highlightSubtleOverlay: "#27272a12",
    highlightOverlay: "#27272a1c",
    highlightStrongOverlay: "#27272a29",
    diffAddedLine: "#4f7a4f24",
    diffRemovedLine: "#a34a4324",
  };
  for (const role of [
    "red",
    "redBright",
    "orange",
    "green",
    "greenBright",
    "greenSoft",
    "blue",
  ] as Role[])
    result[role] = transformHex(basePalette[role], {
      lightnessDelta: -0.4,
      chromaMultiplier: 0.82,
    });
  return result;
}

export const palettes: Record<Variant, Record<Role, string>> = {
  kaia: { ...basePalette },
  subtle: createSubtlePalette(),
  oled: createOledPalette(),
  light: createLightPalette(),
  grayscale: createGrayscalePalette(),
  grayscaleOled: {
    ...createGrayscalePalette(),
    ...oledSurfaceRoles,
    onAccent: "#000000",
  },
  grayscaleLight: createGrayscaleLightPalette(),
};

export const darkKaiaPalette = palettes.kaia;
export const lightKaiaPalette = palettes.light;
export const darkGrayscalePalette = palettes.grayscale;
export const darkGrayscaleOledPalette = palettes.grayscaleOled;
export const lightGrayscalePalette = palettes.grayscaleLight;

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

/** Active-tab and breadcrumb surfaces that flow into the editor canvas. */
export const activeEditorSurfaceTokens = [
  "breadcrumb.background",
  "editorGroupHeader.border",
  "editorGroupHeader.tabsBorder",
  "tab.activeBackground",
  "tab.activeBorder",
  "tab.unfocusedActiveBackground",
  "tab.unfocusedActiveBorder",
  "tab.unfocusedActiveBorderTop",
] as const;

/** Text-entry controls that need an outline when OLED surfaces merge to black. */
export const textInputBorderTokens = [
  "agentFeedbackInputWidget.border",
  "agentsChatInput.border",
  "inlineChatInput.border",
  "input.border",
  "panelInput.border",
] as const;

/** OLED-only roles for interactive outlines that must stand out from black. */
export const oledTokenRoleOverrides: Readonly<Record<string, Role>> = {
  "sash.hoverBorder": "rangeBorder",
};

const activeEditorSurfaceRoles = Object.fromEntries(
  activeEditorSurfaceTokens.map((token) => [token, "canvas"] as const),
) as Readonly<Record<(typeof activeEditorSurfaceTokens)[number], Role>>;

/** Explicit assignments for tokens whose names do not describe their visual intent. */
export const tokenRoleOverrides: Readonly<Record<string, Role>> = {
  ...activeEditorSurfaceRoles,
  "tab.activeBorderTop": "accent",
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
  "editor.findMatchBackground": "findMatchActiveBackground",
  "editor.findMatchBorder": "accentBright",
  "editor.findMatchForeground": "findMatchActiveForeground",
  "editor.findMatchHighlightBackground": "selectionBackground",
  "editor.findMatchHighlightBorder": "transparent",
  "editor.findMatchHighlightForeground": "strong",
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
  backdrop?: string,
): string {
  const parsedBackground = parse(background);
  if (!parsedBackground)
    throw new Error(`Invalid paired background: ${background}`);
  const effectiveBackground = (() => {
    if (!backdrop || (parsedBackground.alpha ?? 1) === 1)
      return parsedBackground;
    const foregroundRgb = toRgb(parsedBackground)!;
    const backdropRgb = toRgb(parse(backdrop)!)!;
    const alpha = foregroundRgb.alpha ?? 1;
    return {
      mode: "rgb" as const,
      r: foregroundRgb.r * alpha + backdropRgb.r * (1 - alpha),
      g: foregroundRgb.g * alpha + backdropRgb.g * (1 - alpha),
      b: foregroundRgb.b * alpha + backdropRgb.b * (1 - alpha),
    };
  })();
  const candidates = [palette.onAccent, palette.strong];
  return candidates.reduce((best, candidate) =>
    wcagContrast(parse(candidate)!, effectiveBackground) >
    wcagContrast(parse(best)!, effectiveBackground)
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
// Warm light neutrals carry a small hue; reserve "chromatic" for colors whose
// chroma communicates accent or state rather than paper/surface warmth.
const chromaThreshold: Readonly<Record<ThemeType, number>> = {
  dark: 0.025,
  light: 0.04,
};

export interface ColorClassification {
  readonly kind: "neutral" | "chromatic";
  readonly alpha: number;
  readonly luminance: number;
  readonly lightness: number;
  readonly chroma: number;
  readonly role: Role;
}

/** Scheme-specific neutral ladders prevent light references using dark tiers. */
export const referencePalettes: Record<
  ThemeType,
  Readonly<Record<Role, string>>
> = {
  dark: basePalette,
  light: {
    ...basePalette,
    deepest: "#e4e4e7",
    border: "#d4d4d8",
    chrome: "#e4e4e7",
    canvas: "#f4f4f5",
    surfaceRaised: "#fafafa",
    filter: "#d4d4d8",
    active: "#d4d4d8",
    rangeBorder: "#a1a1aa",
    structuralBorder: "#d4d4d8",
    subtle: "#71717a",
    muted: "#52525b",
    secondary: "#3f3f46",
    normal: "#27272a",
    strong: "#18181b",
    panelTitle: "#27272a",
  },
};

function nearestRole(
  roles: readonly Role[],
  luminance: number,
  referencePalette: Readonly<Record<Role, string>>,
): Role {
  return roles.reduce((closest, role) => {
    const closestDistance = Math.abs(
      wcagLuminance(parse(referencePalette[closest])!) - luminance,
    );
    return Math.abs(wcagLuminance(parse(referencePalette[role])!) - luminance) <
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

function lightNeutralRole(token: string, alpha: number): Role | undefined {
  const lower = token.toLowerCase();
  if (alpha < 1) return undefined;
  const background = lower.includes("background");
  if (!background && (lower.includes("foreground") || lower.includes("text"))) {
    if (lower.includes("disabled")) return "subtle";
    if (
      lower.includes("inactive") ||
      lower.includes("placeholder") ||
      lower.includes("description") ||
      lower.includes("linenumber")
    )
      return "muted";
    return "normal";
  }
  if (lower === "editor.background" || lower === "terminal.background")
    return "canvas";
  if (
    lower.includes("widget.background") ||
    lower === "menu.background" ||
    lower === "dropdown.background"
  )
    return "surfaceRaised";
  if (
    lower === "sidebar.background" ||
    lower.includes("titlebar") ||
    lower.includes("statusbar") ||
    lower.includes("activitybar")
  )
    return "chrome";
  if (lower === "input.background") return "filter";
  return undefined;
}

/** Classify reference paint with Culori; callers retain this in the audit. */
export function classifyReferenceColor(
  token: string,
  value: string,
  scheme: ThemeType = "dark",
): ColorClassification | undefined {
  const color = parse(value);
  if (!color) return undefined;
  const oklch = toOklch(color);
  if (!oklch) return undefined;
  const luminance = wcagLuminance(color);
  const chromatic = (oklch.c ?? 0) >= chromaThreshold[scheme];
  return {
    kind: chromatic ? "chromatic" : "neutral",
    alpha: color.alpha ?? 1,
    luminance,
    lightness: oklch.l,
    chroma: oklch.c ?? 0,
    role: chromatic
      ? chromaticRole(token)
      : ((scheme === "light"
          ? lightNeutralRole(token, color.alpha ?? 1)
          : undefined) ??
        nearestRole(neutralRoles, luminance, referencePalettes[scheme])),
  };
}

/** Map the reference visual type to a Kaia hue or neutral, never its exact RGB. */
export function mapReferenceColor(
  token: string,
  value: string,
  palette: Readonly<Record<Role, string>> = basePalette,
  scheme: ThemeType = "dark",
): string | undefined {
  const classification = classifyReferenceColor(token, value, scheme);
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
  scheme: ThemeType = "dark",
): boolean {
  const reference = classifyReferenceColor(token, referenceValue, scheme);
  const kaia = classifyReferenceColor(token, kaiaValue, scheme);
  if (!reference || !kaia) return false;
  if (alphaClass(reference.alpha) !== alphaClass(kaia.alpha)) return false;
  if (reference.alpha === 0 && kaia.alpha === 0) return true;
  if (reference.kind !== kaia.kind) return false;
  return reference.kind === "chromatic"
    ? true
    : reference.role === kaia.role ||
        luminanceTier(reference.luminance) === luminanceTier(kaia.luminance);
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
