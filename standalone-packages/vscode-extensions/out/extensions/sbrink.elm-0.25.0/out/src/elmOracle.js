"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const path = require("path");
const userProject = require("./elmUserProject");
const vscode = require("vscode");
const elmDelphi_1 = require("./elmDelphi");
const elmUtils_1 = require("./elmUtils");
const elmUtils_2 = require("./elmUtils");
var OracleAction;
(function (OracleAction) {
    OracleAction[OracleAction["IsHover"] = 0] = "IsHover";
    OracleAction[OracleAction["IsAutocomplete"] = 1] = "IsAutocomplete";
})(OracleAction = exports.OracleAction || (exports.OracleAction = {}));
const config = vscode.workspace.getConfiguration('elm');
let oraclePath = elmUtils_2.pluginPath +
    path.sep +
    'node_modules' +
    path.sep +
    'elm-oracle' +
    path.sep +
    'bin' +
    path.sep +
    'elm-oracle';
function GetOracleResults(document, position, action) {
    return new Promise((resolve, reject) => {
        let p;
        let filename = document.fileName;
        let [cwd, elmVersion] = elmUtils_2.detectProjectRootAndElmVersion(document.fileName, vscode.workspace.rootPath) || vscode.workspace.rootPath;
        let fn = path.relative(cwd, filename);
        let wordAtPosition = document.getWordRangeAtPosition(position);
        if (!wordAtPosition) {
            return resolve(null);
        }
        let currentWord = document.getText(wordAtPosition);
        if (elmVersion === '0.18') {
            p = cp.execFile('node', [oraclePath, fn, currentWord], { cwd: cwd }, (err, stdout, stderr) => {
                try {
                    if (err) {
                        return resolve(null);
                    }
                    const result = [
                        ...JSON.parse(stdout),
                        ...(config['userProjectIntellisense']
                            ? userProject.userProject(document, position, currentWord, action)
                            : []),
                    ];
                    resolve(result);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        else if (elmVersion === '0.19') {
            try {
                const result = [
                    ...elmDelphi_1.askOracle(elmUtils_1.isWindows, cwd, fn, currentWord),
                    ...(config['userProjectIntellisense']
                        ? userProject.userProject(document, position, currentWord, action)
                        : []),
                ];
                resolve(result);
            }
            catch (e) {
                reject(e);
            }
        }
        else {
            try {
                const result = [
                    ...(config['userProjectIntellisense']
                        ? userProject.userProject(document, position, currentWord, action)
                        : []),
                ];
                resolve(result);
            }
            catch (e) {
                reject(e);
            }
        }
    });
}
exports.GetOracleResults = GetOracleResults;
//# sourceMappingURL=elmOracle.js.map