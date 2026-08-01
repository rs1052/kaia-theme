export type ThemeType = "dark" | "light";

export interface VariantDefinition {
  readonly id:
    | "kaia"
    | "subtle"
    | "oled"
    | "light"
    | "grayscale"
    | "grayscaleOled"
    | "grayscaleLight";
  readonly label: string;
  readonly themeType: ThemeType;
  readonly uiTheme: "vs" | "vs-dark";
  readonly family: "kaia" | "grayscale";
  readonly oled: boolean;
  readonly output: string;
  readonly legacySource: string;
  readonly reference: "dark" | "light";
}

/** The single source of truth for generated package themes. */
export const variantDefinitions = [
  {
    id: "kaia",
    label: "Kaia",
    themeType: "dark",
    uiTheme: "vs-dark",
    family: "kaia",
    oled: false,
    output: "themes/kaia.json",
    legacySource: "themes/kaia-old.json",
    reference: "dark",
  },
  {
    id: "subtle",
    label: "Kaia Subtle",
    themeType: "dark",
    uiTheme: "vs-dark",
    family: "kaia",
    oled: false,
    output: "themes/kaia-subtle.json",
    legacySource: "themes/kaia-old.json",
    reference: "dark",
  },
  {
    id: "oled",
    label: "Kaia OLED",
    themeType: "dark",
    uiTheme: "vs-dark",
    family: "kaia",
    oled: true,
    output: "themes/kaia-oled.json",
    legacySource: "themes/kaia-old.json",
    reference: "dark",
  },
  {
    id: "light",
    label: "Kaia Light",
    themeType: "light",
    uiTheme: "vs",
    family: "kaia",
    oled: false,
    output: "themes/kaia-light.json",
    legacySource: "themes/kaia-old.json",
    reference: "light",
  },
  {
    id: "grayscale",
    label: "Kaia Grayscale",
    themeType: "dark",
    uiTheme: "vs-dark",
    family: "grayscale",
    oled: false,
    output: "themes/kaia-grayscale.json",
    legacySource: "themes/kaia-old.json",
    reference: "dark",
  },
  {
    id: "grayscaleOled",
    label: "Kaia Grayscale OLED",
    themeType: "dark",
    uiTheme: "vs-dark",
    family: "grayscale",
    oled: true,
    output: "themes/kaia-grayscale-oled.json",
    legacySource: "themes/kaia-old.json",
    reference: "dark",
  },
  {
    id: "grayscaleLight",
    label: "Kaia Grayscale Light",
    themeType: "light",
    uiTheme: "vs",
    family: "grayscale",
    oled: false,
    output: "themes/kaia-grayscale-light.json",
    legacySource: "themes/kaia-old.json",
    reference: "light",
  },
] as const satisfies readonly VariantDefinition[];

export type Variant = (typeof variantDefinitions)[number]["id"];
export const variants = Object.fromEntries(
  variantDefinitions.map((definition) => [definition.id, definition]),
) as Record<Variant, (typeof variantDefinitions)[number]>;
