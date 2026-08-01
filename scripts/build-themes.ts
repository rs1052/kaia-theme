import { mkdir, writeFile } from "node:fs/promises";
import { generateTheme, type Theme } from "../src/theme.js";
import { variantDefinitions } from "../src/variants.js";
import {
  file,
  read2026DarkReference,
  read2026LightReference,
  readJson,
  readThemeJsonc,
  stableJson,
} from "./common.js";

const inventory = await readJson<{ tokens: string[] }>(
  "references/vscode-1.130.0-workbench-colors.json",
);
const references = {
  dark: await read2026DarkReference(),
  light: await read2026LightReference(),
};
await mkdir(file("themes"), { recursive: true });
for (const definition of variantDefinitions) {
  const legacy = await readThemeJsonc<Theme>(definition.legacySource);
  await writeFile(
    file(definition.output),
    stableJson(
      generateTheme(
        legacy,
        definition.id,
        inventory.tokens,
        references[definition.reference],
      ),
    ),
  );
}
