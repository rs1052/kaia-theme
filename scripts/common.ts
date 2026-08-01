import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parse, printParseErrorCode, type ParseError } from "jsonc-parser";
import {
  resolveReferenceTheme,
  type ResolvedReferenceTheme,
} from "../src/reference.js";

/** Scripts compile to dist/scripts; project artifacts remain at the repository root. */
export const root = new URL("../../", import.meta.url);
export const file = (path: string) => new URL(`../../${path}`, import.meta.url);
export const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(file(path), "utf8")) as T;
/** Read legacy VS Code JSONC in memory. Preserved files are never changed. */
export async function readThemeJsonc<T>(path: string): Promise<T> {
  const errors: ParseError[] = [];
  const value = parse(await readFile(file(path), "utf8"), errors, {
    allowTrailingComma: true,
    disallowComments: false,
  });
  if (errors.length || value === undefined)
    throw new Error(
      `${path}: invalid JSONC (${errors.map(({ error, offset }) => `${printParseErrorCode(error)}@${offset}`).join(", ")})`,
    );
  return value as T;
}
export const stableJson = (value: unknown) =>
  `${JSON.stringify(value, null, 2)}\n`;
export const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export const read2026DarkReference = (): Promise<ResolvedReferenceTheme> =>
  resolveReferenceTheme(fileURLToPath(file("references/2026-dark.json")));
export const read2026LightReference = (): Promise<ResolvedReferenceTheme> =>
  resolveReferenceTheme(fileURLToPath(file("references/2026-light.json")));
