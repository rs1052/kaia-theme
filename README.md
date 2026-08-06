# Kaia for Visual Studio Code

A collection of dark Kaia color themes for Visual Studio Code.

## Theme variants

1. **Kaia** — derived from VS Code Dark 2026 with grayscale surfaces and Kaia syntax.
2. **Kaia OLED** — derived from VS Code Dark 2026 with black surfaces and Kaia syntax.
3. **Kaia - Old** — preserved for historical comparison.
4. **Kaia Subtle - Old** — preserved for historical comparison.

## Installation

1.  In Visual Studio Code, search for `Kaia` in the extensions side bar and install it.
1.  Click **Reload** to reload Visual Studio Code to make the extension available.
1.  From the gear menu or the Show All Commands (CTRL + SHIFT + P) menu select: Color Theme > **Kaia**.

### Test locally

With the Visual Studio Code `code` command available, package and force-install the extension for local testing:

```sh
npm run install:vsix
```

Use `npm run package:vsix` when you only want to create the VSIX. Reload Visual Studio Code when prompted, then use **Preferences: Color Theme** to select a variant. The packaging command runs `vsce` through `npx`; the extension has no build step or committed development dependencies.

## Maintenance

The `kaia.json` and `kaia-oled.json` theme files are maintained directly. Do not reformat or modify the preserved `kaia-old.json` and `kaia-subtle-old.json` files.

`kaia.json` and `kaia-oled.json` flatten the VS Code 1.132.0 Dark 2026 include chain (`dark_vs` → `dark_plus` → `dark_modern` → `2026-dark`) from commit [`df53daabb18cd157bdb08c7f01c34df936cf12f4`](https://github.com/microsoft/vscode/tree/df53daabb18cd157bdb08c7f01c34df936cf12f4). Microsoft source material is acknowledged in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

When changing a theme, parse maintained themes as strict JSON, validate the two preserved `*-old.json` JSONC files with a VS Code-compatible parser, and inspect a locally installed VSIX before publishing.
