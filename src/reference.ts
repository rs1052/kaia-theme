import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { parse, printParseErrorCode, type ParseError } from "jsonc-parser";

export interface ReferenceColor {
  readonly value: string;
  readonly source: string;
}

export interface ResolvedReferenceTheme {
  readonly colors: Readonly<Record<string, ReferenceColor>>;
  readonly sources: readonly string[];
}

export interface MatchedReferenceColor extends ReferenceColor {
  readonly direct: boolean;
  readonly referenceToken: string;
}

interface ReferenceThemeFile {
  readonly include?: string;
  readonly colors?: Record<string, unknown>;
}

function parseTheme(source: string, path: string): ReferenceThemeFile {
  const errors: ParseError[] = [];
  const value = parse(source, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  });
  if (errors.length || !value || typeof value !== "object")
    throw new Error(
      `${path}: invalid JSONC (${errors
        .map(({ error, offset }) => `${printParseErrorCode(error)}@${offset}`)
        .join(", ")})`,
    );
  return value as ReferenceThemeFile;
}

/** Resolve VS Code JSONC theme includes; child colors intentionally win. */
export async function resolveReferenceTheme(
  entry: string,
): Promise<ResolvedReferenceTheme> {
  const entryDirectory = dirname(resolve(entry));
  const colors: Record<string, ReferenceColor> = {};
  const sources: string[] = [];
  const visiting: string[] = [];
  async function visit(path: string): Promise<void> {
    const absolute = resolve(path);
    const cycleAt = visiting.indexOf(absolute);
    if (cycleAt !== -1)
      throw new Error(
        `Reference theme include cycle: ${[...visiting.slice(cycleAt), absolute].join(" -> ")}`,
      );
    visiting.push(absolute);
    let theme: ReferenceThemeFile;
    try {
      theme = parseTheme(await readFile(absolute, "utf8"), absolute);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Unable to read reference theme ${absolute}: ${message}`);
    }
    if (theme.include) {
      if (!theme.include.endsWith(".json"))
        throw new Error(`${absolute}: unsupported include ${theme.include}`);
      await visit(resolve(dirname(absolute), theme.include));
    }
    const source = relative(entryDirectory, absolute).replaceAll("\\", "/");
    for (const [token, value] of Object.entries(theme.colors ?? {}))
      if (typeof value === "string") colors[token] = { value, source };
    sources.push(source);
    visiting.pop();
  }
  await visit(entry);
  return { colors, sources };
}

function firstReference(
  reference: ResolvedReferenceTheme,
  tokens: readonly string[],
): MatchedReferenceColor {
  for (const referenceToken of tokens) {
    const color = reference.colors[referenceToken];
    if (color) return { ...color, direct: false, referenceToken };
  }
  throw new Error(`Reference theme lacks archetypes: ${tokens.join(", ")}`);
}

/**
 * Match tokens absent from 2026 Dark to an explicit 2026 Dark archetype.
 * This keeps every generated token reference-guided without guessing RGB values.
 */
export function matchReferenceColor(
  token: string,
  reference: ResolvedReferenceTheme,
): MatchedReferenceColor {
  const direct = reference.colors[token];
  if (direct) return { ...direct, direct: true, referenceToken: token };

  const lower = token.toLowerCase();
  const negative = /error|invalid|deleted|removed|conflict/.test(lower);
  const positive = /success|added|inserted|untracked/.test(lower);
  const warning = /warning|modified/.test(lower);

  if (lower.includes("background")) {
    if (lower.includes("linebackground") && negative)
      return firstReference(reference, ["diffEditor.removedLineBackground"]);
    if (lower.includes("linebackground") && positive)
      return firstReference(reference, ["diffEditor.insertedLineBackground"]);
    if (negative)
      return firstReference(reference, [
        "inputValidation.errorBackground",
        "diffEditor.removedLineBackground",
      ]);
    if (warning)
      return firstReference(reference, ["inputValidation.warningBackground"]);
    if (positive)
      return firstReference(reference, [
        "diffEditor.insertedLineBackground",
        "list.activeSelectionBackground",
      ]);
    if (/active|focus|selected|selection/.test(lower))
      return firstReference(reference, ["list.activeSelectionBackground"]);
    if (lower.includes("hover"))
      return firstReference(reference, ["list.hoverBackground"]);
    return firstReference(reference, [
      "editorWidget.background",
      "editor.background",
    ]);
  }

  if (lower.includes("foreground") || lower.includes("text")) {
    if (negative)
      return firstReference(reference, [
        "list.errorForeground",
        "errorForeground",
      ]);
    if (warning) return firstReference(reference, ["list.warningForeground"]);
    if (positive)
      return firstReference(reference, [
        "gitDecoration.addedResourceForeground",
      ]);
    if (/disabled|inactive|placeholder|description/.test(lower))
      return firstReference(reference, [
        "descriptionForeground",
        "disabledForeground",
      ]);
    return firstReference(reference, ["foreground", "editor.foreground"]);
  }

  if (/border|outline/.test(lower))
    return /focus|active|selected/.test(lower)
      ? firstReference(reference, ["focusBorder"])
      : firstReference(reference, ["widget.border", "panel.border"]);

  if (lower.includes("shadow"))
    return firstReference(reference, ["scrollbar.shadow"]);
  if (negative)
    return firstReference(reference, [
      "list.errorForeground",
      "errorForeground",
    ]);
  if (warning) return firstReference(reference, ["list.warningForeground"]);
  if (positive)
    return firstReference(reference, ["gitDecoration.addedResourceForeground"]);
  return firstReference(reference, ["foreground", "editor.foreground"]);
}
