import { mkdir, writeFile } from "node:fs/promises";
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
const builds = [
  ["kaia", "themes/kaia-old.json", "themes/kaia.json"],
  ["subtle", "themes/kaia-old.json", "themes/kaia-subtle.json"],
] as const;
await mkdir(file("themes"), { recursive: true });
for (const [variant, input, output] of builds) {
  const legacy = await readThemeJsonc<Theme>(input);
  await writeFile(
    file(output),
    stableJson(generateTheme(legacy, variant, inventory.tokens, reference)),
  );
}
