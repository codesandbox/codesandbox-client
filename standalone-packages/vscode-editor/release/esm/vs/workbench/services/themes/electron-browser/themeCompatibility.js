/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Color } from '../../../../base/common/color.js';
import * as colorRegistry from '../../../../platform/theme/common/colorRegistry.js';
import * as editorColorRegistry from '../../../../editor/common/view/editorColorRegistry.js';
import * as wordHighlighter from '../../../../editor/contrib/wordHighlighter/wordHighlighter.js';
import { peekViewEditorMatchHighlight, peekViewResultsMatchHighlight } from '../../../../editor/contrib/referenceSearch/referencesWidget.js';
var settingToColorIdMapping = {};
function addSettingMapping(settingId, colorId) {
    var colorIds = settingToColorIdMapping[settingId];
    if (!colorIds) {
        settingToColorIdMapping[settingId] = colorIds = [];
    }
    colorIds.push(colorId);
}
export function convertSettings(oldSettings, resultRules, resultColors) {
    for (var _i = 0, oldSettings_1 = oldSettings; _i < oldSettings_1.length; _i++) {
        var rule = oldSettings_1[_i];
        resultRules.push(rule);
        if (!rule.scope) {
            var settings = rule.settings;
            if (!settings) {
                rule.settings = {};
            }
            else {
                for (var key in settings) {
                    var mappings = settingToColorIdMapping[key];
                    if (mappings) {
                        var colorHex = settings[key];
                        if (typeof colorHex === 'string') {
                            var color = Color.fromHex(colorHex);
                            for (var _a = 0, mappings_1 = mappings; _a < mappings_1.length; _a++) {
                                var colorId = mappings_1[_a];
                                resultColors[colorId] = color;
                            }
                        }
                    }
                    if (key !== 'foreground' && key !== 'background' && key !== 'fontStyle') {
                        delete settings[key];
                    }
                }
            }
        }
    }
}
addSettingMapping('background', colorRegistry.editorBackground);
addSettingMapping('foreground', colorRegistry.editorForeground);
addSettingMapping('selection', colorRegistry.editorSelectionBackground);
addSettingMapping('inactiveSelection', colorRegistry.editorInactiveSelection);
addSettingMapping('selectionHighlightColor', colorRegistry.editorSelectionHighlight);
addSettingMapping('findMatchHighlight', colorRegistry.editorFindMatchHighlight);
addSettingMapping('currentFindMatchHighlight', colorRegistry.editorFindMatch);
addSettingMapping('hoverHighlight', colorRegistry.editorHoverHighlight);
addSettingMapping('wordHighlight', wordHighlighter.editorWordHighlight);
addSettingMapping('wordHighlightStrong', wordHighlighter.editorWordHighlightStrong);
addSettingMapping('findRangeHighlight', colorRegistry.editorFindRangeHighlight);
addSettingMapping('findMatchHighlight', peekViewResultsMatchHighlight);
addSettingMapping('referenceHighlight', peekViewEditorMatchHighlight);
addSettingMapping('lineHighlight', editorColorRegistry.editorLineHighlight);
addSettingMapping('rangeHighlight', editorColorRegistry.editorRangeHighlight);
addSettingMapping('caret', editorColorRegistry.editorCursorForeground);
addSettingMapping('invisibles', editorColorRegistry.editorWhitespaces);
addSettingMapping('guide', editorColorRegistry.editorIndentGuides);
addSettingMapping('activeGuide', editorColorRegistry.editorActiveIndentGuides);
var ansiColorMap = ['ansiBlack', 'ansiRed', 'ansiGreen', 'ansiYellow', 'ansiBlue', 'ansiMagenta', 'ansiCyan', 'ansiWhite',
    'ansiBrightBlack', 'ansiBrightRed', 'ansiBrightGreen', 'ansiBrightYellow', 'ansiBrightBlue', 'ansiBrightMagenta', 'ansiBrightCyan', 'ansiBrightWhite'
];
for (var i = 0; i < ansiColorMap.length; i++) {
    addSettingMapping(ansiColorMap[i], 'terminal.' + ansiColorMap[i]);
}
