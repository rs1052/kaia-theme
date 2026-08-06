# Repository guide

## JSON-only extension

- This extension contains only manifest, theme JSON, documentation, images, and license notices.
- Keep maintained theme files strict JSON. Do not add generators, dependencies, build scripts, tests, reports, or CI. The dependency-free `package:vsix` and `install:vsix` scripts are the sole packaging conveniences.
- `themes/kaia-old.json` and `themes/kaia-subtle-old.json` are byte-preserved legacy JSONC files; do not format or edit them.

## Theme maintenance

- Maintain `kaia.json` and `kaia-oled.json` directly. They are flattened Dark 2026-derived variants.
- The Dark 2026 variants are flattened from VS Code 1.132.0 commit
  `df53daabb18cd157bdb08c7f01c34df936cf12f4`; retain the notice in
  `THIRD_PARTY_NOTICES.md` when updating them.

## Packaging and repository hygiene

- Run `npm run package:vsix` to create the ignored local VSIX.
- Run `npm run install:vsix` to package and force-install it through the VS Code CLI.
- Keep extension-only contents in the VSIX and exclude agent instructions and local dependencies.
- Do not add temporary captures, snapshots, generated output, or VSIX files to Git.

## Change review

- Inspect `git diff` and `npm pack --dry-run` before completing packaging work.
- Report commands run, exact results, changed files, and any remaining risk.
