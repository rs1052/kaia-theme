# Kaia Theme Window Tints

Eight color variants for the [Kaia OLED](https://github.com/rs1052/kaia-theme-vscode) VS Code theme, designed to subtly tint each window so you can tell workspaces apart at a glance.

Surfaces sit very close to Kaia's original near-black values with only a slight hue shift. Accents, badges, focus rings, links, and find matches stay vibrant.

## Usage

Copy the `workbench.colorCustomizations` block into your user `settings.json` (or a per-profile / per-workspace `settings.json`). The `[Kaia OLED]` scope means the overrides only apply when the Kaia theme is active.

---

## 1. Tidal — Teal and Seafoam

Base `#006D77` · Accent `#83C5BE` · Highlight `#FFDDD2`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#0D1112",
    "editorGutter.background": "#0D1112",
    "editorStickyScroll.background": "#0D1112",
    "breadcrumb.background": "#0D1112",
    "tab.activeBackground": "#0D1112",
    "tab.activeBorder": "#0D1112",
    "tab.hoverBackground": "#0D1112",
    "agents.background": "#0D1112",

    "activityBar.background": "#121819",
    "sideBar.background": "#121819",
    "sideBarSectionHeader.background": "#121819",
    "statusBar.background": "#121819",
    "statusBar.noFolderBackground": "#121819",
    "titleBar.activeBackground": "#121819",
    "titleBar.inactiveBackground": "#121819",
    "panel.background": "#121819",
    "terminal.background": "#121819",
    "tab.inactiveBackground": "#121819",
    "editorGroupHeader.tabsBackground": "#121819",
    "commandCenter.background": "#121819",
    "agentsPanel.background": "#121819",
    "surface.background": "#121819",

    "editorWidget.background": "#192122",
    "notifications.background": "#192122",
    "quickInput.background": "#192122",
    "menu.background": "#192122",
    "agentsChatInput.background": "#192122",
    "tab.selectedBackground": "#2C3837",

    "activityBar.border": "#233234",
    "sideBar.border": "#233234",
    "panel.border": "#233234",
    "titleBar.border": "#233234",
    "editorGroupHeader.tabsBorder": "#233234",
    "editorGroup.border": "#233234",
    "tab.border": "#233234",
    "statusBar.border": "#233234",
    "input.border": "#2C4043",

    "editor.selectionBackground": "#83C5BE38",
    "editor.inactiveSelectionBackground": "#83C5BE20",
    "editor.selectionHighlightBackground": "#83C5BE26",
    "editor.findMatchBackground": "#FFDDD259",
    "editor.findMatchHighlightBackground": "#FFDDD233",
    "list.activeSelectionBackground": "#83C5BE29",
    "list.hoverBackground": "#83C5BE14",
    "terminal.selectionBackground": "#83C5BE38",

    "activityBar.activeBorder": "#83C5BE",
    "activityBarTop.activeBorder": "#83C5BE",
    "activityBarBadge.background": "#FFDDD2",
    "activityBarBadge.foreground": "#15211F",
    "badge.background": "#FFDDD2",
    "badge.foreground": "#15211F",
    "focusBorder": "#FFDDD2B3",
    "list.focusOutline": "#FFDDD2B3",
    "statusBar.focusBorder": "#FFDDD2B3",
    "statusBarItem.focusBorder": "#FFDDD2B3",
    "agentsChatInput.focusBorder": "#FFDDD2B3",
    "progressBar.background": "#83C5BE",
    "tab.activeBorderTop": "#83C5BE",
    "tab.selectedBorderTop": "#FFDDD2",
    "panelTitle.activeBorder": "#83C5BE",
    "textLink.foreground": "#83C5BE",
    "textLink.activeForeground": "#FFDDD2",
    "notificationLink.foreground": "#83C5BE",
    "list.highlightForeground": "#83C5BE",
    "menu.selectionBorder": "#83C5BE",
    "commandCenter.activeBorder": "#83C5BE",
    "inputOption.activeBorder": "#83C5BE",
    "button.background": "#1D4448",
    "button.border": "#83C5BE80",
    "button.foreground": "#B8F0E9",
    "button.hoverBackground": "#255A5F",
    "statusBarItem.remoteBackground": "#1D4448",
    "statusBarItem.remoteForeground": "#B8F0E9",
    "statusBar.debuggingBackground": "#1D4448",
    "statusBar.debuggingForeground": "#B8F0E9",
    "statusBarItem.prominentBackground": "#1D4448",
    "statusBarItem.prominentForeground": "#B8F0E9",
    "quickInputList.focusBackground": "#1D4448",
    "quickInputList.focusForeground": "#B8F0E9",
    "quickInputList.focusIconForeground": "#83C5BE",
    "chat.slashCommandBackground": "#1D4448",
    "chat.slashCommandForeground": "#83C5BE",
    "extensionButton.prominentBackground": "#1D4448",
    "extensionButton.prominentForeground": "#B8F0E9",
    "extensionButton.prominentHoverBackground": "#255A5F"
  }
}
```

</details>

---

## 2. Canopy — Olive and Warm Ochre

Base `#606C38` · Accent `#DDA15E` · Highlight `#FEFAE0`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#10120C",
    "editorGutter.background": "#10120C",
    "editorStickyScroll.background": "#10120C",
    "breadcrumb.background": "#10120C",
    "tab.activeBackground": "#10120C",
    "tab.activeBorder": "#10120C",
    "tab.hoverBackground": "#10120C",
    "agents.background": "#10120C",

    "activityBar.background": "#161810",
    "sideBar.background": "#161810",
    "sideBarSectionHeader.background": "#161810",
    "statusBar.background": "#161810",
    "statusBar.noFolderBackground": "#161810",
    "titleBar.activeBackground": "#161810",
    "titleBar.inactiveBackground": "#161810",
    "panel.background": "#161810",
    "terminal.background": "#161810",
    "tab.inactiveBackground": "#161810",
    "editorGroupHeader.tabsBackground": "#161810",
    "commandCenter.background": "#161810",
    "agentsPanel.background": "#161810",
    "surface.background": "#161810",

    "editorWidget.background": "#1D2016",
    "notifications.background": "#1D2016",
    "quickInput.background": "#1D2016",
    "menu.background": "#1D2016",
    "agentsChatInput.background": "#1D2016",
    "tab.selectedBackground": "#333726",

    "activityBar.border": "#2C2F1C",
    "sideBar.border": "#2C2F1C",
    "panel.border": "#2C2F1C",
    "titleBar.border": "#2C2F1C",
    "editorGroupHeader.tabsBorder": "#2C2F1C",
    "editorGroup.border": "#2C2F1C",
    "tab.border": "#2C2F1C",
    "statusBar.border": "#2C2F1C",
    "input.border": "#3A3E25",

    "editor.selectionBackground": "#889B4E40",
    "editor.inactiveSelectionBackground": "#889B4E24",
    "editor.selectionHighlightBackground": "#889B4E2B",
    "editor.findMatchBackground": "#FEFAE059",
    "editor.findMatchHighlightBackground": "#DDA15E3A",
    "list.activeSelectionBackground": "#889B4E33",
    "list.hoverBackground": "#DDA15E14",
    "terminal.selectionBackground": "#889B4E40",

    "activityBar.activeBorder": "#DDA15E",
    "activityBarTop.activeBorder": "#DDA15E",
    "activityBarBadge.background": "#DDA15E",
    "activityBarBadge.foreground": "#1E1A11",
    "badge.background": "#DDA15E",
    "badge.foreground": "#1E1A11",
    "focusBorder": "#FEFAE0B3",
    "list.focusOutline": "#FEFAE0B3",
    "statusBar.focusBorder": "#FEFAE0B3",
    "statusBarItem.focusBorder": "#FEFAE0B3",
    "agentsChatInput.focusBorder": "#FEFAE0B3",
    "progressBar.background": "#DDA15E",
    "tab.activeBorderTop": "#DDA15E",
    "tab.selectedBorderTop": "#FEFAE0",
    "panelTitle.activeBorder": "#DDA15E",
    "textLink.foreground": "#DDA15E",
    "textLink.activeForeground": "#FEFAE0",
    "notificationLink.foreground": "#DDA15E",
    "list.highlightForeground": "#DDA15E",
    "menu.selectionBorder": "#DDA15E",
    "commandCenter.activeBorder": "#DDA15E",
    "inputOption.activeBorder": "#DDA15E",
    "button.background": "#3F4222",
    "button.border": "#DDA15E80",
    "button.foreground": "#FEFAE0",
    "button.hoverBackground": "#53572D",
    "statusBarItem.remoteBackground": "#3F4222",
    "statusBarItem.remoteForeground": "#FFD9A0",
    "statusBar.debuggingBackground": "#3F4222",
    "statusBar.debuggingForeground": "#FFD9A0",
    "statusBarItem.prominentBackground": "#3F4222",
    "statusBarItem.prominentForeground": "#FFD9A0",
    "quickInputList.focusBackground": "#3F4222",
    "quickInputList.focusForeground": "#FEFAE0",
    "quickInputList.focusIconForeground": "#DDA15E",
    "chat.slashCommandBackground": "#3F4222",
    "chat.slashCommandForeground": "#DDA15E",
    "extensionButton.prominentBackground": "#3F4222",
    "extensionButton.prominentForeground": "#FEFAE0",
    "extensionButton.prominentHoverBackground": "#53572D"
  }
}
```

</details>

---

## 3. Nebula — Violet and Lavender

Base `#5A189A` · Accent `#C77DFF` · Highlight `#E0AAFF`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#000000",
    "editorGutter.background": "#000000",
    "editorStickyScroll.background": "#000000",
    "breadcrumb.background": "#000000",
    "tab.activeBackground": "#000000",
    "tab.activeBorder": "#000000",
    "tab.hoverBackground": "#000000",
    "agents.background": "#000000",

    "activityBar.background": "#161319",
    "sideBar.background": "#161319",
    "sideBarSectionHeader.background": "#161319",
    "statusBar.background": "#161319",
    "statusBar.noFolderBackground": "#161319",
    "titleBar.activeBackground": "#161319",
    "titleBar.inactiveBackground": "#161319",
    "panel.background": "#161319",
    "terminal.background": "#161319",
    "tab.inactiveBackground": "#161319",
    "editorGroupHeader.tabsBackground": "#161319",
    "commandCenter.background": "#161319",
    "agentsPanel.background": "#161319",
    "surface.background": "#161319",

    "editorWidget.background": "#1E1A24",
    "notifications.background": "#1E1A24",
    "quickInput.background": "#1E1A24",
    "menu.background": "#1E1A24",
    "agentsChatInput.background": "#1E1A24",
    "tab.selectedBackground": "#342D3E",

    "activityBar.border": "#2C2534",
    "sideBar.border": "#2C2534",
    "panel.border": "#2C2534",
    "titleBar.border": "#2C2534",
    "editorGroupHeader.tabsBorder": "#2C2534",
    "editorGroup.border": "#2C2534",
    "tab.border": "#2C2534",
    "statusBar.border": "#2C2534",
    "input.border": "#392F42",

    "editor.selectionBackground": "#9D4EDD3D",
    "editor.inactiveSelectionBackground": "#9D4EDD24",
    "editor.selectionHighlightBackground": "#9D4EDD2B",
    "editor.findMatchBackground": "#E0AAFF59",
    "editor.findMatchHighlightBackground": "#C77DFF3A",
    "list.activeSelectionBackground": "#9D4EDD33",
    "list.hoverBackground": "#C77DFF15",
    "terminal.selectionBackground": "#9D4EDD3D",

    "activityBar.activeBorder": "#C77DFF",
    "activityBarTop.activeBorder": "#C77DFF",
    "activityBarBadge.background": "#C77DFF",
    "activityBarBadge.foreground": "#1B1023",
    "badge.background": "#C77DFF",
    "badge.foreground": "#1B1023",
    "focusBorder": "#E0AAFFB3",
    "list.focusOutline": "#E0AAFFB3",
    "statusBar.focusBorder": "#E0AAFFB3",
    "statusBarItem.focusBorder": "#E0AAFFB3",
    "agentsChatInput.focusBorder": "#E0AAFFB3",
    "progressBar.background": "#C77DFF",
    "tab.activeBorderTop": "#C77DFF",
    "tab.selectedBorderTop": "#E0AAFF",
    "panelTitle.activeBorder": "#C77DFF",
    "textLink.foreground": "#C77DFF",
    "textLink.activeForeground": "#E0AAFF",
    "notificationLink.foreground": "#C77DFF",
    "list.highlightForeground": "#C77DFF",
    "menu.selectionBorder": "#C77DFF",
    "commandCenter.activeBorder": "#C77DFF",
    "inputOption.activeBorder": "#C77DFF",
    "button.background": "#3B1A50",
    "button.border": "#C77DFF80",
    "button.foreground": "#EFDCFF",
    "button.hoverBackground": "#4E2469",
    "statusBarItem.remoteBackground": "#3B1A50",
    "statusBarItem.remoteForeground": "#E0AAFF",
    "statusBar.debuggingBackground": "#3B1A50",
    "statusBar.debuggingForeground": "#E0AAFF",
    "statusBarItem.prominentBackground": "#3B1A50",
    "statusBarItem.prominentForeground": "#E0AAFF",
    "quickInputList.focusBackground": "#3B1A50",
    "quickInputList.focusForeground": "#EFDCFF",
    "quickInputList.focusIconForeground": "#C77DFF",
    "chat.slashCommandBackground": "#3B1A50",
    "chat.slashCommandForeground": "#C77DFF",
    "extensionButton.prominentBackground": "#3B1A50",
    "extensionButton.prominentForeground": "#EFDCFF",
    "extensionButton.prominentHoverBackground": "#4E2469",
  },
}
```

</details>

---

## 5. Ember — Burnt Orange and Amber

Base `#FF6D00` · Accent `#FF9E00` · Highlight `#FFB600`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#130F0C",
    "editorGutter.background": "#130F0C",
    "editorStickyScroll.background": "#130F0C",
    "breadcrumb.background": "#130F0C",
    "tab.activeBackground": "#130F0C",
    "tab.activeBorder": "#130F0C",
    "tab.hoverBackground": "#130F0C",
    "agents.background": "#130F0C",

    "activityBar.background": "#191511",
    "sideBar.background": "#191511",
    "sideBarSectionHeader.background": "#191511",
    "statusBar.background": "#191511",
    "statusBar.noFolderBackground": "#191511",
    "titleBar.activeBackground": "#191511",
    "titleBar.inactiveBackground": "#191511",
    "panel.background": "#191511",
    "terminal.background": "#191511",
    "tab.inactiveBackground": "#191511",
    "editorGroupHeader.tabsBackground": "#191511",
    "commandCenter.background": "#191511",
    "agentsPanel.background": "#191511",
    "surface.background": "#191511",

    "editorWidget.background": "#211B15",
    "notifications.background": "#211B15",
    "quickInput.background": "#211B15",
    "menu.background": "#211B15",
    "agentsChatInput.background": "#211B15",
    "tab.selectedBackground": "#3C3022",

    "activityBar.border": "#33291D",
    "sideBar.border": "#33291D",
    "panel.border": "#33291D",
    "titleBar.border": "#33291D",
    "editorGroupHeader.tabsBorder": "#33291D",
    "editorGroup.border": "#33291D",
    "tab.border": "#33291D",
    "statusBar.border": "#33291D",
    "input.border": "#413324",

    "editor.selectionBackground": "#FF790036",
    "editor.inactiveSelectionBackground": "#FF790020",
    "editor.selectionHighlightBackground": "#FF790028",
    "editor.findMatchBackground": "#FFB6005E",
    "editor.findMatchHighlightBackground": "#FF9E003A",
    "list.activeSelectionBackground": "#FF790030",
    "list.hoverBackground": "#FF9E0014",
    "terminal.selectionBackground": "#FF790036",

    "activityBar.activeBorder": "#FF9E00",
    "activityBarTop.activeBorder": "#FF9E00",
    "activityBarBadge.background": "#FFB600",
    "activityBarBadge.foreground": "#24190B",
    "badge.background": "#FFB600",
    "badge.foreground": "#24190B",
    "focusBorder": "#FFB600B3",
    "list.focusOutline": "#FFB600B3",
    "statusBar.focusBorder": "#FFB600B3",
    "statusBarItem.focusBorder": "#FFB600B3",
    "agentsChatInput.focusBorder": "#FFB600B3",
    "progressBar.background": "#FF9E00",
    "tab.activeBorderTop": "#FF9E00",
    "tab.selectedBorderTop": "#FFB600",
    "panelTitle.activeBorder": "#FF9E00",
    "textLink.foreground": "#FF9E00",
    "textLink.activeForeground": "#FFB600",
    "notificationLink.foreground": "#FF9E00",
    "list.highlightForeground": "#FF9E00",
    "menu.selectionBorder": "#FF9E00",
    "commandCenter.activeBorder": "#FF9E00",
    "inputOption.activeBorder": "#FF9E00",
    "button.background": "#522C0E",
    "button.border": "#FF9E0080",
    "button.foreground": "#FFE7BF",
    "button.hoverBackground": "#6B3A14",
    "statusBarItem.remoteBackground": "#522C0E",
    "statusBarItem.remoteForeground": "#FFC94D",
    "statusBar.debuggingBackground": "#522C0E",
    "statusBar.debuggingForeground": "#FFC94D",
    "statusBarItem.prominentBackground": "#522C0E",
    "statusBarItem.prominentForeground": "#FFC94D",
    "quickInputList.focusBackground": "#522C0E",
    "quickInputList.focusForeground": "#FFE7BF",
    "quickInputList.focusIconForeground": "#FF9E00",
    "chat.slashCommandBackground": "#522C0E",
    "chat.slashCommandForeground": "#FF9E00",
    "extensionButton.prominentBackground": "#522C0E",
    "extensionButton.prominentForeground": "#FFE7BF",
    "extensionButton.prominentHoverBackground": "#6B3A14"
  }
}
```

</details>

---

## 6. Azure — Deep Blue and Cyan

Base `#0077B6` · Accent `#48CAE4` · Highlight `#90E0EF`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#0C1013",
    "editorGutter.background": "#0C1013",
    "editorStickyScroll.background": "#0C1013",
    "breadcrumb.background": "#0C1013",
    "tab.activeBackground": "#0C1013",
    "tab.activeBorder": "#0C1013",
    "tab.hoverBackground": "#0C1013",
    "agents.background": "#0C1013",

    "activityBar.background": "#12181C",
    "sideBar.background": "#12181C",
    "sideBarSectionHeader.background": "#12181C",
    "statusBar.background": "#12181C",
    "statusBar.noFolderBackground": "#12181C",
    "titleBar.activeBackground": "#12181C",
    "titleBar.inactiveBackground": "#12181C",
    "panel.background": "#12181C",
    "terminal.background": "#12181C",
    "tab.inactiveBackground": "#12181C",
    "editorGroupHeader.tabsBackground": "#12181C",
    "commandCenter.background": "#12181C",
    "agentsPanel.background": "#12181C",
    "surface.background": "#12181C",

    "editorWidget.background": "#192126",
    "notifications.background": "#192126",
    "quickInput.background": "#192126",
    "menu.background": "#192126",
    "agentsChatInput.background": "#192126",
    "tab.selectedBackground": "#2C3941",

    "activityBar.border": "#222E36",
    "sideBar.border": "#222E36",
    "panel.border": "#222E36",
    "titleBar.border": "#222E36",
    "editorGroupHeader.tabsBorder": "#222E36",
    "editorGroup.border": "#222E36",
    "tab.border": "#222E36",
    "statusBar.border": "#222E36",
    "input.border": "#2B3B45",

    "editor.selectionBackground": "#00B4D838",
    "editor.inactiveSelectionBackground": "#00B4D822",
    "editor.selectionHighlightBackground": "#00B4D828",
    "editor.findMatchBackground": "#90E0EF59",
    "editor.findMatchHighlightBackground": "#48CAE43A",
    "list.activeSelectionBackground": "#00B4D830",
    "list.hoverBackground": "#48CAE414",
    "terminal.selectionBackground": "#00B4D838",

    "activityBar.activeBorder": "#48CAE4",
    "activityBarTop.activeBorder": "#48CAE4",
    "activityBarBadge.background": "#48CAE4",
    "activityBarBadge.foreground": "#0F212A",
    "badge.background": "#48CAE4",
    "badge.foreground": "#0F212A",
    "focusBorder": "#90E0EFB3",
    "list.focusOutline": "#90E0EFB3",
    "statusBar.focusBorder": "#90E0EFB3",
    "statusBarItem.focusBorder": "#90E0EFB3",
    "agentsChatInput.focusBorder": "#90E0EFB3",
    "progressBar.background": "#48CAE4",
    "tab.activeBorderTop": "#48CAE4",
    "tab.selectedBorderTop": "#90E0EF",
    "panelTitle.activeBorder": "#48CAE4",
    "textLink.foreground": "#48CAE4",
    "textLink.activeForeground": "#90E0EF",
    "notificationLink.foreground": "#48CAE4",
    "list.highlightForeground": "#48CAE4",
    "menu.selectionBorder": "#48CAE4",
    "commandCenter.activeBorder": "#48CAE4",
    "inputOption.activeBorder": "#48CAE4",
    "button.background": "#10435A",
    "button.border": "#48CAE480",
    "button.foreground": "#D6F5FC",
    "button.hoverBackground": "#155A76",
    "statusBarItem.remoteBackground": "#10435A",
    "statusBarItem.remoteForeground": "#90E0EF",
    "statusBar.debuggingBackground": "#10435A",
    "statusBar.debuggingForeground": "#90E0EF",
    "statusBarItem.prominentBackground": "#10435A",
    "statusBarItem.prominentForeground": "#90E0EF",
    "quickInputList.focusBackground": "#10435A",
    "quickInputList.focusForeground": "#D6F5FC",
    "quickInputList.focusIconForeground": "#48CAE4",
    "chat.slashCommandBackground": "#10435A",
    "chat.slashCommandForeground": "#48CAE4",
    "extensionButton.prominentBackground": "#10435A",
    "extensionButton.prominentForeground": "#D6F5FC",
    "extensionButton.prominentHoverBackground": "#155A76"
  }
}
```

</details>

---

## 7. Graphite — Silver and Signal Yellow

Base `#161616` · Accent `#FFD60A` · Highlight `#FFE566`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#101010",
    "editorGutter.background": "#101010",
    "editorStickyScroll.background": "#101010",
    "breadcrumb.background": "#101010",
    "tab.activeBackground": "#101010",
    "tab.activeBorder": "#101010",
    "tab.hoverBackground": "#101010",
    "agents.background": "#101010",

    "activityBar.background": "#161616",
    "sideBar.background": "#161616",
    "sideBarSectionHeader.background": "#161616",
    "statusBar.background": "#161616",
    "statusBar.noFolderBackground": "#161616",
    "titleBar.activeBackground": "#161616",
    "titleBar.inactiveBackground": "#161616",
    "panel.background": "#161616",
    "terminal.background": "#161616",
    "tab.inactiveBackground": "#161616",
    "editorGroupHeader.tabsBackground": "#161616",
    "commandCenter.background": "#161616",
    "agentsPanel.background": "#161616",
    "surface.background": "#161616",

    "editorWidget.background": "#1E1E1E",
    "notifications.background": "#1E1E1E",
    "quickInput.background": "#1E1E1E",
    "menu.background": "#1E1E1E",
    "agentsChatInput.background": "#1E1E1E",
    "tab.selectedBackground": "#353535",

    "activityBar.border": "#2B2B2B",
    "sideBar.border": "#2B2B2B",
    "panel.border": "#2B2B2B",
    "titleBar.border": "#2B2B2B",
    "editorGroupHeader.tabsBorder": "#2B2B2B",
    "editorGroup.border": "#2B2B2B",
    "tab.border": "#2B2B2B",
    "statusBar.border": "#2B2B2B",
    "input.border": "#373737",

    "editor.selectionBackground": "#C8C8C838",
    "editor.inactiveSelectionBackground": "#C8C8C822",
    "editor.selectionHighlightBackground": "#D8D8D826",
    "editor.findMatchBackground": "#FFD60A5E",
    "editor.findMatchHighlightBackground": "#FFD60A38",
    "list.activeSelectionBackground": "#FFFFFF24",
    "list.hoverBackground": "#FFFFFF12",
    "terminal.selectionBackground": "#C8C8C838",

    "activityBar.activeBorder": "#FFD60A",
    "activityBarTop.activeBorder": "#FFD60A",
    "activityBarBadge.background": "#FFD60A",
    "activityBarBadge.foreground": "#161616",
    "badge.background": "#FFD60A",
    "badge.foreground": "#161616",
    "focusBorder": "#FFD60AB3",
    "list.focusOutline": "#FFD60AB3",
    "statusBar.focusBorder": "#FFD60AB3",
    "statusBarItem.focusBorder": "#FFD60AB3",
    "agentsChatInput.focusBorder": "#FFD60AB3",
    "progressBar.background": "#FFD60A",
    "tab.activeBorderTop": "#FFD60A",
    "tab.selectedBorderTop": "#F2F2F2",
    "panelTitle.activeBorder": "#FFD60A",
    "textLink.foreground": "#FFD60A",
    "textLink.activeForeground": "#FFE566",
    "notificationLink.foreground": "#FFD60A",
    "list.highlightForeground": "#FFD60A",
    "menu.selectionBorder": "#FFD60A",
    "commandCenter.activeBorder": "#FFD60A",
    "inputOption.activeBorder": "#FFD60A",
    "button.background": "#3B3616",
    "button.border": "#FFD60A80",
    "button.foreground": "#FFEE8C",
    "button.hoverBackground": "#4C461D",
    "statusBarItem.remoteBackground": "#3B3616",
    "statusBarItem.remoteForeground": "#FFD60A",
    "statusBar.debuggingBackground": "#3B3616",
    "statusBar.debuggingForeground": "#FFD60A",
    "statusBarItem.prominentBackground": "#3B3616",
    "statusBarItem.prominentForeground": "#FFD60A",
    "quickInputList.focusBackground": "#3B3616",
    "quickInputList.focusForeground": "#FFEE8C",
    "quickInputList.focusIconForeground": "#FFD60A",
    "chat.slashCommandBackground": "#3B3616",
    "chat.slashCommandForeground": "#FFD60A",
    "extensionButton.prominentBackground": "#3B3616",
    "extensionButton.prominentForeground": "#FFEE8C",
    "extensionButton.prominentHoverBackground": "#4C461D"
  }
}
```

</details>

---

## 8. Verdant — Green and Lime

Base `#2E4020` · Accent `#C7F464` · Highlight `#E4FFA8`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#0B0E08",
    "editorGutter.background": "#0B0E08",
    "editorStickyScroll.background": "#0B0E08",
    "breadcrumb.background": "#0B0E08",
    "tab.activeBackground": "#0B0E08",
    "tab.activeBorder": "#0B0E08",
    "tab.hoverBackground": "#0F120C",
    "agents.background": "#0B0E08",

    "activityBar.background": "#10140C",
    "sideBar.background": "#10140C",
    "sideBarSectionHeader.background": "#10140C",
    "statusBar.background": "#10140C",
    "statusBar.noFolderBackground": "#10140C",
    "titleBar.activeBackground": "#10140C",
    "titleBar.inactiveBackground": "#10140C",
    "panel.background": "#10140C",
    "terminal.background": "#10140C",
    "tab.inactiveBackground": "#10140C",
    "editorGroupHeader.tabsBackground": "#10140C",
    "commandCenter.background": "#151911",
    "agentsPanel.background": "#10140C",
    "surface.background": "#10140C",

    "editorWidget.background": "#1D2217",
    "notifications.background": "#1D2217",
    "quickInput.background": "#1D2217",
    "menu.background": "#1D2217",
    "agentsChatInput.background": "#1D2217",
    "tab.selectedBackground": "#333B2A",

    "activityBar.border": "#29311E",
    "sideBar.border": "#29311E",
    "panel.border": "#29311E",
    "titleBar.border": "#29311E",
    "editorGroupHeader.tabsBorder": "#29311E",
    "editorGroup.border": "#29311E",
    "tab.border": "#29311E",
    "statusBar.border": "#29311E",
    "input.border": "#333E26",

    "editor.selectionBackground": "#739C403D",
    "editor.inactiveSelectionBackground": "#95BE6224",
    "editor.selectionHighlightBackground": "#95BE622B",
    "editor.findMatchBackground": "#C7F4645E",
    "editor.findMatchHighlightBackground": "#C7F46438",
    "list.activeSelectionBackground": "#95BE6233",
    "list.hoverBackground": "#C7F46414",
    "terminal.selectionBackground": "#95BE623D",

    "activityBar.activeBorder": "#C7F464",
    "activityBarTop.activeBorder": "#C7F464",
    "activityBarBadge.background": "#C7F464",
    "activityBarBadge.foreground": "#192011",
    "activityWarningBadge.background": "#C7F464",
    "badge.background": "#C7F464",
    "badge.foreground": "#192011",
    "focusBorder": "#C7F464B3",
    "list.focusOutline": "#C7F464B3",
    "statusBar.focusBorder": "#C7F464B3",
    "statusBarItem.focusBorder": "#C7F464B3",
    "agentsChatInput.focusBorder": "#C7F464B3",
    "progressBar.background": "#C7F464",
    "tab.activeBorderTop": "#C7F464",
    "tab.selectedBorderTop": "#E4FFA8",
    "panelTitle.activeBorder": "#C7F464",
    "textLink.foreground": "#C7F464",
    "textLink.activeForeground": "#E4FFA8",
    "notificationLink.foreground": "#C7F464",
    "list.highlightForeground": "#C7F464",
    "menu.selectionBorder": "#C7F464",
    "commandCenter.activeBorder": "#C7F464",
    "inputOption.activeBorder": "#C7F464",
    "button.background": "#2F3D20",
    "button.border": "#C7F46480",
    "button.foreground": "#E5FDA6",
    "button.hoverBackground": "#3C4E2A",
    "statusBarItem.remoteBackground": "#2F3D20",
    "statusBarItem.remoteForeground": "#C7F464",
    "statusBar.debuggingBackground": "#2F3D20",
    "statusBar.debuggingForeground": "#C7F464",
    "statusBarItem.prominentBackground": "#2F3D20",
    "statusBarItem.prominentForeground": "#C7F464",
    "quickInputList.focusBackground": "#2F3D20",
    "quickInputList.focusForeground": "#E5FDA6",
    "quickInputList.focusIconForeground": "#C7F464",
    "chat.slashCommandBackground": "#2F3D20",
    "chat.slashCommandForeground": "#C7F464",
    "extensionButton.prominentBackground": "#2F3D20",
    "extensionButton.prominentForeground": "#E5FDA6",
    "extensionButton.prominentHoverBackground": "#3C4E2A"
  }
}
```

</details>

---

## 9. Sunset — Coral and Bittersweet

Base `#E94F37` · Accent `#F4845F` · Highlight `#F7B267`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#130E0C",
    "editorGutter.background": "#130E0C",
    "editorStickyScroll.background": "#130E0C",
    "breadcrumb.background": "#130E0C",
    "tab.activeBackground": "#130E0C",
    "tab.activeBorder": "#130E0C",
    "tab.hoverBackground": "#130E0C",
    "agents.background": "#130E0C",

    "activityBar.background": "#191412",
    "sideBar.background": "#191412",
    "sideBarSectionHeader.background": "#191412",
    "statusBar.background": "#191412",
    "statusBar.noFolderBackground": "#191412",
    "titleBar.activeBackground": "#191412",
    "titleBar.inactiveBackground": "#191412",
    "panel.background": "#191412",
    "terminal.background": "#191412",
    "tab.inactiveBackground": "#191412",
    "editorGroupHeader.tabsBackground": "#191412",
    "commandCenter.background": "#191412",
    "agentsPanel.background": "#191412",
    "surface.background": "#191412",

    "editorWidget.background": "#221A17",
    "notifications.background": "#221A17",
    "quickInput.background": "#221A17",
    "menu.background": "#221A17",
    "agentsChatInput.background": "#221A17",
    "tab.selectedBackground": "#3E2E28",

    "activityBar.border": "#342722",
    "sideBar.border": "#342722",
    "panel.border": "#342722",
    "titleBar.border": "#342722",
    "editorGroupHeader.tabsBorder": "#342722",
    "editorGroup.border": "#342722",
    "tab.border": "#342722",
    "statusBar.border": "#342722",
    "input.border": "#42312A",

    "editor.selectionBackground": "#E94F3733",
    "editor.inactiveSelectionBackground": "#E94F371F",
    "editor.selectionHighlightBackground": "#E94F3726",
    "editor.findMatchBackground": "#F7B2675E",
    "editor.findMatchHighlightBackground": "#F4845F38",
    "list.activeSelectionBackground": "#E94F372D",
    "list.hoverBackground": "#F4845F14",
    "terminal.selectionBackground": "#E94F3733",

    "activityBar.activeBorder": "#F4845F",
    "activityBarTop.activeBorder": "#F4845F",
    "activityBarBadge.background": "#F7B267",
    "activityBarBadge.foreground": "#221109",
    "badge.background": "#F7B267",
    "badge.foreground": "#221109",
    "focusBorder": "#F7B267B3",
    "list.focusOutline": "#F7B267B3",
    "statusBar.focusBorder": "#F7B267B3",
    "statusBarItem.focusBorder": "#F7B267B3",
    "agentsChatInput.focusBorder": "#F7B267B3",
    "progressBar.background": "#F4845F",
    "tab.activeBorderTop": "#F4845F",
    "tab.selectedBorderTop": "#F7B267",
    "panelTitle.activeBorder": "#F4845F",
    "textLink.foreground": "#F4845F",
    "textLink.activeForeground": "#F7B267",
    "notificationLink.foreground": "#F4845F",
    "list.highlightForeground": "#F7B267",
    "menu.selectionBorder": "#F4845F",
    "commandCenter.activeBorder": "#F4845F",
    "inputOption.activeBorder": "#F4845F",
    "button.background": "#55251A",
    "button.border": "#F4845F80",
    "button.foreground": "#FFDDC8",
    "button.hoverBackground": "#6E3123",
    "statusBarItem.remoteBackground": "#55251A",
    "statusBarItem.remoteForeground": "#F7B267",
    "statusBar.debuggingBackground": "#55251A",
    "statusBar.debuggingForeground": "#F7B267",
    "statusBarItem.prominentBackground": "#55251A",
    "statusBarItem.prominentForeground": "#F7B267",
    "quickInputList.focusBackground": "#55251A",
    "quickInputList.focusForeground": "#FFDDC8",
    "quickInputList.focusIconForeground": "#F4845F",
    "chat.slashCommandBackground": "#55251A",
    "chat.slashCommandForeground": "#F4845F",
    "extensionButton.prominentBackground": "#55251A",
    "extensionButton.prominentForeground": "#FFDDC8",
    "extensionButton.prominentHoverBackground": "#6E3123"
  }
}
```

</details>

---

## 10. Cadet — Slate Blue and Columbia

Base `#575B7A` · Accent `#ACB3BF` · Highlight `#C9D6EA`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#000000",
    "editorGutter.background": "#000000",
    "editorStickyScroll.background": "#000000",
    "breadcrumb.background": "#000000",
    "tab.activeBackground": "#000000",
    "tab.activeBorder": "#000000",
    "tab.hoverBackground": "#000000",
    "agents.background": "#000000",

    "activityBar.background": "#14161D",
    "sideBar.background": "#14161D",
    "sideBarSectionHeader.background": "#14161D",
    "statusBar.background": "#14161D",
    "statusBar.noFolderBackground": "#14161D",
    "titleBar.activeBackground": "#14161D",
    "titleBar.inactiveBackground": "#14161D",
    "panel.background": "#14161D",
    "terminal.background": "#14161D",
    "tab.inactiveBackground": "#14161D",
    "editorGroupHeader.tabsBackground": "#14161D",
    "commandCenter.background": "#14161D",
    "agentsPanel.background": "#14161D",
    "surface.background": "#14161D",

    "editorWidget.background": "#1C1F27",
    "notifications.background": "#1C1F27",
    "quickInput.background": "#1C1F27",
    "menu.background": "#1C1F27",
    "agentsChatInput.background": "#1C1F27",
    "tab.selectedBackground": "#333849",

    "activityBar.border": "#262A36",
    "sideBar.border": "#262A36",
    "panel.border": "#262A36",
    "titleBar.border": "#262A36",
    "editorGroupHeader.tabsBorder": "#262A36",
    "editorGroup.border": "#262A36",
    "tab.border": "#262A36",
    "statusBar.border": "#262A36",
    "input.border": "#323748",

    "editor.selectionBackground": "#8A86A340",
    "editor.inactiveSelectionBackground": "#8A86A324",
    "editor.selectionHighlightBackground": "#8A86A32B",
    "editor.findMatchBackground": "#C9D6EA5E",
    "editor.findMatchHighlightBackground": "#ACB3BF38",
    "list.activeSelectionBackground": "#8A86A333",
    "list.hoverBackground": "#ACB3BF14",
    "terminal.selectionBackground": "#8A86A340",

    "activityBar.activeBorder": "#ACB3BF",
    "activityBarTop.activeBorder": "#ACB3BF",
    "activityBarBadge.background": "#C9D6EA",
    "activityBarBadge.foreground": "#16192A",
    "badge.background": "#C9D6EA",
    "badge.foreground": "#16192A",
    "focusBorder": "#C9D6EAB3",
    "list.focusOutline": "#C9D6EAB3",
    "statusBar.focusBorder": "#C9D6EAB3",
    "statusBarItem.focusBorder": "#C9D6EAB3",
    "agentsChatInput.focusBorder": "#C9D6EAB3",
    "progressBar.background": "#ACB3BF",
    "tab.activeBorderTop": "#ACB3BF",
    "tab.selectedBorderTop": "#C9D6EA",
    "panelTitle.activeBorder": "#ACB3BF",
    "textLink.foreground": "#ACB3BF",
    "textLink.activeForeground": "#C9D6EA",
    "notificationLink.foreground": "#ACB3BF",
    "list.highlightForeground": "#C9D6EA",
    "menu.selectionBorder": "#ACB3BF",
    "commandCenter.activeBorder": "#ACB3BF",
    "inputOption.activeBorder": "#ACB3BF",
    "button.background": "#353A52",
    "button.border": "#ACB3BF80",
    "button.foreground": "#E4ECF7",
    "button.hoverBackground": "#454B68",
    "statusBarItem.remoteBackground": "#353A52",
    "statusBarItem.remoteForeground": "#C9D6EA",
    "statusBar.debuggingBackground": "#353A52",
    "statusBar.debuggingForeground": "#C9D6EA",
    "statusBarItem.prominentBackground": "#353A52",
    "statusBarItem.prominentForeground": "#C9D6EA",
    "quickInputList.focusBackground": "#353A52",
    "quickInputList.focusForeground": "#E4ECF7",
    "quickInputList.focusIconForeground": "#C9D6EA",
    "chat.slashCommandBackground": "#353A52",
    "chat.slashCommandForeground": "#C9D6EA",
    "extensionButton.prominentBackground": "#353A52",
    "extensionButton.prominentForeground": "#E4ECF7",
    "extensionButton.prominentHoverBackground": "#454B68"
  }
}
```

</details>

---

## 11. Orchid — Purple Heart and China Rose

Base `#5E239D` · Accent `#D96098` · Highlight `#F2B880`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#110D13",
    "editorGutter.background": "#110D13",
    "editorStickyScroll.background": "#110D13",
    "breadcrumb.background": "#110D13",
    "tab.activeBackground": "#110D13",
    "tab.activeBorder": "#110D13",
    "tab.hoverBackground": "#110D13",
    "agents.background": "#110D13",

    "activityBar.background": "#17121B",
    "sideBar.background": "#17121B",
    "sideBarSectionHeader.background": "#17121B",
    "statusBar.background": "#17121B",
    "statusBar.noFolderBackground": "#17121B",
    "titleBar.activeBackground": "#17121B",
    "titleBar.inactiveBackground": "#17121B",
    "panel.background": "#17121B",
    "terminal.background": "#17121B",
    "tab.inactiveBackground": "#17121B",
    "editorGroupHeader.tabsBackground": "#17121B",
    "commandCenter.background": "#17121B",
    "agentsPanel.background": "#17121B",
    "surface.background": "#17121B",

    "editorWidget.background": "#1F1926",
    "notifications.background": "#1F1926",
    "quickInput.background": "#1F1926",
    "menu.background": "#1F1926",
    "agentsChatInput.background": "#1F1926",
    "tab.selectedBackground": "#372C42",

    "activityBar.border": "#2D2337",
    "sideBar.border": "#2D2337",
    "panel.border": "#2D2337",
    "titleBar.border": "#2D2337",
    "editorGroupHeader.tabsBorder": "#2D2337",
    "editorGroup.border": "#2D2337",
    "tab.border": "#2D2337",
    "statusBar.border": "#2D2337",
    "input.border": "#3A2D46",

    "editor.selectionBackground": "#5E239D4D",
    "editor.inactiveSelectionBackground": "#5E239D2E",
    "editor.selectionHighlightBackground": "#5E239D38",
    "editor.findMatchBackground": "#F2B8805E",
    "editor.findMatchHighlightBackground": "#D9609838",
    "list.activeSelectionBackground": "#5E239D40",
    "list.hoverBackground": "#D9609814",
    "terminal.selectionBackground": "#5E239D4D",

    "activityBar.activeBorder": "#D96098",
    "activityBarTop.activeBorder": "#D96098",
    "activityBarBadge.background": "#F2B880",
    "activityBarBadge.foreground": "#1F1024",
    "badge.background": "#F2B880",
    "badge.foreground": "#1F1024",
    "focusBorder": "#F2B880B3",
    "list.focusOutline": "#F2B880B3",
    "statusBar.focusBorder": "#F2B880B3",
    "statusBarItem.focusBorder": "#F2B880B3",
    "agentsChatInput.focusBorder": "#F2B880B3",
    "progressBar.background": "#D96098",
    "tab.activeBorderTop": "#D96098",
    "tab.selectedBorderTop": "#F2B880",
    "panelTitle.activeBorder": "#D96098",
    "textLink.foreground": "#D96098",
    "textLink.activeForeground": "#F2B880",
    "notificationLink.foreground": "#D96098",
    "list.highlightForeground": "#F2B880",
    "menu.selectionBorder": "#D96098",
    "commandCenter.activeBorder": "#D96098",
    "inputOption.activeBorder": "#D96098",
    "button.background": "#3E1A66",
    "button.border": "#D9609880",
    "button.foreground": "#F7D9E9",
    "button.hoverBackground": "#512385",
    "statusBarItem.remoteBackground": "#3E1A66",
    "statusBarItem.remoteForeground": "#F2B880",
    "statusBar.debuggingBackground": "#3E1A66",
    "statusBar.debuggingForeground": "#F2B880",
    "statusBarItem.prominentBackground": "#3E1A66",
    "statusBarItem.prominentForeground": "#F2B880",
    "quickInputList.focusBackground": "#3E1A66",
    "quickInputList.focusForeground": "#F7D9E9",
    "quickInputList.focusIconForeground": "#D96098",
    "chat.slashCommandBackground": "#3E1A66",
    "chat.slashCommandForeground": "#D96098",
    "extensionButton.prominentBackground": "#3E1A66",
    "extensionButton.prominentForeground": "#F7D9E9",
    "extensionButton.prominentHoverBackground": "#512385"
  }
}
```

</details>

---

## 12. Cobalt — Royal Blue and Selective Yellow

Base `#454ADE` · Accent `#6A5ACD` · Highlight `#FFB319`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#0D0E14",
    "editorGutter.background": "#0D0E14",
    "editorStickyScroll.background": "#0D0E14",
    "breadcrumb.background": "#0D0E14",
    "tab.activeBackground": "#0D0E14",
    "tab.activeBorder": "#0D0E14",
    "tab.hoverBackground": "#0D0E14",
    "agents.background": "#0D0E14",

    "activityBar.background": "#13141D",
    "sideBar.background": "#13141D",
    "sideBarSectionHeader.background": "#13141D",
    "statusBar.background": "#13141D",
    "statusBar.noFolderBackground": "#13141D",
    "titleBar.activeBackground": "#13141D",
    "titleBar.inactiveBackground": "#13141D",
    "panel.background": "#13141D",
    "terminal.background": "#13141D",
    "tab.inactiveBackground": "#13141D",
    "editorGroupHeader.tabsBackground": "#13141D",
    "commandCenter.background": "#13141D",
    "agentsPanel.background": "#13141D",
    "surface.background": "#13141D",

    "editorWidget.background": "#1B1C28",
    "notifications.background": "#1B1C28",
    "quickInput.background": "#1B1C28",
    "menu.background": "#1B1C28",
    "agentsChatInput.background": "#1B1C28",
    "tab.selectedBackground": "#313349",

    "activityBar.border": "#252739",
    "sideBar.border": "#252739",
    "panel.border": "#252739",
    "titleBar.border": "#252739",
    "editorGroupHeader.tabsBorder": "#252739",
    "editorGroup.border": "#252739",
    "tab.border": "#252739",
    "statusBar.border": "#252739",
    "input.border": "#313349",

    "editor.selectionBackground": "#454ADE40",
    "editor.inactiveSelectionBackground": "#454ADE26",
    "editor.selectionHighlightBackground": "#454ADE2E",
    "editor.findMatchBackground": "#FFB3195E",
    "editor.findMatchHighlightBackground": "#FFB31933",
    "list.activeSelectionBackground": "#454ADE36",
    "list.hoverBackground": "#6A5ACD1A",
    "terminal.selectionBackground": "#454ADE40",

    "activityBar.activeBorder": "#FFB319",
    "activityBarTop.activeBorder": "#FFB319",
    "activityBarBadge.background": "#FFB319",
    "activityBarBadge.foreground": "#14152A",
    "badge.background": "#FFB319",
    "badge.foreground": "#14152A",
    "focusBorder": "#FFB319B3",
    "list.focusOutline": "#FFB319B3",
    "statusBar.focusBorder": "#FFB319B3",
    "statusBarItem.focusBorder": "#FFB319B3",
    "agentsChatInput.focusBorder": "#FFB319B3",
    "progressBar.background": "#6A5ACD",
    "tab.activeBorderTop": "#FFB319",
    "tab.selectedBorderTop": "#8E83E6",
    "panelTitle.activeBorder": "#FFB319",
    "textLink.foreground": "#8E83E6",
    "textLink.activeForeground": "#FFB319",
    "notificationLink.foreground": "#8E83E6",
    "list.highlightForeground": "#FFB319",
    "menu.selectionBorder": "#6A5ACD",
    "commandCenter.activeBorder": "#FFB319",
    "inputOption.activeBorder": "#6A5ACD",
    "button.background": "#2B2C6B",
    "button.border": "#6A5ACD99",
    "button.foreground": "#DDDCFA",
    "button.hoverBackground": "#393A8A",
    "statusBarItem.remoteBackground": "#2B2C6B",
    "statusBarItem.remoteForeground": "#FFB319",
    "statusBar.debuggingBackground": "#2B2C6B",
    "statusBar.debuggingForeground": "#FFB319",
    "statusBarItem.prominentBackground": "#2B2C6B",
    "statusBarItem.prominentForeground": "#FFB319",
    "quickInputList.focusBackground": "#2B2C6B",
    "quickInputList.focusForeground": "#DDDCFA",
    "quickInputList.focusIconForeground": "#FFB319",
    "chat.slashCommandBackground": "#2B2C6B",
    "chat.slashCommandForeground": "#8E83E6",
    "extensionButton.prominentBackground": "#2B2C6B",
    "extensionButton.prominentForeground": "#DDDCFA",
    "extensionButton.prominentHoverBackground": "#393A8A"
  }
}
```

</details>

---

## 13. Terracotta — Clay and Melon

Base `#8C4A32` · Accent `#E08E6D` · Highlight `#FFB5B5`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#120F0D",
    "editorGutter.background": "#120F0D",
    "editorStickyScroll.background": "#120F0D",
    "breadcrumb.background": "#120F0D",
    "tab.activeBackground": "#120F0D",
    "tab.activeBorder": "#120F0D",
    "tab.hoverBackground": "#120F0D",
    "agents.background": "#120F0D",

    "activityBar.background": "#181513",
    "sideBar.background": "#181513",
    "sideBarSectionHeader.background": "#181513",
    "statusBar.background": "#181513",
    "statusBar.noFolderBackground": "#181513",
    "titleBar.activeBackground": "#181513",
    "titleBar.inactiveBackground": "#181513",
    "panel.background": "#181513",
    "terminal.background": "#181513",
    "tab.inactiveBackground": "#181513",
    "editorGroupHeader.tabsBackground": "#181513",
    "commandCenter.background": "#181513",
    "agentsPanel.background": "#181513",
    "surface.background": "#181513",

    "editorWidget.background": "#211B18",
    "notifications.background": "#211B18",
    "quickInput.background": "#211B18",
    "menu.background": "#211B18",
    "agentsChatInput.background": "#211B18",
    "tab.selectedBackground": "#3C302A",

    "activityBar.border": "#332924",
    "sideBar.border": "#332924",
    "panel.border": "#332924",
    "titleBar.border": "#332924",
    "editorGroupHeader.tabsBorder": "#332924",
    "editorGroup.border": "#332924",
    "tab.border": "#332924",
    "statusBar.border": "#332924",
    "input.border": "#40332C",

    "editor.selectionBackground": "#C4704E3D",
    "editor.inactiveSelectionBackground": "#C4704E24",
    "editor.selectionHighlightBackground": "#C4704E2B",
    "editor.findMatchBackground": "#FFB5B55E",
    "editor.findMatchHighlightBackground": "#E08E6D36",
    "list.activeSelectionBackground": "#C4704E33",
    "list.hoverBackground": "#E08E6D14",
    "terminal.selectionBackground": "#C4704E3D",

    "activityBar.activeBorder": "#E08E6D",
    "activityBarTop.activeBorder": "#E08E6D",
    "activityBarBadge.background": "#FFB5B5",
    "activityBarBadge.foreground": "#20120E",
    "badge.background": "#FFB5B5",
    "badge.foreground": "#20120E",
    "focusBorder": "#FFB5B5B3",
    "list.focusOutline": "#FFB5B5B3",
    "statusBar.focusBorder": "#FFB5B5B3",
    "statusBarItem.focusBorder": "#FFB5B5B3",
    "agentsChatInput.focusBorder": "#FFB5B5B3",
    "progressBar.background": "#E08E6D",
    "tab.activeBorderTop": "#E08E6D",
    "tab.selectedBorderTop": "#FFB5B5",
    "panelTitle.activeBorder": "#E08E6D",
    "textLink.foreground": "#E08E6D",
    "textLink.activeForeground": "#FFB5B5",
    "notificationLink.foreground": "#E08E6D",
    "list.highlightForeground": "#E08E6D",
    "menu.selectionBorder": "#E08E6D",
    "commandCenter.activeBorder": "#E08E6D",
    "inputOption.activeBorder": "#E08E6D",
    "button.background": "#4E2A1C",
    "button.border": "#E08E6D80",
    "button.foreground": "#FFDCCB",
    "button.hoverBackground": "#653725",
    "statusBarItem.remoteBackground": "#4E2A1C",
    "statusBarItem.remoteForeground": "#FFB5B5",
    "statusBar.debuggingBackground": "#4E2A1C",
    "statusBar.debuggingForeground": "#FFB5B5",
    "statusBarItem.prominentBackground": "#4E2A1C",
    "statusBarItem.prominentForeground": "#FFB5B5",
    "quickInputList.focusBackground": "#4E2A1C",
    "quickInputList.focusForeground": "#FFDCCB",
    "quickInputList.focusIconForeground": "#E08E6D",
    "chat.slashCommandBackground": "#4E2A1C",
    "chat.slashCommandForeground": "#E08E6D",
    "extensionButton.prominentBackground": "#4E2A1C",
    "extensionButton.prominentForeground": "#FFDCCB",
    "extensionButton.prominentHoverBackground": "#653725"
  }
}
```

</details>

---

## 14. Glacier — Steel and Aero Blue

Base `#0096C7` · Accent `#90E0EF` · Highlight `#CAF0F8`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#0D1114",
    "editorGutter.background": "#0D1114",
    "editorStickyScroll.background": "#0D1114",
    "breadcrumb.background": "#0D1114",
    "tab.activeBackground": "#0D1114",
    "tab.activeBorder": "#0D1114",
    "tab.hoverBackground": "#0D1114",
    "agents.background": "#0D1114",

    "activityBar.background": "#13181C",
    "sideBar.background": "#13181C",
    "sideBarSectionHeader.background": "#13181C",
    "statusBar.background": "#13181C",
    "statusBar.noFolderBackground": "#13181C",
    "titleBar.activeBackground": "#13181C",
    "titleBar.inactiveBackground": "#13181C",
    "panel.background": "#13181C",
    "terminal.background": "#13181C",
    "tab.inactiveBackground": "#13181C",
    "editorGroupHeader.tabsBackground": "#13181C",
    "commandCenter.background": "#13181C",
    "agentsPanel.background": "#13181C",
    "surface.background": "#13181C",

    "editorWidget.background": "#1A2126",
    "notifications.background": "#1A2126",
    "quickInput.background": "#1A2126",
    "menu.background": "#1A2126",
    "agentsChatInput.background": "#1A2126",
    "tab.selectedBackground": "#2E3A42",

    "activityBar.border": "#232E35",
    "sideBar.border": "#232E35",
    "panel.border": "#232E35",
    "titleBar.border": "#232E35",
    "editorGroupHeader.tabsBorder": "#232E35",
    "editorGroup.border": "#232E35",
    "tab.border": "#232E35",
    "statusBar.border": "#232E35",
    "input.border": "#2D3B44",

    "editor.selectionBackground": "#0096C740",
    "editor.inactiveSelectionBackground": "#0096C726",
    "editor.selectionHighlightBackground": "#0096C72E",
    "editor.findMatchBackground": "#CAF0F85E",
    "editor.findMatchHighlightBackground": "#90E0EF38",
    "list.activeSelectionBackground": "#0096C736",
    "list.hoverBackground": "#90E0EF14",
    "terminal.selectionBackground": "#0096C740",

    "activityBar.activeBorder": "#90E0EF",
    "activityBarTop.activeBorder": "#90E0EF",
    "activityBarBadge.background": "#CAF0F8",
    "activityBarBadge.foreground": "#0E2029",
    "badge.background": "#CAF0F8",
    "badge.foreground": "#0E2029",
    "focusBorder": "#CAF0F8B3",
    "list.focusOutline": "#CAF0F8B3",
    "statusBar.focusBorder": "#CAF0F8B3",
    "statusBarItem.focusBorder": "#CAF0F8B3",
    "agentsChatInput.focusBorder": "#CAF0F8B3",
    "progressBar.background": "#90E0EF",
    "tab.activeBorderTop": "#90E0EF",
    "tab.selectedBorderTop": "#CAF0F8",
    "panelTitle.activeBorder": "#90E0EF",
    "textLink.foreground": "#90E0EF",
    "textLink.activeForeground": "#CAF0F8",
    "notificationLink.foreground": "#90E0EF",
    "list.highlightForeground": "#90E0EF",
    "menu.selectionBorder": "#90E0EF",
    "commandCenter.activeBorder": "#90E0EF",
    "inputOption.activeBorder": "#90E0EF",
    "button.background": "#0E3D52",
    "button.border": "#90E0EF80",
    "button.foreground": "#DFF7FC",
    "button.hoverBackground": "#13526E",
    "statusBarItem.remoteBackground": "#0E3D52",
    "statusBarItem.remoteForeground": "#CAF0F8",
    "statusBar.debuggingBackground": "#0E3D52",
    "statusBar.debuggingForeground": "#CAF0F8",
    "statusBarItem.prominentBackground": "#0E3D52",
    "statusBarItem.prominentForeground": "#CAF0F8",
    "quickInputList.focusBackground": "#0E3D52",
    "quickInputList.focusForeground": "#DFF7FC",
    "quickInputList.focusIconForeground": "#90E0EF",
    "chat.slashCommandBackground": "#0E3D52",
    "chat.slashCommandForeground": "#90E0EF",
    "extensionButton.prominentBackground": "#0E3D52",
    "extensionButton.prominentForeground": "#DFF7FC",
    "extensionButton.prominentHoverBackground": "#13526E"
  }
}
```

</details>

## 15. Spark — Graphite and Amber

Base `#100E0C` · Accent `#F59E0B` · Highlight `#FBBF24`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#000000",
    "editorGutter.background": "#000000",
    "editorStickyScroll.background": "#000000",
    "breadcrumb.background": "#000000",
    "tab.activeBackground": "#000000",
    "tab.activeBorder": "#000000",
    "tab.hoverBackground": "#17130F",
    "agents.background": "#000000",

    "activityBar.background": "#100E0C",
    "sideBar.background": "#100E0C",
    "sideBarSectionHeader.background": "#100E0C",
    "statusBar.background": "#100E0C",
    "statusBar.noFolderBackground": "#100E0C",
    "titleBar.activeBackground": "#100E0C",
    "titleBar.inactiveBackground": "#100E0C",
    "panel.background": "#100E0C",
    "terminal.background": "#000000",
    "tab.inactiveBackground": "#100E0C",
    "editorGroupHeader.tabsBackground": "#100E0C",
    "commandCenter.background": "#100E0C",
    "agentsPanel.background": "#100E0C",
    "surface.background": "#100E0C",

    "editorWidget.background": "#1D1A16",
    "notifications.background": "#1D1A16",
    "quickInput.background": "#1D1A16",
    "menu.background": "#1D1A16",
    "agentsChatInput.background": "#1D1A16",
    "tab.selectedBackground": "#352D23",

    "activityBar.border": "#2C2924",
    "sideBar.border": "#2C2924",
    "panel.border": "#2C2924",
    "titleBar.border": "#2C2924",
    "editorGroupHeader.tabsBorder": "#2C2924",
    "editorGroup.border": "#2C2924",
    "tab.border": "#2C2924",
    "statusBar.border": "#2C2924",
    "input.border": "#3A332A",

    "editor.selectionBackground": "#C8C8C838",
    "editor.inactiveSelectionBackground": "#C8C8C822",
    "editor.selectionHighlightBackground": "#D8D8D826",
    "editor.findMatchBackground": "#F59E0B5E",
    "editor.findMatchHighlightBackground": "#FBBF2438",
    "list.activeSelectionBackground": "#FFFFFF24",
    "list.hoverBackground": "#FFFFFF12",
    "terminal.selectionBackground": "#C8C8C838",

    "activityBar.activeBorder": "#F59E0B",
    "activityBarTop.activeBorder": "#F59E0B",
    "activityBarBadge.background": "#F59E0B",
    "activityBarBadge.foreground": "#1A1309",
    "badge.background": "#F59E0B",
    "badge.foreground": "#1A1309",
    "focusBorder": "#F59E0BB3",
    "list.focusOutline": "#F59E0BB3",
    "statusBar.focusBorder": "#F59E0BB3",
    "statusBarItem.focusBorder": "#F59E0BB3",
    "agentsChatInput.focusBorder": "#F59E0BB3",
    "progressBar.background": "#F59E0B",
    "tab.activeBorderTop": "#F59E0B",
    "tab.selectedBorderTop": "#E5E5E5",
    "panelTitle.activeBorder": "#F59E0B",
    "textLink.foreground": "#F59E0B",
    "textLink.activeForeground": "#FBBF24",
    "notificationLink.foreground": "#F59E0B",
    "list.highlightForeground": "#F59E0B",
    "menu.selectionBorder": "#F59E0B",
    "commandCenter.activeBorder": "#F59E0B",
    "inputOption.activeBorder": "#F59E0B",
    "button.background": "#382914",
    "button.border": "#F59E0B80",
    "button.foreground": "#FDE68A",
    "button.hoverBackground": "#4B3416",
    "statusBarItem.remoteBackground": "#382914",
    "statusBarItem.remoteForeground": "#F59E0B",
    "statusBar.debuggingBackground": "#382914",
    "statusBar.debuggingForeground": "#F59E0B",
    "statusBarItem.prominentBackground": "#382914",
    "statusBarItem.prominentForeground": "#F59E0B",
    "quickInputList.focusBackground": "#382914",
    "quickInputList.focusForeground": "#FDE68A",
    "quickInputList.focusIconForeground": "#F59E0B",
    "chat.slashCommandBackground": "#382914",
    "chat.slashCommandForeground": "#F59E0B",
    "extensionButton.prominentBackground": "#382914",
    "extensionButton.prominentForeground": "#FDE68A",
    "extensionButton.prominentHoverBackground": "#4B3416",

    "activityBar.activeFocusBorder": "#F59E0BB3",
    "activityWarningBadge.background": "#F59E0B",
    "activityWarningBadge.foreground": "#1A1309",
    "editorSuggestWidget.focusOutline": "#F59E0BB3",
    "multiDiffEditor.border": "#F59E0BB3"
  }
}
```

</details>

## 16. Kaia Amplified — Electric Yellow and Cyan

Base `#151413` · Accent `#FFE66D` · Highlight `#71D8FF`

