const { getVariant } = require("./process");
const { getColors } = require("./primer");

function getTheme({ style, name }) {
  // Usage: `auto('pink')`
  const auto = (hex) => getVariant(hex, style);

  // Usage: `pick({ light: "lightblue", dark: "darkblue" })`
  const pick = (options) => options[style];

  const primer = getColors(style);

  const foreground = pick({ light: primer.gray[8], dark: primer.gray[7] });

  return {
    name: name,
    colors: {
      focusBorder: pick({ light: primer.blue[4], dark: primer.blue[3] }),
      foreground: pick({ light: primer.gray[7], dark: primer.gray[6] }),
      descriptionForeground: primer.gray[5],
      errorForeground: primer.red[6],

      "textLink.foreground": pick({ light: primer.blue[5], dark: primer.blue[6] }),
      "textLink.activeForeground": pick({ light: primer.blue[6], dark: primer.blue[7] }),
      "textBlockQuote.background": primer.gray[0],
      "textBlockQuote.border": primer.gray[2],
      "textCodeBlock.background": primer.gray[1],
      "textPreformat.foreground": primer.gray[6],
      "textSeparator.foreground": primer.gray[3],

      "button.background": pick({ light: "#159739", dark: primer.green[2] }),
      "button.foreground": pick({ light: primer.white, dark: primer.green[8] }),
      "button.hoverBackground": pick({ light: "#138934", dark: primer.green[3] }),

      "checkbox.background": pick({ light: primer.gray[0], dark: primer.gray[2] }),
      "checkbox.border": pick({ light: primer.gray[3], dark: primer.white }),

      "dropdown.background": pick({ light: primer.gray[0], dark: primer.gray[1] }),
      "dropdown.border": pick({ light: primer.gray[2], dark: primer.white }),
      "dropdown.foreground": foreground,
      "dropdown.listBackground": pick({ light: primer.white, dark: primer.gray[0] }),

      "input.background": pick({ light: primer.gray[0], dark: primer.gray[1] }),
      "input.border": pick({ light: primer.gray[2], dark: primer.white }),
      "input.foreground": foreground,
      "input.placeholderForeground": pick({ light: primer.gray[4], dark: primer.gray[5] }),

      "badge.foreground": pick({ light: primer.blue[6], dark: primer.blue[7] }),
      "badge.background": pick({ light: primer.blue[1], dark: primer.blue[2] }),

      "progressBar.background": primer.blue[4],

      "titleBar.activeForeground": foreground,
      "titleBar.activeBackground": pick({ light: primer.white, dark: primer.gray[0] }),
      "titleBar.inactiveForeground": primer.gray[5],
      "titleBar.inactiveBackground": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "titleBar.border": pick({ light: primer.gray[2], dark: primer.white }),

      "activityBar.foreground": foreground,
      "activityBar.inactiveForeground": primer.gray[4],
      "activityBar.background": pick({ light: primer.white, dark: primer.gray[0] }),
      "activityBarBadge.foreground": pick({ light: primer.white, dark: primer.black }),
      "activityBarBadge.background": pick({ light: primer.blue[4], dark: primer.blue[4] }),
      "activityBar.activeBorder": "#f9826c",
      "activityBar.border": pick({ light: primer.gray[2], dark: primer.white }),

      "sideBar.foreground": primer.gray[6],
      "sideBar.background": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "sideBar.border": pick({ light: primer.gray[2], dark: primer.white }),
      "sideBarTitle.foreground": foreground,
      "sideBarSectionHeader.foreground": foreground,
      "sideBarSectionHeader.background": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "sideBarSectionHeader.border": pick({ light: primer.gray[2], dark: primer.white }),

      "list.hoverForeground": foreground,
      "list.inactiveSelectionForeground": foreground,
      "list.activeSelectionForeground": foreground,
      "list.hoverBackground": pick({ light: "#ebf0f4", dark: "#282e34" }),
      "list.inactiveSelectionBackground": pick({ light: "#e8eaed", dark: "#282e34" }),
      "list.activeSelectionBackground": pick({ light: "#e2e5e9", dark: "#39414a" }),
      "list.inactiveFocusBackground": pick({ light: primer.blue[1], dark: "#1d2d3e" }),
      "list.focusBackground": pick({ light: "#cce5ff", dark: primer.blue[2] }),

      "tree.indentGuidesStroke": pick({ light: primer.gray[2], dark: primer.gray[1] }),

      "notificationCenterHeader.foreground": primer.gray[5],
      "notificationCenterHeader.background": pick({ light: primer.gray[2], dark: primer.gray[0] }),
      "notifications.foreground": foreground,
      "notifications.background": pick({ light: primer.gray[0], dark: primer.gray[1] }),
      "notifications.border": pick({ light: primer.gray[2], dark: primer.white }),
      "notificationsErrorIcon.foreground": primer.red[5],
      "notificationsWarningIcon.foreground": primer.orange[6],
      "notificationsInfoIcon.foreground": primer.blue[6],

      "pickerGroup.border": primer.gray[2],
      "pickerGroup.foreground": foreground,
      "quickInput.background": primer.gray[0],
      "quickInput.foreground": foreground,

      "statusBar.foreground": primer.gray[6],
      "statusBar.background": pick({ light: primer.white, dark: primer.gray[0] }),
      "statusBar.border": pick({ light: primer.gray[2], dark: primer.white }),
      "statusBar.noFolderBackground": pick({ light: primer.white, dark: primer.gray[0] }),
      "statusBar.debuggingBackground": auto("#f9826c"),
      "statusBar.debuggingForeground": pick({ light: primer.white, dark: primer.black }),

      "editorGroupHeader.tabsBackground": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "editorGroupHeader.tabsBorder": pick({ light: primer.gray[2], dark: primer.white }),
      "editorGroup.border": pick({ light: primer.gray[2], dark: primer.white }),

      "tab.activeForeground": foreground,
      "tab.inactiveForeground": primer.gray[5],
      "tab.inactiveBackground": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "tab.activeBackground": pick({ light: primer.white, dark: primer.gray[0] }),
      "tab.hoverBackground": pick({ light: primer.white, dark: primer.gray[0] }),
      "tab.unfocusedHoverBackground": pick({ light: primer.white, dark: primer.gray[0] }),
      "tab.border": pick({ light: primer.gray[2], dark: primer.white }),
      "tab.unfocusedActiveBorderTop": pick({ light: primer.gray[2], dark: primer.white }),
      "tab.activeBorder": pick({ light: primer.white, dark: primer.gray[0] }),
      "tab.unfocusedActiveBorder": pick({ light: primer.white, dark: primer.gray[0] }),
      "tab.activeBorderTop": "#f9826c",

      "breadcrumb.foreground": primer.gray[5],
      "breadcrumb.focusForeground": foreground,
      "breadcrumb.activeSelectionForeground": primer.gray[6],
      "breadcrumbPicker.background": pick({ light: primer.gray[0], dark: "#2b3036" }),

      "editor.foreground": pick({ light: primer.gray[9], dark: primer.gray[7] }),
      "editor.background": pick({ light: primer.white, dark: primer.gray[0] }),
      "editorWidget.background": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "editor.foldBackground": pick({ light: primer.gray[0], dark: "#282e33" }),
      "editor.lineHighlightBackground": pick({ light: primer.gray[1], dark: "#2b3036" }),
      "editorLineNumber.foreground": pick({ light: "#1b1f234d", dark: primer.gray[2] }),
      "editorLineNumber.activeForeground": pick({ light: primer.gray[9], dark: primer.gray[7] }),
      "editorIndentGuide.background": pick({ light: "#eff2f6", dark: primer.gray[1] }),
      "editorIndentGuide.activeBackground": pick({ light: "#d7dbe0", dark: primer.gray[2] }),
      "editorWhitespace.foreground": pick({ light: primer.gray[3], dark: primer.gray[2] }),
      "editorCursor.foreground": primer.blue[7],

      "editor.findMatchBackground": pick({ light: primer.yellow[4], dark: "#ffd33d44" }),
      "editor.findMatchHighlightBackground": pick({ light: "#ffdf5d66", dark: "#ffd33d22" }),
      "editor.inactiveSelectionBackground": pick({ light: "#0366d611", dark: "#3392FF22" }),
      "editor.selectionBackground": pick({ light: "#0366d625", dark: "#3392FF44" }),
      "editor.selectionHighlightBackground": pick({ light: "#34d05840", dark: "#17E5E633" }),
      "editor.selectionHighlightBorder": pick({ light: "#34d05800", dark: "#17E5E600" }),
      "editor.wordHighlightBackground": pick({ light: "#34d05800", dark: "#17E5E600" }),
      "editor.wordHighlightStrongBackground": pick({ light: "#34d05800", dark: "#17E5E600" }),
      "editor.wordHighlightBorder": pick({ light: "#24943e99", dark: "#17E5E699" }),
      "editor.wordHighlightStrongBorder": pick({ light: "#24943e50", dark: "#17E5E666" }),
      "editorBracketMatch.background": pick({ light: "#34d05840", dark: "#17E5E650" }),
      "editorBracketMatch.border": pick({ light: "#34d05800", dark: "#17E5E600" }),

      "editorGutter.modifiedBackground": pick({ light: primer.blue[4], dark: primer.blue[5] }),
      "editorGutter.addedBackground": pick({ light: primer.green[5], dark: primer.green[4] }),
      "editorGutter.deletedBackground": primer.red[5],

      "diffEditor.insertedTextBackground": pick({ light: "#34d05822", dark: "#28a74530" }),
      "diffEditor.removedTextBackground": pick({ light: "#d73a4922", dark: "#d73a4930" }),

      "scrollbar.shadow": pick({ light: "#6a737d33", dark: "#0008" }),
      "scrollbarSlider.background": pick({ light: "#959da533", dark: "#6a737d33" }),
      "scrollbarSlider.hoverBackground": pick({ light: "#959da544", dark: "#6a737d44" }),
      "scrollbarSlider.activeBackground": pick({ light: "#959da588", dark: "#6a737d88" }),
      "editorOverviewRuler.border": primer.white,

      "panel.background": pick({ light: primer.gray[1], dark: "#1f2428" }),
      "panel.border": pick({ light: primer.gray[2], dark: primer.white }),
      "panelTitle.activeBorder": "#f9826c",
      "panelTitle.activeForeground": foreground,
      "panelTitle.inactiveForeground": primer.gray[5],
      "panelInput.border": pick({ light: primer.gray[2], dark: primer.gray[1] }),

      "terminal.foreground": primer.gray[6],

      "gitDecoration.addedResourceForeground": primer.green[5],
      "gitDecoration.modifiedResourceForeground": primer.blue[6],
      "gitDecoration.deletedResourceForeground": primer.red[5],
      "gitDecoration.untrackedResourceForeground": primer.green[5],
      "gitDecoration.ignoredResourceForeground": primer.gray[4],
      "gitDecoration.conflictingResourceForeground": primer.orange[6],
      "gitDecoration.submoduleResourceForeground": primer.gray[4],

      "debugToolBar.background": pick({ light: primer.white, dark: "#2b3036" }),
      "editor.stackFrameHighlightBackground": pick({ light: primer.yellow[1], dark: "#a707" }),
      "editor.focusedStackFrameHighlightBackground": pick({ light: primer.yellow[2], dark: "#b808" }),

      "peekViewEditor.matchHighlightBackground": pick({ dark: "#ffd33d33" }),
      "peekViewResult.matchHighlightBackground": pick({ dark: "#ffd33d33" }),
      "peekViewEditor.background": pick({ dark: "#1f242888" }),
      "peekViewResult.background": pick({ dark: "#1f2428" }),

      "settings.headerForeground": foreground,
      "settings.modifiedItemIndicator": primer.blue[4],
      "welcomePage.buttonBackground": primer.gray[1],
      "welcomePage.buttonHoverBackground": primer.gray[2],
    },
    semanticHighlighting: true,
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment", "string.comment"],
        settings: {
          foreground: pick({ light: primer.gray[5], dark: primer.gray[4] }),
        },
      },
      {
        scope: [
          "constant",
          "entity.name.constant",
          "variable.other.constant",
          "variable.language",
        ],
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: ["entity", "entity.name"],
        settings: {
          foreground: pick({ light: primer.purple[5], dark: primer.purple[6] }),
        },
      },
      {
        scope: "variable.parameter.function",
        settings: {
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: "entity.name.tag",
        settings: {
          foreground: primer.green[6],
        },
      },
      {
        scope: "keyword",
        settings: {
          foreground: pick({ light: primer.red[5], dark: primer.red[6] }),
        },
      },
      {
        scope: ["storage", "storage.type"],
        settings: {
          foreground: pick({ light: primer.red[5], dark: primer.red[6] }),
        },
      },
      {
        scope: [
          "storage.modifier.package",
          "storage.modifier.import",
          "storage.type.java",
        ],
        settings: {
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: [
          "string",
          "punctuation.definition.string",
          "string punctuation.section.embedded source",
        ],
        settings: {
          foreground: pick({ light: primer.blue[8], dark: "#9ecbff" }),
        },
      },
      {
        scope: "support",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "meta.property-name",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "variable",
        settings: {
          foreground: primer.orange[6],
        },
      },
      {
        scope: "variable.other",
        settings: {
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: "invalid.broken",
        settings: {
          fontStyle: "italic",
          foreground: primer.red[7],
        },
      },
      {
        scope: "invalid.deprecated",
        settings: {
          fontStyle: "italic",
          foreground: primer.red[7],
        },
      },
      {
        scope: "invalid.illegal",
        settings: {
          fontStyle: "italic",
          foreground: primer.red[7],
        },
      },
      {
        scope: "invalid.unimplemented",
        settings: {
          fontStyle: "italic",
          foreground: primer.red[7],
        },
      },
      {
        scope: "carriage-return",
        settings: {
          fontStyle: "italic underline",
          background: pick({ light: primer.red[5], dark: primer.red[6] }),
          foreground: primer.gray[0],
          content: "^M",
        },
      },
      {
        scope: "message.error",
        settings: {
          foreground: primer.red[7],
        },
      },
      {
        scope: "string source",
        settings: {
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: "string variable",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: ["source.regexp", "string.regexp"],
        settings: {
          foreground: primer.blue[8],
        },
      },
      {
        scope: [
          "string.regexp.character-class",
          "string.regexp constant.character.escape",
          "string.regexp source.ruby.embedded",
          "string.regexp string.regexp.arbitrary-repitition",
        ],
        settings: {
          foreground: primer.blue[8],
        },
      },
      {
        scope: "string.regexp constant.character.escape",
        settings: {
          fontStyle: "bold",
          foreground: primer.green[6],
        },
      },
      {
        scope: "support.constant",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "support.variable",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "meta.module-reference",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "punctuation.definition.list.begin.markdown",
        settings: {
          foreground: primer.orange[6],
        },
      },
      {
        scope: ["markup.heading", "markup.heading entity.name"],
        settings: {
          fontStyle: "bold",
          foreground: primer.blue[6],
        },
      },
      {
        scope: "markup.quote",
        settings: {
          foreground: primer.green[6],
        },
      },
      {
        scope: "markup.italic",
        settings: {
          fontStyle: "italic",
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: "markup.bold",
        settings: {
          fontStyle: "bold",
          foreground: pick({ light: primer.gray[9], dark: primer.gray[7] }),
        },
      },
      {
        scope: "markup.raw",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: [
          "markup.deleted",
          "meta.diff.header.from-file",
          "punctuation.definition.deleted",
        ],
        settings: {
          background: primer.red[0],
          foreground: primer.red[7],
        },
      },
      {
        scope: [
          "markup.inserted",
          "meta.diff.header.to-file",
          "punctuation.definition.inserted",
        ],
        settings: {
          background: primer.green[0],
          foreground: primer.green[6],
        },
      },
      {
        scope: ["markup.changed", "punctuation.definition.changed"],
        settings: {
          background: primer.orange[1],
          foreground: primer.orange[6],
        },
      },
      {
        scope: ["markup.ignored", "markup.untracked"],
        settings: {
          foreground: primer.gray[1],
          background: primer.blue[6],
        },
      },
      {
        scope: "meta.diff.range",
        settings: {
          foreground: pick({ light: primer.purple[5], dark: primer.purple[6] }),
          fontStyle: "bold",
        },
      },
      {
        scope: "meta.diff.header",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: "meta.separator",
        settings: {
          fontStyle: "bold",
          foreground: primer.blue[6],
        },
      },
      {
        scope: "meta.output",
        settings: {
          foreground: primer.blue[6],
        },
      },
      {
        scope: [
          "brackethighlighter.tag",
          "brackethighlighter.curly",
          "brackethighlighter.round",
          "brackethighlighter.square",
          "brackethighlighter.angle",
          "brackethighlighter.quote",
        ],
        settings: {
          foreground: primer.gray[6],
        },
      },
      {
        scope: "brackethighlighter.unmatched",
        settings: {
          foreground: primer.red[7],
        },
      },
      {
        scope: ["constant.other.reference.link", "string.other.link"],
        settings: {
          foreground: primer.blue[8],
          fontStyle: "underline",
        },
      },
    ],
  };
}

module.exports = getTheme;
