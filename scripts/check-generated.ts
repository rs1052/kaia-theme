import { readFile } from "node:fs/promises";
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
let failed = false;
const packageJson = await readJson<{
  contributes: { themes: { label: string; uiTheme: string; path: string }[] };
}>("package.json");
for (const definition of variantDefinitions) {
  const contribution = packageJson.contributes.themes.find(
    ({ path }) => path === `./${definition.output}`,
  );
  if (
    !contribution ||
    contribution.label !== definition.label ||
    contribution.uiTheme !== definition.uiTheme
  ) {
    console.error(
      `package.json contribution is missing or invalid for ${definition.id}`,
    );
    failed = true;
  }
}
if (packageJson.contributes.themes.length !== variantDefinitions.length + 2) {
  console.error(
    "package.json must retain two legacy entries and every generated variant",
  );
  failed = true;
}
for (const definition of variantDefinitions) {
  const expected = stableJson(
    generateTheme(
      await readThemeJsonc<Theme>(definition.legacySource),
      definition.id,
      inventory.tokens,
      reference,
    ),
  );
  if (expected !== (await readFile(file(definition.output), "utf8"))) {
    console.error(`${definition.output} is stale; run npm run build:themes`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
