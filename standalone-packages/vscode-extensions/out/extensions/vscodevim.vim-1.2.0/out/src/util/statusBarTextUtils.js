"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mode_1 = require("../mode/mode");
const statusBar_1 = require("../statusBar");
const configuration_1 = require("../configuration/configuration");
function ReportClear(vimState) {
    statusBar_1.StatusBar.Set('', vimState.currentMode, vimState.isRecordingMacro, true);
}
exports.ReportClear = ReportClear;
function ReportLinesChanged(numLinesChanged, vimState) {
    if (numLinesChanged > configuration_1.configuration.report) {
        statusBar_1.StatusBar.Set(numLinesChanged + ' more lines', vimState.currentMode, vimState.isRecordingMacro, true);
    }
    else if (-numLinesChanged > configuration_1.configuration.report) {
        statusBar_1.StatusBar.Set(Math.abs(numLinesChanged) + ' fewer lines', vimState.currentMode, vimState.isRecordingMacro, true);
    }
    else {
        ReportClear(vimState);
    }
}
exports.ReportLinesChanged = ReportLinesChanged;
function ReportLinesYanked(numLinesYanked, vimState) {
    if (numLinesYanked > configuration_1.configuration.report) {
        if (vimState.currentMode === mode_1.ModeName.VisualBlock) {
            statusBar_1.StatusBar.Set('block of ' + numLinesYanked + ' lines yanked', vimState.currentMode, vimState.isRecordingMacro, true);
        }
        else {
            statusBar_1.StatusBar.Set(numLinesYanked + ' lines yanked', vimState.currentMode, vimState.isRecordingMacro, true);
        }
    }
    else {
        ReportClear(vimState);
    }
}
exports.ReportLinesYanked = ReportLinesYanked;

//# sourceMappingURL=statusBarTextUtils.js.map
