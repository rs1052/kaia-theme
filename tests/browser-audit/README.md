# Browser audit

This is an exploratory, local code-server harness for inspecting the installed
VSIX with Playwright. It is not Electron-native coverage, a baseline suite, or
an automatic theme-fixing tool. Screenshots and snapshots are disposable local
evidence only.

## Give this file to an agent

The npm commands below only start, inspect, and stop code-server. They do not
perform the adaptive browser audit themselves. `npm run audit:browser` performs
the repeatable crawl described below. Ask a browser-capable agent to review its
report and then follow this file for exploratory coverage, for example:

> Run `npm run audit:browser`, review its report and screenshots, then follow
> `tests/browser-audit/README.md` to inspect any candidate or uncovered state
> with Playwright. Return confirmed findings in the documented format. Do not
> fix theme sources until I approve the findings.

The agent owns the complete lifecycle: run `start`, crawl and measure the UI,
save disposable evidence, report findings in chat, and run `stop` in a `finally`
step even if inspection fails. A human can also use the same checklist for a
manual audit.

## Lifecycle

Docker is required. The harness packages the current extension, installs it in
isolated Docker volumes, copies the fixture into a writable workspace, and waits
for `/healthz`.

```sh
npm run audit:browser
npm run audit:browser:start
npm run audit:browser:status
npm run audit:browser:stop
```

`audit:browser` owns the full lifecycle: it starts a fresh harness, runs the
repeatable Playwright crawl for Kaia and Kaia OLED, writes ignored evidence to
`tests/browser-audit/artifacts/latest/`, and stops the harness in `finally`.
On its first run, it installs the pinned Playwright Chromium build.
Use the lifecycle commands separately for adaptive agent or manual inspection.

The default URL is `http://127.0.0.1:8080`; set `KAIA_AUDIT_PORT` to choose a
different local port. It is deliberately loopback-only. The password printed by
`start` is a fixed local test password, not a secret. `start` replaces any prior
harness container and volumes; `stop` is safe after a failed start and removes
the profile, extensions, and workspace.

## Playwright traversal

Use the available Playwright CLI to sign in, then inspect both **Kaia** and
**Kaia OLED** through **Preferences: Color Theme**. Do not assume the opening
theme is the only installed variant. Save any evidence below
`tests/browser-audit/artifacts/`; it is ignored by Git and the VSIX.

Traverse adaptively rather than relying on brittle selectors. At minimum inspect:

- Explorer, Search, Source Control (the fixture has one changed and one
  untracked file), and Extensions.
- Open tabs, editor gutter/minimap, `App.tsx`, `index.html`, and `styles.css`.
- Selection and Find in the editor; command palette and quick pick.
- Settings, text inputs, buttons, disabled controls, and hover/focus/active and
  selected list states.
- Problems after opening `src/diagnostics.js`, and terminal ANSI output after
  running `node terminal-ansi.mjs`.

`contrast-helper.mjs` exports `scanVisibleContrastCandidates`, a browser-side
function for `page.evaluate(...)`. It composites alpha colors through practical
ancestor backgrounds and returns visible text candidates with WCAG ratios. It
cannot account for pseudo-elements, images, gradients, canvas rendering,
subpixel anti-aliasing, or all VS Code layers. Treat every result as a lead to
verify visually and with the active state; never treat it as ground truth.

Before browser work, run `npm run audit:themes` and retain its static Culori
report as the authoritative deterministic evidence. Record lower browser-side
contrast candidates even if current project policy permits that surface.

For interaction states, capture computed `color`, `backgroundColor`, border,
outline, opacity, and box shadow before and after Playwright `hover()` and
keyboard focus. Check the screenshot as well as the numeric delta: a changed
value can still be imperceptible. Do not demand a hover treatment from disabled
or non-interactive content, and do not report a missing state until the control's
role and active state are confirmed. Use root `--vscode-*` custom properties and
the generated theme JSON to identify likely color tokens; treat Monaco classes
and generated element IDs as unstable implementation details.

## Findings format

For each confirmed issue, record:

```text
severity:
theme:
surface/state:
problem:
measured contrast/state difference:
likely VS Code tokens:
likely source file/symbol:
evidence:
recommendation:
confidence:
```

State the interaction used and whether the value is a helper candidate or a
visual measurement. Do not change theme sources as part of discovery.

## Turning discoveries into repeatable checks

The repeatable crawl is implemented in `audit.mjs`. It recreates known editor,
Find, quick-input, activity-view, Problems, and terminal scenes for both
generated themes. It records workbench token values, visible contrast
candidates, selected hover/focus style deltas, screenshots, `report.json`, and
`report.md`.

The script does not compare against screenshots of the current theme or treat
every candidate as a failing test. It automates known coverage; an agent still
interprets candidates, checks new or subjective states, and proposes fixes for
approval. Extend the script only after an adaptive pass identifies another
stable, valuable interaction.
