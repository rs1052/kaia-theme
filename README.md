# Kaia for Visual Studio Code

A Monokai-inspired theme for Visual Studio Code with a focus on accessible contrast ratios.

**Kaia**

![Kaia Theme](images/kaia-theme.png)

**Kaia Subtle**

![Kaia Subtle Theme](images/kaia-subtle-theme.png)

## Installation

1.  In Visual Studio Code, search for `Kaia` in the extensions side bar and install it.
1.  Click **Reload** to reload Visual Studio Code to make the extension available.
1.  From the gear menu or the Show All Commands (CTRL + SHIFT + P) menu select: Color Theme > **Kaia**.

## Theme variants

- **Kaia** and **Kaia Subtle** are generated dark themes.
- **Kaia - Old** and **Kaia Subtle - Old** retain the original extension theme bytes for comparison and rollback.

## Development

The generated themes are derived from typed hexadecimal semantic roles in `src/` and a committed VS Code 1.130.0 workbench-color inventory. `culori` validates color parsing and WCAG contrast in the audit.

```sh
npm ci
npm run check
```

`npm run build:themes` deterministically writes the committed generated themes. Do not edit those JSON files by hand. `npm run audit:themes` writes the committed generated audit report and checks contrast, coverage, and dark-theme polarity. Normal build/check commands use only committed inputs and are offline-capable.

`npm run refresh:vscode-reference` is the explicit network-only maintenance command. It clones the pinned `1.130.0` VS Code tag, extracts `registerColor()` registrations, and updates `references/vscode-1.130.0-workbench-colors.json`. Review the resulting inventory before committing an intentional refresh.

The legacy files are parsed in memory as JSONC because VS Code color themes permit comments and trailing commas. They are never formatted or rewritten.