<details>
<summary>Show JSON</summary>

```jsonc
"workbench.colorCustomizations": {
  "[Kaia OLED]": {
    "editor.background": "#000000",
    "editorGutter.background": "#000000",
    "editorStickyScroll.background": "#000000",
    "breadcrumb.background": "#000000",
    "tab.activeBackground": "#000000",
    "tab.activeBorder": "#000000",
    "tab.hoverBackground": "#211F1D",
    "agents.background": "#000000",

    "activityBar.background": "#151413",
    "sideBar.background": "#151413",
    "sideBarSectionHeader.background": "#151413",
    "statusBar.background": "#151413",
    "statusBar.noFolderBackground": "#151413",
    "titleBar.activeBackground": "#151413",
    "titleBar.inactiveBackground": "#151413",
    "panel.background": "#151413",
    "terminal.background": "#151413",
    "tab.inactiveBackground": "#151413",
    "editorGroupHeader.tabsBackground": "#151413",
    "commandCenter.background": "#151413",
    "agentsPanel.background": "#151413",
    "surface.background": "#151413",

    "editorWidget.background": "#211F1D",
    "notifications.background": "#211F1D",
    "quickInput.background": "#211F1D",
    "menu.background": "#211F1D",
    "agentsChatInput.background": "#211F1D",
    "tab.selectedBackground": "#37332F",

    "activityBar.border": "#2E2B28",
    "sideBar.border": "#2E2B28",
    "panel.border": "#2E2B28",
    "titleBar.border": "#2E2B28",
    "editorGroupHeader.tabsBorder": "#2E2B28",
    "editorGroup.border": "#2E2B28",
    "tab.border": "#2E2B28",
    "statusBar.border": "#2E2B28",
    "input.border": "#3B3733",

    "editor.selectionBackground": "#71D8FF40",
    "editor.inactiveSelectionBackground": "#71D8FF24",
    "editor.selectionHighlightBackground": "#71D8FF2B",
    "editor.findMatchBackground": "#FFE66D5E",
    "editor.findMatchHighlightBackground": "#FFE66D38",
    "list.activeSelectionBackground": "#71D8FF30",
    "list.hoverBackground": "#FFFFFF12",
    "terminal.selectionBackground": "#71D8FF40",

    "activityBar.activeBorder": "#FFE66D",
    "activityBarTop.activeBorder": "#FFE66D",
    "activityBarBadge.background": "#FFE66D",
    "activityBarBadge.foreground": "#171614",
    "badge.background": "#FFE66D",
    "badge.foreground": "#171614",
    "focusBorder": "#FFE66DB3",
    "list.focusOutline": "#FFE66DB3",
    "statusBar.focusBorder": "#FFE66DB3",
    "statusBarItem.focusBorder": "#FFE66DB3",
    "agentsChatInput.focusBorder": "#FFE66DB3",
    "progressBar.background": "#71D8FF",
    "tab.activeBorderTop": "#FFE66D",
    "tab.selectedBorderTop": "#71D8FF",
    "panelTitle.activeBorder": "#FFE66D",
    "textLink.foreground": "#71D8FF",
    "textLink.activeForeground": "#FFE66D",
    "notificationLink.foreground": "#71D8FF",
    "list.highlightForeground": "#FFE66D",
    "menu.selectionBorder": "#FFE66D",
    "commandCenter.activeBorder": "#FFE66D",
    "inputOption.activeBorder": "#71D8FF",

    "button.background": "#39351F",
    "button.border": "#FFE66D80",
    "button.foreground": "#FFF2AB",
    "button.hoverBackground": "#514B28",
    "statusBarItem.remoteBackground": "#39351F",
    "statusBarItem.remoteForeground": "#FFE66D",
    "statusBar.debuggingBackground": "#39351F",
    "statusBar.debuggingForeground": "#FFE66D",
    "statusBarItem.prominentBackground": "#39351F",
    "statusBarItem.prominentForeground": "#FFE66D",
    "quickInputList.focusBackground": "#39351F",
    "quickInputList.focusForeground": "#FFF2AB",
    "quickInputList.focusIconForeground": "#FFE66D",
    "chat.slashCommandBackground": "#39351F",
    "chat.slashCommandForeground": "#FFE66D",
    "extensionButton.prominentBackground": "#39351F",
    "extensionButton.prominentForeground": "#FFF2AB",
    "extensionButton.prominentHoverBackground": "#514B28"
  }
}
```

</details>