"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./elmUtils");
const vscode = require("vscode");
const path = require("path");
function fileIsTestFile(filename) {
    const config = vscode.workspace.getConfiguration('elm');
    const elmTestLocationMatcher = (config.get('elmTestFileMatcher'));
    const [cwd, elmVersion] = utils.detectProjectRootAndElmVersion(filename, vscode.workspace.rootPath);
    if (utils.isElm019(elmVersion) === false) {
        // we didn't differentiate test/app code for 0.18
        return false;
    }
    const pathFromRoute = path.relative(vscode.workspace.rootPath, filename);
    const isTestFile = pathFromRoute.indexOf(elmTestLocationMatcher) > -1;
    return isTestFile;
}
exports.fileIsTestFile = fileIsTestFile;
//# sourceMappingURL=elmTest.js.map