import { mkdir, writeFile } from "node:fs/promises";
import { generateTheme, type Theme } from "../src/theme.js";
import { variantDefinitions } from "../src/variants.js";
import {
  file,
  read2026DarkReference,
  readJson,
  readThemeJsonc,
  stableJson,
} from "./common.js";

const inventory = await readJson<{ tokens: string[] }>(
  "references/vscode-1.130.0-workbench-colors.json",
);
const reference = await read2026DarkReference();
await mkdir(file("themes"), { recursive: true });
for (const definition of variantDefinitions) {
  const legacy = await readThemeJsonc<Theme>(definition.legacySource);
  await writeFile(
    file(definition.output),
    stableJson(
      generateTheme(legacy, definition.id, inventory.tokens, reference),
    ),
  );
}
