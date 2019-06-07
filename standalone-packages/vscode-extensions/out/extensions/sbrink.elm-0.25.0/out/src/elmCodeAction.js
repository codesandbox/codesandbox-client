"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class ElmCodeActionProvider {
    provideCodeActions(document, range, context, token) {
        let isDirty = vscode.window.activeTextEditor.document.isDirty;
        if (isDirty) {
            return;
        }
        let wordRange = document.getWordRangeAtPosition(range.start);
        let currentWord = document.getText(wordRange);
        let currentWordPrefix = currentWord.substring(0, currentWord.lastIndexOf('.'));
        let currentWordSuffix = currentWord.substr(currentWord.lastIndexOf('.') + 1);
        let annotationWordCriteria = 'Top-level value `' +
            currentWord +
            '` does not have a type annotation. - I inferred the type annotation so you can copy it into your code:';
        let modelFieldMissingCriteria = 'Hint: The record fields do not match up. Maybe you made one of these typos?';
        let unnecessaryParensCriteria = /UnnecessaryParens/;
        let unusedVariableCriteria = /UnusedVariable/;
        let unusedImportedVariableCriteria = /UnusedImportedVariable/;
        let debugLogCriteria = /DebugLog/;
        let suggestionsCriterias = [
            'Cannot find variable `' +
                currentWord +
                '` - Maybe you want one of the following?',
            'Cannot find variable `' +
                currentWord +
                '`. - `' +
                currentWordPrefix +
                '` does not expose `' +
                currentWordSuffix +
                '`. Maybe you want one of the following?',
            'Cannot find variable `' +
                currentWord +
                '`. - No module called `' +
                currentWordPrefix +
                '` has been imported. Maybe you want one of the following?',
            'Cannot find pattern `' +
                currentWord +
                '`. - `' +
                currentWordPrefix +
                '` does not expose `' +
                currentWordSuffix +
                '`. Maybe you want one of the following?',
            'Cannot find pattern `' +
                currentWord +
                '` - Maybe you want one of the following?',
            'Cannot find type `' +
                currentWord +
                '` - Maybe you want one of the following?',
            'Cannot find type `' +
                currentWord +
                '`. - `' +
                currentWordPrefix +
                '` does not expose `' +
                currentWordSuffix +
                '`. Maybe you want one of the following?',
        ];
        let promises = context.diagnostics.map(diag => {
            if (diag.message.indexOf(annotationWordCriteria) >= 0) {
                return [
                    {
                        title: 'Add function type annotation',
                        command: 'elm.codeActionAnnotateFunction',
                        arguments: [
                            diag.message.substr(annotationWordCriteria.length + 1).trim(),
                        ],
                    },
                ];
            }
            else if (suggestionsCriterias.some(function (v) {
                return diag.message.indexOf(v) >= 0;
            })) {
                let suggestions = diag.message
                    .substr(diag.message.indexOf('\n'))
                    .trim();
                let commands = suggestions
                    .split('\n')
                    .map(val => val.trim())
                    .map(val => {
                    return {
                        title: 'Change to: ' + val,
                        command: 'elm.codeActionReplaceSuggestedVariable',
                        arguments: [[currentWord, val]],
                    };
                });
                return commands;
            }
            else if (diag.message.indexOf(modelFieldMissingCriteria) >= 0) {
                let modelName = currentWord.substring(0, currentWord.indexOf('.') + 1);
                let message = diag.message.split('\n');
                let suggestions = message[message.length - 1].trim().split('<->');
                let commands = suggestions
                    .map(val => modelName + val.trim())
                    .map(val => {
                    return {
                        title: 'Change to: ' + val,
                        command: 'elm.codeActionReplaceSuggestedVariable',
                        arguments: [[currentWord, val]],
                    };
                });
                return commands;
            }
            else if (diag.message.match(unnecessaryParensCriteria)) {
                return [
                    {
                        title: 'Remove unnecessary parens',
                        command: 'elm.removeUnnecessaryParens',
                        arguments: [range],
                    },
                ];
            }
            else if (diag.message.match(unusedVariableCriteria)) {
                return [
                    {
                        title: 'Change variable to _',
                        command: 'elm.changeVariableTo_',
                        arguments: [range],
                    },
                ];
            }
            else if (diag.message.match(unusedImportedVariableCriteria)) {
                return [
                    {
                        title: 'Remove unused variable',
                        command: 'elm.removeUnusedImportedVariable',
                        arguments: [range],
                    },
                ];
            }
            else if (diag.message.match(debugLogCriteria)) {
                return [
                    {
                        title: 'Remove debug log',
                        command: 'elm.removeDebugLog',
                        arguments: [range],
                    },
                ];
            }
            return [];
        });
        return Promise.all(promises).then(arrs => {
            let results = {};
            for (let segment of arrs) {
                for (let item of segment) {
                    results[item.title] = item;
                }
            }
            let ret = [];
            for (let title of Object.keys(results).sort()) {
                ret.push(results[title]);
            }
            return ret;
        });
    }
}
exports.ElmCodeActionProvider = ElmCodeActionProvider;
function annotateFunction(msg) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let position = vscode.window.activeTextEditor.selection.active;
    let wordRange = editor.document.getWordRangeAtPosition(position);
    let currentWord = editor.document.getText(wordRange);
    let msgList = msg.split('\n');
    if (msgList.length >= 1) {
        let annotation = msgList.map((val) => val.trim()).join(' ');
        editor.edit(editBuilder => {
            editBuilder.insert(position.translate(-1), annotation);
        });
        editor.document.save();
    }
    else {
        vscode.window.showInformationMessage('Could not resolve function type annotation');
    }
}
function replaceSuggestedVariable(msg) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let position = vscode.window.activeTextEditor.selection.active;
    let wordRange = editor.document.getWordRangeAtPosition(position);
    let currentWord = editor.document.getText(wordRange);
    if (msg.length === 2 && msg[0] === currentWord) {
        editor.edit(editBuilder => {
            editBuilder.replace(wordRange, msg[1]);
        });
        editor.document.save();
    }
    else {
        vscode.window.showInformationMessage('Could not find variable to replace');
    }
}
function removeUnnecessaryParens(range) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let fullParens = editor.document.getText(range);
    editor.edit(editBuilder => {
        editBuilder.replace(range, fullParens.substring(1, fullParens.length - 1));
    });
    editor.document.save();
}
function changeVariableTo_(range) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let variableToFix = editor.document.getText(range);
    editor.edit(editBuilder => {
        editBuilder.replace(range, '_');
    });
    editor.document.save();
}
function removeUnusedImportedVariable(range) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let variableToFix = editor.document.getText(range);
    let nextCharacters = editor.document.getText(range.with(range.end.translate(0, 0), range.end.translate(0, 100)));
    let previousCharacters = editor.document.getText(range.with(range.start.translate(0, -15), range.start.translate(0, 0)));
    // between commas	or first variable
    if (nextCharacters.trim().startsWith(',') &&
        (previousCharacters.trim().endsWith(',') ||
            previousCharacters.trim().endsWith('('))) {
        let nextCharacterIndex = nextCharacters.indexOf(',') + 1;
        if (nextCharacters[nextCharacterIndex] === ' ') {
            nextCharacterIndex += 1;
        }
        editor.edit(editBuilder => {
            editBuilder.replace(range.with(range.start, range.end.translate(0, nextCharacterIndex)), '');
        });
        editor.document.save();
    }
    else if (nextCharacters.trim().startsWith(')') &&
        previousCharacters.trim().endsWith(',')) {
        // last variable
        let previousCharacterIndex = previousCharacters.lastIndexOf(',');
        let previousCharacterOffset = previousCharacters.length - previousCharacterIndex;
        if (previousCharacters[previousCharacterIndex] === ' ') {
            previousCharacterOffset += 1;
        }
        editor.edit(editBuilder => {
            editBuilder.replace(range.with(range.start.translate(0, -previousCharacterOffset), range.end), '');
        });
        editor.document.save();
    }
    else if (nextCharacters.trim().startsWith(')') &&
        previousCharacters.trim().endsWith('(')) {
        // only one variable left
        let previousCharacterIndex = previousCharacters.lastIndexOf('exposing');
        let previousCharacterOffset = previousCharacters.length - previousCharacterIndex;
        if (previousCharacters[previousCharacterIndex - 1] === ' ') {
            previousCharacterOffset += 1;
        }
        editor.edit(editBuilder => {
            editBuilder.replace(range.with(range.start.translate(0, -previousCharacterOffset), range.end.translate(0, 5)), '');
        });
        editor.document.save();
    }
}
function removeDebugLog(range) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active.');
        return;
    }
    if (editor.document.languageId !== 'elm') {
        vscode.window.showInformationMessage('Language is not Elm');
        return;
    }
    let nextCharacters = editor.document.getText(range.with(range.end.translate(0, 0), range.end.translate(0, 100)));
    let debugLogEndIndex = nextCharacters.indexOf('"', nextCharacters.indexOf('"') + 1) + 1;
    if (nextCharacters[debugLogEndIndex + 1] === ' ') {
        debugLogEndIndex += 1;
    }
    editor.edit(editBuilder => {
        editBuilder.replace(range.with(range.start, range.end.translate(0, debugLogEndIndex)), '');
    });
    editor.document.save();
}
function activateCodeActions() {
    return [
        vscode.commands.registerCommand('elm.codeActionAnnotateFunction', msg => annotateFunction(msg)),
        vscode.commands.registerCommand('elm.codeActionReplaceSuggestedVariable', msg => replaceSuggestedVariable(msg)),
        vscode.commands.registerCommand('elm.removeUnnecessaryParens', msg => removeUnnecessaryParens(msg)),
        vscode.commands.registerCommand('elm.changeVariableTo_', msg => changeVariableTo_(msg)),
        vscode.commands.registerCommand('elm.removeUnusedImportedVariable', msg => removeUnusedImportedVariable(msg)),
        vscode.commands.registerCommand('elm.removeDebugLog', msg => removeDebugLog(msg)),
    ];
}
exports.activateCodeActions = activateCodeActions;
//# sourceMappingURL=elmCodeAction.js.map