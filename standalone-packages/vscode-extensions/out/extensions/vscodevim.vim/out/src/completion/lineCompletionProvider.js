"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const textEditor_1 = require("./../textEditor");
const range_1 = require("../common/motion/range");
/**
 * Return open text documents, with a given file at the top of the list.
 * @param startingFileName File that will be first in the array, typically current file
 */
const documentsStartingWith = startingFileName => {
    return vscode.workspace.textDocuments.sort((a, b) => {
        if (a.fileName === startingFileName) {
            return -1;
        }
        else if (b.fileName === startingFileName) {
            return 1;
        }
        return 0;
    });
};
/**
 * Get lines, with leading tabs or whitespace stripped.
 * @param document Document to get lines from.
 * @param lineToStartScanFrom Where to start looking for matches first. Closest matches are sorted first.
 * @param scanAboveFirst Whether to start scan above or below cursor. Other direction is scanned last.
 * @returns
 */
const linesWithoutIndentation = (document, lineToStartScanFrom, scanAboveFirst) => {
    const distanceFromStartLine = (line) => {
        let sortPriority = scanAboveFirst ? lineToStartScanFrom - line : line - lineToStartScanFrom;
        if (sortPriority < 0) {
            // We prioritized any items in the main direction searched,
            // but now find closest items in opposite direction.
            sortPriority = lineToStartScanFrom + Math.abs(sortPriority);
        }
        return sortPriority;
    };
    return document
        .getText()
        .split('\n')
        .map((text, line) => ({
        sortPriority: distanceFromStartLine(line),
        text: text.replace(/^[ \t]*/, ''),
    }))
        .sort((a, b) => (a.sortPriority > b.sortPriority ? 1 : -1));
};
/**
 * Get all completions that match given text within open documents.
 * @example
 * a1
 * a2
 * a| // <--- Perform line completion here
 * a3
 * a4
 * // Returns: ['a2', 'a1', 'a3', 'a4']
 * @param text Text to partially match. Indentation is stripped.
 * @param currentFileName Current file, which is prioritized in sorting.
 * @param currentPosition Current position, which is prioritized when sorting for current file.
 */
const getCompletionsForText = (text, currentFileName, currentPosition) => {
    const matchedLines = [];
    for (const document of documentsStartingWith(currentFileName)) {
        let lineToStartScanFrom = 0;
        let scanAboveFirst = false;
        if (document.fileName === currentFileName) {
            lineToStartScanFrom = currentPosition.line;
            scanAboveFirst = true;
        }
        for (const line of linesWithoutIndentation(document, lineToStartScanFrom, scanAboveFirst)) {
            if (matchedLines.indexOf(line.text) === -1 &&
                line.text &&
                line.text.startsWith(text) &&
                line.text !== text) {
                matchedLines.push(line.text);
            }
        }
    }
    return matchedLines;
};
/**
 * Get all completions that match given text within open documents.
 * Results are sorted in a few ways:
 * 1) The current document is prioritized over other open documents.
 * 2) For the current document, lines above the current cursor are always prioritized over lines below it.
 * 3) For the current document, lines are also prioritized based on distance from cursor.
 * 4) For other documents, lines are prioritized based on distance from the top.
 * @example
 * a1
 * a2
 * a| // <--- Perform line completion here
 * a3
 * a4
 * // Returns: ['a2', 'a1', 'a3', 'a4']
 * @param position Position to start scan from
 * @param document Document to start scanning from, starting at the position (other open documents are scanned from top)
 */
exports.getCompletionsForCurrentLine = (position, document) => {
    const currentLineText = textEditor_1.TextEditor.getText(new vscode.Range(position.getFirstLineNonBlankChar(), position));
    return getCompletionsForText(currentLineText, document.fileName, position);
};
exports.lineCompletionProvider = {
    /**
     * Get all completions that match given text within open documents.
     * Results are sorted by priority.
     * @see getCompletionsForCurrentLine
     *
     * Any trailing characters are stripped. Trailing characters are often
     * from auto-close, such as when importing in JavaScript ES6 and typing a
     * curly brace. So the trailing characters are removed on purpose.
     *
     * Modifies vimState, adding transformations that replaces the
     * current line's text with the chosen completion, with proper indentation.
     *
     * Here we use Quick Pick, instead of registerCompletionItemProvider
     * Originally I looked at using a standard completion dropdown using that method,
     * but it doesn't allow you to limit completions, and it became overwhelming
     * when e.g. trying to do a line completion when the cursor is positioned after
     * a space character (such that it shows almost any symbol in the list).
     * Quick Pick also allows for searching, which is a nice bonus.
     */
    showLineCompletionsQuickPick: (position, vimState) => __awaiter(this, void 0, void 0, function* () {
        const completions = exports.getCompletionsForCurrentLine(position, vimState.editor.document);
        if (!completions) {
            return vimState;
        }
        const selectedCompletion = yield vscode.window.showQuickPick(completions);
        if (!selectedCompletion) {
            return vimState;
        }
        vimState.recordedState.transformations.push({
            type: 'deleteRange',
            range: new range_1.Range(position.getFirstLineNonBlankChar(), position.getLineEnd()),
        });
        vimState.recordedState.transformations.push({
            type: 'insertTextVSCode',
            text: selectedCompletion,
        });
        return vimState;
    }),
};

//# sourceMappingURL=lineCompletionProvider.js.map
