export default {
  // Theme Color reference.
  // https://code.visualstudio.com/docs/getstarted/theme-color-reference
  $schema: 'vscode://schemas/color-theme',
  name: 'Shades of Purple',
  type: 'dark',
  colors: {
    // Activity Bar.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_activity-bar
    'activityBar.background': '#28284e',
    'activityBar.border': '#292952',
    'activityBar.dropBackground': '#222145',
    // "activityBar.foreground": "#A599E9",
    'activityBar.foreground': '#FFFFFF',
    'activityBarBadge.background': '#FAD000',
    'activityBarBadge.foreground': '#28284e',
    // Sidebar.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_side-bar
    'sideBar.background': '#222244',
    'sideBar.border': '#25254b',
    'sideBar.foreground': '#A599E9',
    'sideBarSectionHeader.background': '#1E1E3F',
    'sideBarSectionHeader.foreground': '#A599E9',
    'sideBarTitle.foreground': '#A599E9',
    // Badge.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_badge
    'badge.background': '#FAD000',
    'badge.foreground': '#222244',
    // Button.
    // https: //code.visualstudio.com/docs/getstarted/theme-color-reference#_button-control
    'button.background': '#FAD000',
    'button.foreground': '#222244',
    'button.hoverBackground': '#A599E9',
    // Contrast.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_contrast-colors
    contrastActiveBorder: null,
    contrastBorder: '#ffffff00',
    // Base Colors.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_base-colors
    // Foreground color for description text providing additional information, for example for a label.
    descriptionForeground: '#A599E9', // @TODO aaa
    'selection.background': '#b362ff',
    // Dropdown.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_dropdown-control
    'dropdown.background': '#1E1E3F',
    'dropdown.border': '#1E1E3F',
    'dropdown.foreground': '#FFFFFF',
    // ——— Editor ———
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_editor-colors
    'editor.background': '#2D2B55', // Editor background color.
    'editor.foreground': '#FFFFFF', // Editor default foreground color.
    'editorLineNumber.foreground': '#A599E9', // Color of editor line numbers.
    'editorCursor.foreground': '#FAD000', //  Color of the editor cursor.
    //  The slection color battle starts here.
    'editor.selectionBackground': '#b362ff88', // Color of the editor selection.
    'editor.inactiveSelectionBackground': '#7580b8c0', // Color of the selection in an inactive editor. The color must not be opaque to not hide underlying decorations.
    'editor.selectionHighlightBackground': '#7e46df46', // Color for regions with the same content as the selection. The color must not be opaque to not hide underlying decorations.
    'editor.wordHighlightBackground': '#FFFFFF0D', // Same words other places.
    'editor.wordHighlightStrongBackground': '#FFFFFF0D', // Cursor inside current vairable.
    'editor.findMatchBackground': '#FF7200', // Color of the current search match.
    'editor.findMatchHighlightBackground': '#ff730056', // Color of the other search matches.The color must not be opaque to not hide underlying decorations.
    'editor.findRangeHighlightBackground': '#ff730056', // No idea. Color the range limiting the search (Enable 'Find in Selection' in the find widget). The color must not be opaque to not hide underlying decorations.
    'editor.hoverHighlightBackground': '#ff730056', // Highlight below the word for which a hover is shown. The color must not be opaque to not hide underlying decorations
    'editor.lineHighlightBackground': '#1F1F41', // Current line of code. Background color for the highlight of line at the cursor position.
    'editor.lineHighlightBorder': '#1F1F41',
    'editor.rangeHighlightBackground': '#1F1F41',
    'editorLink.activeForeground': '#A599E9',
    'editorIndentGuide.background': '#a599e90f',
    'editorIndentGuide.activeBackground': '#a599e942',
    'editorRuler.foreground': '#a599e91c', // Editor Ruler.
    'editorOverviewRuler.border': '#a599e91c',
    'editorCodeLens.foreground': '#A599E9',
    'editorBracketMatch.background': '#ad70fc46',
    'editorBracketMatch.border': '#ad70fc46',
    // Overview ruler is located beneath the scroll bar on the right edge of the editor and gives an overview of the decorations in the editor.
    'editorOverviewRuler.commonContentForeground': '#ffc60055',
    'editorOverviewRuler.currentContentForeground': '#ee3a4355',
    'editorOverviewRuler.incomingContentForeground': '#3ad90055',
    // Errors and warnings:
    // "editorError.border": "#ec3a37f5",
    'editorError.foreground': '#ec3a37f5',
    'editorWarning.border': '#ffffff00',
    'editorWarning.foreground': '#FAD000',
    // Gutter: The gutter contains the glyph margins and the line numbers:
    'editorGutter.background': '#28284e',
    'editorGutter.addedBackground': '#35ad68',
    'editorGutter.deletedBackground': '#ec3a37f5',
    'editorGutter.modifiedBackground': '#ad70fc46',
    // Diff Editor.
    // https: //code.visualstudio.com/docs/getstarted/theme-color-reference#_diff-editor-colors
    'diffEditor.insertedTextBackground': '#00ff000e',
    'diffEditor.insertedTextBorder': '#00ff009a',
    'diffEditor.removedTextBackground': '#ff000d1a',
    'diffEditor.removedTextBorder': '#ff000d81',
    // Editor Groups & Tabs.
    // "editorGroup.background": "#ec3a37f5", // Deprecated in v1.25
    'editorGroup.border': '#222244',
    'editorGroup.dropBackground': '#222244d0',
    // The editorGroupHeader.
    'editorGroupHeader.noTabsBackground': '#2D2B55',
    'editorGroupHeader.tabsBackground': '#2D2B55',
    'editorGroupHeader.tabsBorder': '#1F1F41',
    // The tabs
    'tab.activeBackground': '#222244',
    'tab.activeForeground': '#FFFFFF',
    'tab.border': '#1E1E3F',
    'tab.activeBorder': '#FAD000',
    'tab.inactiveBackground': '#2D2B55',
    'tab.inactiveForeground': '#A599E9',
    'tab.unfocusedActiveForeground': '#A599E9',
    'tab.unfocusedInactiveForeground': '#A599E9',
    // The Editor widget is shown in front of the editor content. Examples are the Find/Replace dialog, the suggestion widget, and the editor hover.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_editor-widget-colors
    'editorWidget.background': '#222244',
    'editorWidget.border': '#1F1F41',
    'editorHoverWidget.background': '#1F1F41',
    'editorHoverWidget.border': '#1F1F41',
    'editorSuggestWidget.background': '#1F1F41',
    'editorSuggestWidget.border': '#1F1F41',
    'editorSuggestWidget.foreground': '#A599E9',
    'editorSuggestWidget.highlightForeground': '#FAD000',
    'editorSuggestWidget.selectedBackground': '#2D2B55',
    // Debug.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_debug
    'debugToolBar.background': '#1E1E3F',
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_editor-widget-colors
    'debugExceptionWidget.background': '#1E1E3F',
    'debugExceptionWidget.border': '#A599E9',
    // The editor marker view shows when navigating to errors and warnings in the editor (Go to Next Error or Warning command).
    'editorMarkerNavigation.background': '#3B536433',
    'editorMarkerNavigationError.background': '#ec3a37f5',
    'editorMarkerNavigationWarning.background': '#FAD000',
    // To see the editor white spaces, enable Toggle Render Whitespace.
    'editorWhitespace.foreground': '#ffffff1a',
    errorForeground: '#ec3a37f5',
    // Extensions.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_extensions
    'extensionButton.prominentBackground': '#5D37F0',
    'extensionButton.prominentForeground': '#FFFFFF',
    'extensionButton.prominentHoverBackground': '#ff9d00',
    focusBorder: '#1E1E3F',
    foreground: '#A599E9',
    // Input Control.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_input-control
    'input.background': '#2D2B55',
    'input.border': '#1E1E3F',
    'input.foreground': '#FAD000',
    'input.placeholderForeground': '#A599E9',
    'inputOption.activeBorder': '#A599E9',
    'inputValidation.errorBackground': '#2D2B55',
    'inputValidation.errorBorder': '#FAD000',
    'inputValidation.infoBackground': '#2D2B55',
    'inputValidation.infoBorder': '#2D2B55',
    'inputValidation.warningBackground': '#2D2B55',
    'inputValidation.warningBorder': '#FAD000',
    // Lists and Trees.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_lists-and-trees
    'list.activeSelectionBackground': '#1E1E3F',
    'list.activeSelectionForeground': '#FFFFFF',
    'list.dropBackground': '#1E1E3F',
    'list.focusBackground': '#1E1E3F',
    'list.focusForeground': '#FFFFFF',
    'list.highlightForeground': '#FAD000',
    'list.hoverBackground': '#2D2B55',
    'list.hoverForeground': '#cec5ff',
    'list.inactiveSelectionBackground': '#2D2B55',
    'list.inactiveSelectionForeground': '#aaa',
    // Merge Conflicts.
    'merge.border': '#ffffff00',
    'merge.commonContentBackground': '#ffffff00',
    'merge.commonHeaderBackground': '#ffffff00',
    'merge.currentContentBackground': '#ffffff00',
    'merge.currentHeaderBackground': '#ffffff00',
    'merge.incomingContentBackground': '#ffffff00',
    'merge.incomingHeaderBackground': '#ffffff00',
    // Notification Colors.
    'notificationCenter.border': '#1E1E3F', // Notification Center border color.
    'notificationCenterHeader.foreground': '#ffffff', // Notification Center header foreground color.
    'notificationCenterHeader.background': '#6943ff', // Notification Center header background color.
    'notificationToast.border': '#1E1E3F', // Notification toast border color.
    'notifications.foreground': '#cec5ff', // Notification foreground color.
    'notifications.background': '#1E1E3F', // Notification background color.
    'notifications.border': '#2D2B55', // Notification border color separating from other notifications in the Notification Center.
    'notificationLink.foreground': '#ffffff', // Notification links foreground color.
    // Panel.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_panel-colors
    'panel.background': '#1E1E3F',
    'panel.border': '#FAD000',
    'panelTitle.activeBorder': '#FAD000',
    'panelTitle.activeForeground': '#FAD000',
    'panelTitle.inactiveForeground': '#A599E9',
    // Peek View Colors.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_peek-view-colors
    'peekView.border': '#FAD000',
    'peekViewEditor.background': '#1E1E3F',
    'peekViewEditor.matchHighlightBackground': '#19354900',
    'peekViewEditorGutter.background': '#191935',
    'peekViewResult.background': '#1E1E3F',
    'peekViewResult.fileForeground': '#aaa',
    'peekViewResult.lineForeground': '#FFFFFF',
    'peekViewResult.matchHighlightBackground': '#2D2B55',
    'peekViewResult.selectionBackground': '#2D2B55',
    'peekViewResult.selectionForeground': '#FFFFFF',
    'peekViewTitle.background': '#1F1F41',
    'peekViewTitleDescription.foreground': '#aaa',
    'peekViewTitleLabel.foreground': '#FAD000',
    // Quick Picker.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_quick-picker
    'pickerGroup.border': '#1E1E3F',
    'pickerGroup.foreground': '#A599E9',
    // Progress Bar.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_progress-bar
    'progressBar.background': '#FAD000',
    // Scroll Bar Control.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_scroll-bar-control
    'scrollbar.shadow': '#00000000',
    'scrollbarSlider.activeBackground': '#1e1e3fda',
    'scrollbarSlider.background': '#1e1e3f9d',
    'scrollbarSlider.hoverBackground': '#1e1e3fd7',
    // Status Bar Colors.
    // The Status Bar is shown in the bottom of the workbench.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_status-bar-colors
    'statusBar.background': '#1E1E3F',
    'statusBar.border': '#1E1E3F',
    'statusBar.debuggingBackground': '#1E1E3F',
    'statusBar.debuggingForeground': '#1E1E3F',
    'statusBar.foreground': '#A599E9',
    'statusBar.noFolderBackground': '#1E1E3F',
    'statusBar.noFolderForeground': '#A599E9',
    'statusBarItem.activeBackground': '#4d21fc',
    'statusBarItem.hoverBackground': '#2D2B55',
    'statusBarItem.prominentBackground': '#1E1E3F',
    'statusBarItem.prominentHoverBackground': '#2D2B55',
    // Integrated Terminal Colors.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_integrated-terminal-colors
    'terminal.ansiBlack': '#000000',
    'terminal.ansiRed': '#ec3a37f5',
    'terminal.ansiGreen': '#3ad900',
    'terminal.ansiYellow': '#FAD000',
    'terminal.ansiBlue': '#6943ff',
    'terminal.ansiMagenta': '#ff2c70',
    'terminal.ansiCyan': '#80fcff',
    'terminal.ansiWhite': '#ffffff',
    'terminal.ansiBrightBlack': '#5C5C61',
    'terminal.ansiBrightRed': '#ec3a37f5',
    'terminal.ansiBrightGreen': '#3ad900',
    'terminal.ansiBrightYellow': '#FAD000',
    'terminal.ansiBrightBlue': '#6943ff',
    'terminal.ansiBrightMagenta': '#fb94ff',
    'terminal.ansiBrightCyan': '#80fcff',
    'terminal.ansiBrightWhite': '#2D2B55',
    'terminal.background': '#1E1E3F',
    'terminal.foreground': '#ffffff',
    'terminalCursor.background': '#FAD000',
    'terminalCursor.foreground': '#FAD000',
    // Git VS Code theme Colors used for file labels and the SCM viewlet.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_git-colors
    'gitDecoration.modifiedResourceForeground': '#FAD000', // Color for modified git resources.
    'gitDecoration.deletedResourceForeground': '#ec3a37f5', // Color for deleted git resources.
    'gitDecoration.untrackedResourceForeground': '#3ad900', // Color for untracked git resources.
    'gitDecoration.ignoredResourceForeground': '#a599e981', // Color for ignored git resources.
    'gitDecoration.conflictingResourceForeground': '#FF7200', // Color for conflicting git resources.
    // Text Colors — Colors inside a text document, such as the welcome page.
    // https://code.visualstudio.com/docs/getstarted/theme-color-reference#_text-colors
    'textBlockQuote.background': '#1E1E3F',
    'textBlockQuote.border': '#6943ff',
    'textCodeBlock.background': '#1E1E3F',
    'textLink.activeForeground': '#b362ff',
    'textLink.foreground': '#b362ff',
    'textPreformat.foreground': '#FAD000',
    'textSeparator.foreground': '#1E1E3F',
    // Title bar.
    'titleBar.activeBackground': '#1E1E3F',
    'titleBar.activeForeground': '#FFFFFF',
    'titleBar.inactiveBackground': '#1E1E3F',
    'titleBar.inactiveForeground': '#A599E9',
    'walkThrough.embeddedEditorBackground': '#1E1E3F',
    'welcomePage.buttonBackground': '#1E1E3F',
    'welcomePage.buttonHoverBackground': '#1E1E3F',
    'widget.shadow': '#00000026',
  },
  // Token Colors are heavily inspired by several themes
  // Including but not limited to Material Palenight, Cobalt
  // theme's syntax and several custom setup via Dev scope ext.
  tokenColors: [
    {
      name: '[COMMENTS] — The main comments color',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        fontStyle: 'italic',
        foreground: '#b362ff',
      },
    },
    {
      name: '[Entity] — The main Entity color',
      scope: 'entity',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[Constant] — The main constants color',
      scope: 'constant',
      settings: {
        foreground: '#ff628c',
      },
    },
    {
      name: '[Keyword] — The main color for Keyword',
      scope: 'keyword, storage.type.class.js',
      settings: {
        foreground: '#ff9d00',
      },
    },
    {
      name: '[Meta] — The main color for Meta',
      scope: 'meta',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[invalid] — The main color for invalid',
      scope: 'invalid',
      settings: {
        foreground: '#ec3a37f5',
      },
    },
    {
      name: '[Meta Brace] — The main color for Meta Brace',
      scope: 'meta.brace',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[Punctuation] — The main color for Punctuation',
      scope: 'punctuation',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[Punctuation] — Color for Punctuation Parameters',
      scope: 'punctuation.definition.parameters',
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[Punctuation] — Color for Punctuation Template Expression',
      scope: 'punctuation.definition.template-expression',
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[Storage] — The main color for Storage',
      scope: 'storage',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[Storage] — The color for Storage Type Arrow Function',
      scope: 'storage.type.function.arrow',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[String]',
      scope: ['string', 'punctuation.definition.string'],
      settings: {
        foreground: '#a5ff90',
      },
    },
    {
      name: '[String] Template Color',
      scope: ['string.template', 'punctuation.definition.string.template'],
      settings: {
        foreground: '#3ad900',
      },
    },
    {
      name: '[Support]',
      scope: 'support',
      settings: {
        foreground: '#80ffbb',
      },
    },
    {
      name: '[Support] Function Colors',
      scope: 'support.function',
      settings: {
        foreground: '#ff9d00',
      },
    },
    {
      name: '[Support] Variable Property DOM Colors',
      scope: 'support.variable.property.dom',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[Variable]',
      scope: 'variable',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[INI] - Color for Entity',
      scope: 'source.ini entity',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[INI] - Color for Keyword',
      scope: 'source.ini keyword',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[INI] - Color for Punctuation Definition',
      scope: 'source.ini punctuation.definition',
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[INI] - Color for Punctuation Separator',
      scope: 'source.ini punctuation.separator',
      settings: {
        foreground: '#ff9d00',
      },
    },
    {
      name: '[CSS] - Color for Entity',
      scope: ['source.css entity', 'source.stylus entity'],
      settings: {
        foreground: '#3ad900',
      },
    },
    {
      name: '[CSS] - Color for ID Selector',
      scope: 'entity.other.attribute-name.id.css',
      settings: {
        foreground: '#FFB454',
      },
    },
    {
      name: '[CSS] - Color for Element Selector',
      scope: 'entity.name.tag',
      settings: {
        foreground: '#9EFFFF',
      },
    },
    {
      name: '[CSS] - Color for Support',
      scope: ['source.css support', 'source.stylus support'],
      settings: {
        foreground: '#a5ff90',
      },
    },
    {
      name: '[CSS] - Color for Constant',
      scope: [
        'source.css constant',
        'source.css support.constant',
        'source.stylus constant',
        'source.stylus support.constant',
      ],
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[CSS] - Color for String',
      scope: [
        'source.css string',
        'source.css punctuation.definition.string',
        'source.stylus string',
        'source.stylus punctuation.definition.string',
      ],
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[CSS] - Color for Variable',
      scope: ['source.css variable', 'source.stylus variable'],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[HTML] - Color for Entity Name',
      scope: 'text.html.basic entity.name',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[HTML] - Color for ID value',
      scope: 'meta.toc-list.id.html',
      settings: {
        foreground: '#A5FF90',
      },
    },
    {
      name: '[HTML] - Color for Entity Other',
      scope: 'text.html.basic entity.other',
      settings: {
        fontStyle: 'italic',
        foreground: '#FAD000',
      },
    },
    {
      name: '[HTML] - Color for Script Tag',
      scope: 'meta.tag.metadata.script.html entity.name.tag.html',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[HTML] - Quotes. Different color to handle expanded selection',
      scope:
        'punctuation.definition.string.begin, punctuation.definition.string.end',
      settings: {
        foreground: '#92fc79',
      },
    },
    {
      name: '[JSON] - Color for Support',
      scope: 'source.json support',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[JSON] - Color for String',
      scope: [
        'source.json string',
        'source.json punctuation.definition.string',
      ],
      settings: {
        // "foreground": "#ex1efff" // remove x.
        foreground: '#92fc79',
      },
    },
    {
      name: '[JAVASCRIPT] - Color for Storage Type Function',
      scope: 'source.js storage.type.function',
      settings: {
        foreground: '#fb94ff',
      },
    },
    {
      name: '[JAVASCRIPT] - Color for Variable Language',
      scope: 'variable.language, entity.name.type.class.js',
      settings: {
        foreground: '#fb94ff',
      },
    },
    {
      name: '[JAVASCRIPT] - Color for Inherited Component',
      scope: 'entity.other.inherited-class.js',
      settings: {
        foreground: '#ccc',
      },
    },
    {
      name: '[JAVASCRIPT] - Color for React Extends keyword',
      scope: 'storage.type.extends.js',
      settings: {
        foreground: '#ff9d00',
      },
    },
    {
      name: '[JAVASCRIPT] — Typescript/React Attributes',
      scope: [
        'entity.other.attribute-name.tsx',
        'entity.other.attribute-name.jsx',
      ],
      settings: {
        fontStyle: 'italic',
      },
    },
    {
      name: 'Typescript React Assignment Operator',
      scope: [
        'keyword.operator.assignment.tsx',
        'keyword.operator.assignment.jsx',
      ],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[JAVASCRIPT] Typescript/React Children',
      scope: 'meta.jsx.children.tsx',
      settings: {
        foreground: '#ffffff',
      },
    },
    {
      name: 'Typescript/React Classnames and Modules',
      scope: [
        'entity.name.type.class.tsx',
        'entity.name.type.class.jsx',
        'entity.name.type.module.tsx',
        'entity.name.type.module.jsx',
        'entity.other.inherited-class.tsx',
        'entity.other.inherited-class.jsx',
        'variable.other.readwrite.alias.tsx',
        'variable.other.readwrite.alias.jsx',
        'variable.other.object.tsx',
        'variable.other.object.jsx',
        'support.class.component.tsx',
        'support.class.component.jsx',
        'entity.name.type.tsx',
        'entity.name.type.jsx',
        'variable.other.readwrite.js',
        'variable.other.object.js',
        'variable.other.property.js',
      ],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[JAVASCRIPT] - Color for Text inside JSX',
      scope: 'JSXNested',
      settings: {
        foreground: '#ffffff',
      },
    },
    {
      name: '[PYTHON] - Color for Self Argument',
      scope: 'variable.parameter.function.language.special.self.python',
      settings: {
        foreground: '#fb94ff',
      },
    },
    {
      name: '[TYPESCRIPT] - Color for Entity Name Type',
      scope: 'source.ts entity.name.type',
      settings: {
        foreground: '#80ffbb',
      },
    },
    {
      name: '[TYPESCRIPT] - Color for Keyword',
      scope: 'source.ts keyword',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[TYPESCRIPT] - Color for Punctuation Parameters',
      scope: 'source.ts punctuation.definition.parameters',
      settings: {
        foreground: '#e1efff',
      },
    },
    {
      name: '[TYPESCRIPT] - Color for Punctuation Arrow Parameters',
      scope: 'meta.arrow.ts punctuation.definition.parameters',
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[TYPESCRIPT] - Color for Storage',
      scope: 'source.ts storage',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[MARKDOWN] - Color for Heading Name Section',
      scope: [
        'entity.name.section.markdown',
        'markup.heading.setext.1.markdown',
        'markup.heading.setext.2.markdown',
      ],
      settings: {
        foreground: '#FAD000',
        fontStyle: 'bold',
      },
    },
    {
      name: '[MARKDOWN] - Color for Paragraph',
      scope: 'meta.paragraph.markdown',
      settings: {
        foreground: '#ffffff',
      },
    },
    {
      name: '[MARKDOWN] - Color for Text inside inline code block `code`',
      scope: 'markup.inline.raw.string.markdown',
      settings: {
        foreground: '#A599E9',
      },
    },
    {
      name: '[MARKDOWN] - Color for Quote Punctuation',
      scope: 'beginning.punctuation.definition.quote.markdown',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[MARKDOWN] - Color for Quote Paragraph',
      scope: 'markup.quote.markdown meta.paragraph.markdown',
      settings: {
        fontStyle: 'italic',
        foreground: '#A599E9',
      },
    },
    {
      name: '[MARKDOWN] - Color for Separator',
      scope: 'meta.separator.markdown',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[MARKDOWN] - Color for Emphasis Bold',
      scope: 'markup.bold.markdown',
      settings: {
        fontStyle: 'bold',
        foreground: '#A599E9',
      },
    },
    {
      name: '[MARKDOWN] - Color for Emphasis Italic',
      scope: 'markup.italic.markdown',
      settings: {
        fontStyle: 'italic',
        foreground: '#A599E9',
      },
    },
    {
      name: '[MARKDOWN] - Color for Lists',
      scope: 'beginning.punctuation.definition.list.markdown',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[MARKDOWN] - Color for Link Title',
      scope: 'string.other.link.title.markdown',
      settings: {
        foreground: '#a5ff90',
      },
    },
    {
      name: '[MARKDOWN] - Color for Link/Image Title',
      scope: [
        'string.other.link.title.markdown',
        'string.other.link.description.markdown',
        'string.other.link.description.title.markdown',
      ],
      settings: {
        foreground: '#a5ff90',
      },
    },
    {
      name: '[MARKDOWN] - Color for Link Address',
      scope: [
        'markup.underline.link.markdown',
        'markup.underline.link.image.markdown',
      ],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[MARKDOWN] - Color for Inline Code',
      scope: ['fenced_code.block.language', 'markup.inline.raw.markdown'],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name:
        '[MARKDOWN] - Color for Punctuation — Heading, `Code` and fenced ```code blocks```, **Bold**',
      scope: [
        // "markup.fenced_code.block.markdown", // FIXME: Issue with fenced code and CSS.
        'punctuation.definition.markdown',
        'punctuation.definition.raw.markdown',
        'punctuation.definition.heading.markdown',
        'punctuation.definition.bold.markdown',
      ],
      settings: {
        foreground: '#494685',
      },
    },
    {
      name: '[MARKDOWN] - Color for Code Block',
      scope: ['fenced_code.block.language', 'markup.inline.raw.markdown'],
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[PUG] - Color for Entity Name',
      scope: 'text.jade entity.name',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[PUG] - Color for Entity Attribute Name',
      scope: 'text.jade entity.other.attribute-name.tag',
      settings: {
        fontStyle: 'italic',
      },
    },
    {
      name: '[PUG] - Color for String Interpolated',
      scope: 'text.jade string.interpolated',
      settings: {
        foreground: '#ffee80',
      },
    },
    {
      name: '[C#] - Color for Annotations',
      scope: 'storage.type.cs',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[C#] - Color for Properties',
      scope: 'entity.name.variable.property.cs',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[C#] - Color for Storage modifiers',
      scope: 'storage.modifier.cs',
      settings: {
        foreground: '#80ffbb',
      },
    },
    {
      name: '[PHP] - Color for Entity',
      scope: 'source.php entity',
      settings: {
        foreground: '#9effff',
      },
    },
    {
      name: '[PHP] - Color for Variables',
      scope: 'variable.other.php',
      settings: {
        foreground: '#FAD000',
      },
    },
    {
      name: '[PHP] - Color for Storage Modifiers',
      scope: 'storage.modifier.php',
      settings: {
        foreground: '#ff9d00',
      },
    },
    {
      name: 'Operator Mono font has awesome itallics',
      scope: [
        'modifier',
        'this',
        'comment',
        'storage.modifier.js',
        'entity.other.attribute-name.js',
        'entity.other.attribute-name.html',
      ],
      settings: {
        fontStyle: 'italic',
      },
    },
  ],
};
