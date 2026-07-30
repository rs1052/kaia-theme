/** Network-only maintenance command. Normal builds read the committed snapshot. */
import { execFileSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { file, stableJson } from "./common.js";

const tag = "1.130.0";
const directory = await mkdtemp(join(tmpdir(), "kaia-vscode-"));
const files: string[] = [];
async function collect(path: string): Promise<void> {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isDirectory()) await collect(join(path, entry.name));
    else if (entry.name.endsWith(".ts")) files.push(join(path, entry.name));
  }
}
try {
  execFileSync(
    "git",
    [
      "clone",
      "--depth",
      "1",
      "--branch",
      tag,
      "https://github.com/microsoft/vscode.git",
      directory,
    ],
    { stdio: "inherit" },
  );
  await collect(join(directory, "src", "vs"));
  const sources = await Promise.all(
    files.map((path) => readFile(path, "utf8")),
  );
  const tokens = [
    ...new Set(
      sources.flatMap((source) =>
        [...source.matchAll(/registerColor\(\s*['"]([^'"]+)['"]/g)].map(
          (match) => match[1],
        ),
      ),
    ),
  ].sort();
  const commit = execFileSync("git", ["-C", directory, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  await mkdir(file("references"), { recursive: true });
  await writeFile(
    file("references/vscode-1.130.0-workbench-colors.json"),
    stableJson({
      vscode: {
        tag,
        commit,
        source: "https://github.com/microsoft/vscode",
        extractor: "registerColor() TypeScript registrations",
      },
      tokens,
      manualResolutions: {
        "editor.semanticHighlighting.enabled":
          "configuration setting, not a workbench color",
        "terminal.ansi*": "registered colors extracted normally",
      },
    }),
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
