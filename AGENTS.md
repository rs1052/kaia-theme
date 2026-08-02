# Repository guide

## Scope and commands

- This is a Node/npm ESM VS Code theme extension; use the checked-in lockfile.
- Run `npm ci` before verification when dependencies are absent.
- `npm run check` is the normal offline-capable full verification command.
- Run the narrowest relevant command first: `test`, `audit:themes`,
  `check:generated`, or `package:vsix` as appropriate.
- `npm run refresh:vscode-reference` is the only network maintenance command.

## Theme generation

- `src/variants.ts` registers generated Kaia and Kaia OLED variants.
- `src/semantic.ts` defines palette roles and token rules; `src/theme.ts`
  assembles generated themes.
- `scripts/build-themes.ts` writes `themes/kaia.json` and
  `themes/kaia-oled.json`; do not edit those generated files by hand.
- `scripts/audit-themes.ts` is the deterministic Culori contrast, coverage, and
  polarity audit. Preserve it as authoritative static evidence.
- The `themes/*-old.json` files are preserved legacy artifacts. Do not format,
  rewrite, or modify them; tests enforce their hashes.
- Review generated reports and theme bytes after source changes.

## Packaging and repository hygiene

- `npm run package:vsix` builds the generated themes and writes an ignored VSIX.
- Keep extension-only contents in the VSIX; update `.vscodeignore` for new local
  tooling or agent documentation.
- Do not add browser artifacts, screenshots, snapshots, generated `dist/`, or
  VSIX files to Git.
- Follow existing Prettier and oxlint style. Keep changes focused and avoid
  unrelated cleanup.

## Browser audit harness

- `npm run audit:browser` runs the repeatable crawl and cleans up; the
  `audit:browser:start|status|stop` commands support adaptive inspection.
- Details and the agent findings format are in `tests/browser-audit/README.md`.
- It is for exploratory Playwright inspection only, not Electron-native tests
  or a committed screenshot baseline.
- Do not make theme-color changes while collecting audit findings.

## Change review

- Do not hand-edit generated themes or alter preserved legacy themes.
- Inspect `git diff` and `npm pack --dry-run` before completing packaging work.
- Report commands run, exact results, changed files, and any remaining risk.
