export type ThemeType = "dark" | "light";

export interface VariantDefinition {
  readonly id: "kaia" | "oled";
  readonly label: string;
  readonly themeType: ThemeType;
  readonly uiTheme: "vs" | "vs-dark";
  readonly oled: boolean;
  readonly output: string;
  readonly legacySource: string;
}

/** The single source of truth for generated package themes. */
export const variantDefinitions = [
  {
    id: "kaia",
    label: "Kaia",
    themeType: "dark",
    uiTheme: "vs-dark",
    oled: false,
    output: "themes/kaia.json",
    legacySource: "themes/kaia-old.json",
  },
  {
    id: "oled",
    label: "Kaia OLED",
    themeType: "dark",
    uiTheme: "vs-dark",
    oled: true,
    output: "themes/kaia-oled.json",
    legacySource: "themes/kaia-old.json",
  },
] as const satisfies readonly VariantDefinition[];

export type Variant = (typeof variantDefinitions)[number]["id"];
export const variants = Object.fromEntries(
  variantDefinitions.map((definition) => [definition.id, definition]),
) as Record<Variant, (typeof variantDefinitions)[number]>;
