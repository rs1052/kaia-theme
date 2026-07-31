import { readFile } from "node:fs/promises";
import { generateTheme, type Theme } from "../src/theme.js";
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
for (const [variant, oldPath, output] of [
  ["kaia", "themes/kaia-old.json", "themes/kaia.json"],
  ["subtle", "themes/kaia-old.json", "themes/kaia-subtle.json"],
  ["oled", "themes/kaia-old.json", "themes/kaia-oled.json"],
] as const) {
  const expected = stableJson(
    generateTheme(
      await readThemeJsonc<Theme>(oldPath),
      variant,
      inventory.tokens,
      reference,
    ),
  );
  if (expected !== (await readFile(file(output), "utf8"))) {
    console.error(`${output} is stale; run npm run build:themes`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
