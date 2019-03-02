"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const lineState_1 = require("./lineState");
const textLine_1 = require("./textLine");
const vscodeFiles_1 = require("./vscodeFiles");
class DocumentDecoration {
    constructor(document, config, settings) {
        // This program caches lines, and will only analyze linenumbers including or above a modified line
        this.lines = [];
        this.scopeDecorations = [];
        this.scopeSelectionHistory = [];
        this.settings = settings;
        this.document = document;
        this.languageConfig = config;
    }
    dispose() {
        this.disposeScopeDecorations();
    }
    onDidChangeTextDocument(contentChanges) {
        if (contentChanges.length > 1 || !contentChanges[0].range.isSingleLine || contentChanges[0].text.length > 1) {
            let minLineIndexToUpdate = 0;
            for (const contentChange of contentChanges) {
                minLineIndexToUpdate = Math.min(minLineIndexToUpdate, contentChange.range.start.line);
            }
            if (minLineIndexToUpdate === 0) {
                this.lines = [];
            }
            else {
                this.lines.splice(minLineIndexToUpdate);
            }
            this.tokenizeDocument();
            return;
        }
        const change = contentChanges[0];
        const lineNumber = change.range.start.line;
        // Parse overlapped lines with goal to see if we can avoid document reparse
        // By just moving existing brackets if the amount of brackets on a line didn't change
        const newLine = this.tokenizeLine(lineNumber);
        const currentLine = this.lines[lineNumber];
        // Current line has new brackets which need to be colored
        if (!currentLine.getRuleStack().equals(newLine.getRuleStack()) ||
            currentLine.getBracketHash() !== newLine.getBracketHash()) {
            this.lines[lineNumber] = newLine;
            this.lines.splice(lineNumber + 1);
            this.tokenizeDocument();
            return;
        }
        const charOffset = change.text.length - change.rangeLength;
        currentLine.offset(change.range.start.character, charOffset);
    }
    expandBracketSelection(editor) {
        const newSelections = [];
        editor.selections.forEach((selection) => {
            if (this.scopeSelectionHistory.length === 0) {
                this.scopeSelectionHistory.push(editor.selections);
            }
            const nextPos = this.document.validatePosition(selection.active.translate(0, 1));
            const endBracket = this.searchScopeForwards(nextPos);
            if (!endBracket) {
                return;
            }
            const start = endBracket.openBracket.token.range.start.translate(0, 1);
            const end = endBracket.token.range.end.translate(0, -1);
            newSelections.push(new vscode.Selection(start, end));
        });
        if (newSelections.length > 0) {
            this.scopeSelectionHistory.push(newSelections);
            editor.selections = newSelections;
        }
    }
    undoBracketSelection(editor) {
        this.scopeSelectionHistory.pop();
        if (this.scopeSelectionHistory.length === 0) {
            return;
        }
        const scopes = this.scopeSelectionHistory[this.scopeSelectionHistory.length - 1];
        editor.selections = scopes;
    }
    // Lines are stored in an array, if line is requested outside of array bounds
    // add emptys lines until array is correctly sized
    getLine(index, state) {
        if (index < this.lines.length) {
            return this.lines[index];
        }
        else {
            if (this.lines.length === 0) {
                this.lines.push(new textLine_1.default(state, new lineState_1.default(this.settings, this.languageConfig), 0));
            }
            if (index < this.lines.length) {
                return this.lines[index];
            }
            if (index === this.lines.length) {
                const previousLine = this.lines[this.lines.length - 1];
                const newLine = new textLine_1.default(state, previousLine.cloneState(), index);
                this.lines.push(newLine);
                return newLine;
            }
            throw new Error("Cannot look more than one line ahead");
        }
    }
    tokenizeDocument() {
        // console.log("Tokenizing " + this.document.fileName);
        // One document may be shared by multiple editors (side by side view)
        const editors = vscode.window.visibleTextEditors.filter((e) => this.document === e.document);
        if (editors.length === 0) {
            console.warn("No editors associated with document: " + this.document.fileName);
            return;
        }
        // console.time("tokenizeDocument");
        const lineIndex = this.lines.length;
        const lineCount = this.document.lineCount;
        if (lineIndex < lineCount) {
            // console.log("Reparse from line: " + (lineIndex + 1));
            for (let i = lineIndex; i < lineCount; i++) {
                const newLine = this.tokenizeLine(i);
                this.lines.push(newLine);
            }
        }
        // console.log("Coloring document");
        this.colorDecorations(editors);
        // console.timeEnd("tokenizeDocument");
    }
    updateScopeDecorations(event) {
        // console.time("updateScopeDecorations");
        this.disposeScopeDecorations();
        // For performance reasons we only do one selection for now.
        // Simply wrap in foreach selection for multicursor, maybe put it behind an option?
        const selection = event.textEditor.selection;
        const closeBracket = this.searchScopeForwards(selection.active);
        if (!closeBracket) {
            return;
        }
        const openBracket = closeBracket.openBracket;
        const beginRange = openBracket.token.range;
        const endRange = closeBracket.token.range;
        const startLineIndex = openBracket.token.range.start.line;
        const endLineIndex = closeBracket.token.range.start.line;
        if (this.settings.highlightActiveScope) {
            const decoration = this.settings.createScopeBracketDecorations(closeBracket.color);
            event.textEditor.setDecorations(decoration, [beginRange, endRange]);
            this.scopeDecorations.push(decoration);
        }
        if (this.settings.showBracketsInGutter) {
            if (startLineIndex === endLineIndex) {
                const decoration = this.settings.createGutterBracketDecorations(closeBracket.color, openBracket.token.character + closeBracket.token.character);
                event.textEditor.setDecorations(decoration, [beginRange, endRange]);
                this.scopeDecorations.push(decoration);
            }
            else {
                const decorationOpen = this.settings.createGutterBracketDecorations(openBracket.color, openBracket.token.character);
                event.textEditor.setDecorations(decorationOpen, [beginRange]);
                this.scopeDecorations.push(decorationOpen);
                const decorationClose = this.settings.createGutterBracketDecorations(closeBracket.color, closeBracket.token.character);
                event.textEditor.setDecorations(decorationClose, [endRange]);
                this.scopeDecorations.push(decorationClose);
            }
        }
        if (this.settings.showBracketsInRuler) {
            const decoration = this.settings.createRulerBracketDecorations(closeBracket.color);
            event.textEditor.setDecorations(decoration, [beginRange, endRange]);
            this.scopeDecorations.push(decoration);
        }
        const lastWhiteSpaceCharacterIndex = this.document.lineAt(endRange.start).firstNonWhitespaceCharacterIndex;
        const lastBracketStartIndex = endRange.start.character;
        const lastBracketIsFirstCharacterOnLine = lastWhiteSpaceCharacterIndex === lastBracketStartIndex;
        let leftBorderColumn = Infinity;
        const tabSize = event.textEditor.options.tabSize;
        const position = this.settings.scopeLineRelativePosition ?
            Math.min(endRange.start.character, beginRange.start.character) : 0;
        let leftBorderIndex = position;
        const start = beginRange.start.line + 1;
        const end = endRange.start.line;
        // Start -1 because prefer draw line at current indent level
        for (let lineIndex = start - 1; lineIndex <= end; lineIndex++) {
            const line = this.document.lineAt(lineIndex);
            if (!line.isEmptyOrWhitespace) {
                const firstCharIndex = line.firstNonWhitespaceCharacterIndex;
                leftBorderIndex = Math.min(leftBorderIndex, firstCharIndex);
                leftBorderColumn = Math.min(leftBorderColumn, this.calculateColumnFromCharIndex(line.text, firstCharIndex, tabSize));
            }
        }
        if (this.settings.showVerticalScopeLine) {
            const verticalLineRanges = [];
            const endOffset = lastBracketIsFirstCharacterOnLine ? end - 1 : end;
            for (let lineIndex = start; lineIndex <= endOffset; lineIndex++) {
                const line = this.document.lineAt(lineIndex);
                const linePosition = new vscode.Position(lineIndex, this.calculateCharIndexFromColumn(line.text, leftBorderColumn, tabSize));
                const range = new vscode.Range(linePosition, linePosition);
                const valid = line.text.length >= leftBorderIndex;
                verticalLineRanges.push({ range, valid });
            }
            const safeFallbackPosition = new vscode.Position(start - 1, leftBorderIndex);
            this.setVerticalLineDecoration(closeBracket, event, safeFallbackPosition, verticalLineRanges);
        }
        if (this.settings.showHorizontalScopeLine) {
            const underlineLineRanges = [];
            const overlineLineRanges = [];
            if (startLineIndex === endLineIndex) {
                underlineLineRanges.push(new vscode.Range(beginRange.start, endRange.end));
            }
            else {
                const startTextLine = this.document.lineAt(startLineIndex);
                const endTextLine = this.document.lineAt(endLineIndex);
                const leftStartPos = new vscode.Position(beginRange.start.line, this.calculateCharIndexFromColumn(startTextLine.text, leftBorderColumn, tabSize));
                const leftEndPos = new vscode.Position(endRange.start.line, this.calculateCharIndexFromColumn(endTextLine.text, leftBorderColumn, tabSize));
                underlineLineRanges.push(new vscode.Range(leftStartPos, beginRange.end));
                if (lastBracketIsFirstCharacterOnLine) {
                    overlineLineRanges.push(new vscode.Range(leftEndPos, endRange.end));
                }
                else {
                    underlineLineRanges.push(new vscode.Range(leftEndPos, endRange.end));
                }
            }
            if (underlineLineRanges) {
                this.setUnderLineDecoration(closeBracket, event, underlineLineRanges);
            }
            if (overlineLineRanges) {
                this.setOverLineDecoration(closeBracket, event, overlineLineRanges);
            }
        }
        // console.timeEnd("updateScopeDecorations");
    }
    tokenizeLine(index) {
        const newText = this.document.lineAt(index).text;
        const previousLineRuleStack = index > 0 ?
            this.lines[index - 1].getRuleStack() :
            undefined;
        const previousLineState = index > 0 ?
            this.lines[index - 1].cloneState() :
            new lineState_1.default(this.settings, this.languageConfig);
        const tokenized = this.languageConfig.grammar.tokenizeLine2(newText, previousLineRuleStack);
        const tokens = tokenized.tokens;
        const lineTokens = new vscodeFiles_1.LineTokens(tokens, newText);
        const matches = new Array();
        const count = lineTokens.getCount();
        for (let i = 0; i < count; i++) {
            const tokenType = lineTokens.getStandardTokenType(i);
            if (!vscodeFiles_1.ignoreBracketsInToken(tokenType)) {
                const searchStartOffset = tokens[i * 2];
                const searchEndOffset = i < count ? tokens[(i + 1) * 2] : newText.length;
                const currentTokenText = newText.substring(searchStartOffset, searchEndOffset);
                let result;
                // tslint:disable-next-line:no-conditional-assignment
                while ((result = this.languageConfig.regex.exec(currentTokenText)) !== null) {
                    matches.push({ content: result[0], index: result.index + searchStartOffset });
                }
            }
        }
        const newLine = new textLine_1.default(tokenized.ruleStack, previousLineState, index);
        for (const match of matches) {
            const lookup = this.languageConfig.bracketToId.get(match.content);
            if (lookup) {
                newLine.AddToken(match.content, match.index, lookup.key, lookup.open);
            }
        }
        return newLine;
    }
    setOverLineDecoration(bracket, event, overlineLineRanges) {
        const lineDecoration = this.settings.createScopeLineDecorations(bracket.color, true, false, false, false);
        event.textEditor.setDecorations(lineDecoration, overlineLineRanges);
        this.scopeDecorations.push(lineDecoration);
    }
    setUnderLineDecoration(bracket, event, underlineLineRanges) {
        const lineDecoration = this.settings.createScopeLineDecorations(bracket.color, false, false, true, false);
        event.textEditor.setDecorations(lineDecoration, underlineLineRanges);
        this.scopeDecorations.push(lineDecoration);
    }
    setVerticalLineDecoration(bracket, event, fallBackPosition, verticleLineRanges) {
        const offsets = [];
        const normalDecoration = this.settings.createScopeLineDecorations(bracket.color, false, false, false, true);
        if (verticleLineRanges.length === 0) {
            return;
        }
        const normalRanges = verticleLineRanges.filter((e) => e.valid).map((e) => e.range);
        // Get first valid range, if non fall-back to opening position
        let aboveValidRange = new vscode.Range(fallBackPosition, fallBackPosition);
        for (const lineRange of verticleLineRanges) {
            if (lineRange.valid) {
                aboveValidRange = lineRange.range;
                break;
            }
        }
        /* Keep updating last valid range to keep offset distance minimum
         to prevent missing decorations when scrolling */
        for (const lineRange of verticleLineRanges) {
            if (lineRange.valid) {
                aboveValidRange = lineRange.range;
            }
            else {
                const offset = lineRange.range.start.line - aboveValidRange.start.line;
                offsets.push({ range: aboveValidRange, downOffset: offset });
            }
        }
        event.textEditor.setDecorations(normalDecoration, normalRanges);
        this.scopeDecorations.push(normalDecoration);
        offsets.forEach((offset) => {
            const decoration = this.settings.createScopeLineDecorations(bracket.color, false, false, false, true, offset.downOffset);
            event.textEditor.setDecorations(decoration, [offset.range]);
            this.scopeDecorations.push(decoration);
        });
    }
    disposeScopeDecorations() {
        for (const decoration of this.scopeDecorations) {
            decoration.dispose();
        }
        this.scopeDecorations = [];
    }
    searchScopeForwards(position) {
        for (let i = position.line; i < this.lines.length; i++) {
            const endBracket = this.lines[i].getClosingBracket(position);
            if (endBracket) {
                return endBracket;
            }
        }
    }
    colorDecorations(editors) {
        // console.time("colorDecorations");
        const colorMap = new Map();
        // Reduce all the colors/ranges of the lines into a singular map
        for (const line of this.lines) {
            {
                const brackets = line.getAllBrackets();
                for (const bracket of brackets) {
                    const existingRanges = colorMap.get(bracket.color);
                    if (existingRanges !== undefined) {
                        existingRanges.push(bracket.token.range);
                    }
                    else {
                        colorMap.set(bracket.color, [bracket.token.range]);
                    }
                }
            }
        }
        for (const [color, decoration] of this.settings.bracketDecorations) {
            if (color === "") {
                continue;
            }
            const ranges = colorMap.get(color);
            for (const editor of editors) {
                if (ranges !== undefined) {
                    editor.setDecorations(decoration, ranges);
                }
                else {
                    // We must set non-used colors to an empty array
                    // or previous decorations will not be invalidated
                    editor.setDecorations(decoration, []);
                }
            }
        }
        // console.timeEnd("colorDecorations");
    }
    calculateColumnFromCharIndex(lineText, charIndex, tabSize) {
        let spacing = 0;
        for (let index = 0; index < charIndex; index++) {
            if (lineText.charAt(index) === "\t") {
                spacing += tabSize - spacing % tabSize;
            }
            else {
                spacing++;
            }
        }
        return spacing;
    }
    calculateCharIndexFromColumn(lineText, column, tabSize) {
        let spacing = 0;
        for (let index = 0; index <= column; index++) {
            if (spacing >= column) {
                return index;
            }
            if (lineText.charAt(index) === "\t") {
                spacing += tabSize - spacing % tabSize;
            }
            else {
                spacing++;
            }
        }
        return spacing;
    }
}
exports.default = DocumentDecoration;
//# sourceMappingURL=documentDecoration.js.map