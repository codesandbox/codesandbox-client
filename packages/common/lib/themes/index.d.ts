declare const _default: ({
    name: string;
    id: string;
    content: {
        "$schema": string;
        "isCodeSandbox": boolean;
        "type": string;
        "colors": {
            "editor.background": string;
            "editor.foreground": string;
            "editor.selectionBackground": string;
        };
        "tokenColors": ({
            "name": string;
            "scope": string[];
            "settings": {
                "foreground": string;
                "fontStyle": string;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "background": string;
                "foreground": string;
                "fontStyle"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "text-decoration": string;
                "foreground"?: undefined;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "-webkit-font-smoothing": string;
                "foreground"?: undefined;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
            };
        } | {
            "name": string;
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle": string;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
            "name"?: undefined;
        })[];
    };
    url?: undefined;
    type?: undefined;
    get?: undefined;
} | {
    name: string;
    id: string;
    url: string;
    content?: undefined;
    type?: undefined;
    get?: undefined;
} | {
    name: string;
    id: string;
    type: string;
    url: string;
    content?: undefined;
    get?: undefined;
} | {
    name: string;
    id: string;
    get: () => Promise<{
        "$schema": string;
        "type": string;
        "colors": {
            "editor.background": string;
            "editor.foreground": string;
            "editor.selectionBackground": string;
            "selection.background": string;
            "activityBar.background": string;
            "activityBar.border": string;
            "activityBar.dropBackground": string;
            "activityBar.foreground": string;
            "activityBarBadge.background": string;
            "activityBarBadge.foreground": string;
            "badge.background": string;
            "badge.foreground": string;
            "button.foreground": string;
            "contrastActiveBorder": string;
            "contrastBorder": string;
            "debugExceptionWidget.background": string;
            "debugExceptionWidget.border": string;
            "debugToolBar.background": string;
            "descriptionForeground": string;
            "diffEditor.insertedTextBorder": string;
            "diffEditor.removedTextBorder": string;
            "dropdown.background": string;
            "dropdown.border": string;
            "dropdown.foreground": string;
            "dropdown.listBackground": string;
            "editor.findMatchBorder": string;
            "editor.findMatchHighlightBorder": string;
            "editor.findRangeHighlightBorder": string;
            "editor.hoverHighlightBackground": string;
            "editor.inactiveSelectionBackground": string;
            "editor.lineHighlightBorder": string;
            "editor.rangeHighlightBorder": string;
            "editor.selectionForeground": string;
            "editor.selectionHighlightBorder": string;
            "editor.wordHighlightBorder": string;
            "editor.wordHighlightStrongBorder": string;
            "editorActiveLineNumber.foreground": string;
            "editorBracketMatch.background": string;
            "editorBracketMatch.border": string;
            "editorCodeLens.foreground": string;
            "editorCursor.foreground": string;
            "editorError.border": string;
            "editorGroup.border": string;
            "editorGroup.focusedEmptyBorder": string;
            "editorGroupHeader.noTabsBackground": string;
            "editorGroupHeader.tabsBorder": string;
            "editorGutter.addedBackground": string;
            "editorGutter.background": string;
            "editorGutter.deletedBackground": string;
            "editorGutter.modifiedBackground": string;
            "editorHint.border": string;
            "editorHoverWidget.background": string;
            "editorHoverWidget.border": string;
            "editorIndentGuide.activeBackground": string;
            "editorIndentGuide.background": string;
            "editorInfo.border": string;
            "editorLineNumber.activeForeground": string;
            "editorLineNumber.foreground": string;
            "editorLink.activeForeground": string;
            "editorMarkerNavigation.background": string;
            "editorMarkerNavigationError.background": string;
            "editorMarkerNavigationInfo.background": string;
            "editorMarkerNavigationWarning.background": string;
            "editorOverviewRuler.addedForeground": string;
            "editorOverviewRuler.border": string;
            "editorOverviewRuler.bracketMatchForeground": string;
            "editorOverviewRuler.commonContentForeground": string;
            "editorOverviewRuler.currentContentForeground": string;
            "editorOverviewRuler.deletedForeground": string;
            "editorOverviewRuler.errorForeground": string;
            "editorOverviewRuler.findMatchForeground": string;
            "editorOverviewRuler.incomingContentForeground": string;
            "editorOverviewRuler.infoForeground": string;
            "editorOverviewRuler.modifiedForeground": string;
            "editorOverviewRuler.rangeHighlightForeground": string;
            "editorOverviewRuler.selectionHighlightForeground": string;
            "editorOverviewRuler.warningForeground": string;
            "editorOverviewRuler.wordHighlightForeground": string;
            "editorOverviewRuler.wordHighlightStrongForeground": string;
            "editorPane.background": string;
            "editorRuler.foreground": string;
            "editorSuggestWidget.background": string;
            "editorSuggestWidget.border": string;
            "editorSuggestWidget.foreground": string;
            "editorSuggestWidget.highlightForeground": string;
            "editorUnnecessaryCode.border": string;
            "editorWarning.border": string;
            "editorWhitespace.foreground": string;
            "editorWidget.background": string;
            "editorWidget.border": string;
            "errorForeground": string;
            "focusBorder": string;
            "foreground": string;
            "gitDecoration.addedResourceForeground": string;
            "gitDecoration.conflictingResourceForeground": string;
            "gitDecoration.deletedResourceForeground": string;
            "gitDecoration.ignoredResourceForeground": string;
            "gitDecoration.modifiedResourceForeground": string;
            "gitDecoration.submoduleResourceForeground": string;
            "gitDecoration.untrackedResourceForeground": string;
            "input.background": string;
            "input.border": string;
            "input.foreground": string;
            "inputOption.activeBorder": string;
            "inputValidation.errorBackground": string;
            "inputValidation.errorBorder": string;
            "inputValidation.infoBackground": string;
            "inputValidation.infoBorder": string;
            "inputValidation.warningBackground": string;
            "inputValidation.warningBorder": string;
            "list.highlightForeground": string;
            "list.invalidItemForeground": string;
            "merge.border": string;
            "notificationCenter.border": string;
            "notificationCenterHeader.background": string;
            "notificationLink.foreground": string;
            "notificationToast.border": string;
            "notifications.background": string;
            "notifications.border": string;
            "panel.background": string;
            "panel.border": string;
            "panel.dropBackground": string;
            "panelTitle.activeBorder": string;
            "panelTitle.activeForeground": string;
            "panelTitle.inactiveForeground": string;
            "peekView.border": string;
            "peekViewEditor.background": string;
            "peekViewEditor.matchHighlightBorder": string;
            "peekViewEditorGutter.background": string;
            "peekViewResult.background": string;
            "peekViewResult.fileForeground": string;
            "peekViewResult.lineForeground": string;
            "peekViewResult.selectionForeground": string;
            "peekViewTitle.background": string;
            "peekViewTitleDescription.foreground": string;
            "peekViewTitleLabel.foreground": string;
            "pickerGroup.border": string;
            "pickerGroup.foreground": string;
            "progressBar.background": string;
            "scrollbarSlider.activeBackground": string;
            "scrollbarSlider.background": string;
            "scrollbarSlider.hoverBackground": string;
            "settings.modifiedItemForeground": string;
            "sideBar.background": string;
            "sideBar.border": string;
            "sideBar.dropBackground": string;
            "statusBar.border": string;
            "statusBar.debuggingBackground": string;
            "statusBar.debuggingBorder": string;
            "statusBar.debuggingForeground": string;
            "statusBar.foreground": string;
            "statusBar.noFolderBorder": string;
            "statusBar.noFolderForeground": string;
            "statusBarItem.activeBackground": string;
            "statusBarItem.hoverBackground": string;
            "statusBarItem.prominentBackground": string;
            "statusBarItem.prominentHoverBackground": string;
            "tab.activeBackground": string;
            "tab.activeForeground": string;
            "tab.border": string;
            "tab.inactiveForeground": string;
            "tab.unfocusedActiveForeground": string;
            "tab.unfocusedInactiveForeground": string;
            "terminal.ansiBlack": string;
            "terminal.ansiBlue": string;
            "terminal.ansiBrightBlack": string;
            "terminal.ansiBrightBlue": string;
            "terminal.ansiBrightCyan": string;
            "terminal.ansiBrightGreen": string;
            "terminal.ansiBrightMagenta": string;
            "terminal.ansiBrightRed": string;
            "terminal.ansiBrightWhite": string;
            "terminal.ansiBrightYellow": string;
            "terminal.ansiCyan": string;
            "terminal.ansiGreen": string;
            "terminal.ansiMagenta": string;
            "terminal.ansiRed": string;
            "terminal.ansiWhite": string;
            "terminal.ansiYellow": string;
            "terminal.foreground": string;
            "terminal.selectionBackground": string;
            "textBlockQuote.border": string;
            "textCodeBlock.background": string;
            "textLink.activeForeground": string;
            "textLink.foreground": string;
            "textPreformat.foreground": string;
            "textSeparator.foreground": string;
            "titleBar.activeBackground": string;
            "titleBar.activeForeground": string;
            "titleBar.border": string;
        };
        "tokenColors": ({
            "scope": string[];
            "settings": {
                "foreground": string;
                "background": string;
            };
        } | {
            "scope": string;
            "settings": {
                "fontStyle": string;
            };
        } | {
            "scope": string;
            "settings": {
                "foreground": string;
            };
        } | {
            "scope": string[];
            "settings": {
                "foreground": string;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "foreground": string;
            };
        } | {
            "name": string;
            "scope": string;
            "settings": {
                "foreground": string;
            };
        })[];
    }>;
    content?: undefined;
    url?: undefined;
    type?: undefined;
} | {
    name: string;
    id: string;
    get: () => Promise<typeof import("./vscode-light.js")>;
    content?: undefined;
    url?: undefined;
    type?: undefined;
})[];
export default _default;
