"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const vscode = require("vscode");
const configuration_1 = require("./../../configuration/configuration");
const modes_1 = require("./../../mode/modes");
const textEditor_1 = require("./../../textEditor");
/**
 * Represents a difference between two positions. Add it to a position
 * to get another position. Create it with the factory methods:
 *
 * - NewDiff
 * - NewBOLDiff
 */
class PositionDiff {
    constructor(line, character) {
        this._line = line;
        this._character = character;
    }
    /**
     * Creates a new PositionDiff that always brings the cursor to the beginning of the line
     * when applied to a position.
     */
    static NewBOLDiff(line = 0, character = 0) {
        const result = new PositionDiff(line, character);
        result._isBOLDiff = true;
        return result;
    }
    /**
     * Add this PositionDiff to another PositionDiff.
     */
    addDiff(other) {
        if (this._isBOLDiff || other._isBOLDiff) {
            throw new Error("johnfn hasn't done this case yet and doesnt want to");
        }
        return new PositionDiff(this._line + other._line, this._character + other._character);
    }
    /**
     * Adds a Position to this PositionDiff, returning a new PositionDiff.
     */
    addPosition(other, { boundsCheck = true } = {}) {
        let resultChar = this.isBOLDiff() ? 0 : this.character + other.character;
        let resultLine = this.line + other.line;
        if (boundsCheck) {
            if (resultChar < 0) {
                resultChar = 0;
            }
            if (resultLine < 0) {
                resultLine = 0;
            }
        }
        return new Position(resultLine, resultChar);
    }
    /**
     * Difference in lines.
     */
    get line() {
        return this._line;
    }
    /**
     * Difference in characters.
     */
    get character() {
        return this._character;
    }
    /**
     * Does this diff move the position to the beginning of the line?
     */
    isBOLDiff() {
        return this._isBOLDiff;
    }
    toString() {
        if (this._isBOLDiff) {
            return `[ Diff: BOL ]`;
        }
        return `[ Diff: ${this._line} ${this._character} ]`;
    }
}
exports.PositionDiff = PositionDiff;
class Position extends vscode.Position {
    constructor(line, character) {
        super(line, character);
        this._nonWordCharRegex = this.makeWordRegex(Position.NonWordCharacters);
        this._nonBigWordCharRegex = this.makeWordRegex(Position.NonBigWordCharacters);
        this._sentenceEndRegex = /[\.!\?]{1}([ \n\t]+|$)/g;
        this._nonFileNameRegex = this.makeWordRegex(Position.NonFileCharacters);
    }
    toString() {
        return `[${this.line}, ${this.character}]`;
    }
    static FromVSCodePosition(pos) {
        return new Position(pos.line, pos.character);
    }
    /**
     * Returns which of the 2 provided Positions comes earlier in the document.
     */
    static EarlierOf(p1, p2) {
        if (p1.line < p2.line) {
            return p1;
        }
        if (p1.line === p2.line && p1.character < p2.character) {
            return p1;
        }
        return p2;
    }
    isEarlierThan(other) {
        if (this.line < other.line) {
            return true;
        }
        if (this.line === other.line && this.character < other.character) {
            return true;
        }
        return false;
    }
    /**
     * Iterates over every position in the document starting at start, returning
     * at every position the current line text, character text, and a position object.
     */
    static *IterateDocument(start, forward = true) {
        let lineIndex, charIndex;
        if (forward) {
            for (lineIndex = start.line; lineIndex < textEditor_1.TextEditor.getLineCount(); lineIndex++) {
                charIndex = lineIndex === start.line ? start.character : 0;
                const line = textEditor_1.TextEditor.getLineAt(new Position(lineIndex, 0)).text;
                for (; charIndex < line.length; charIndex++) {
                    yield {
                        line: line,
                        char: line[charIndex],
                        pos: new Position(lineIndex, charIndex),
                    };
                }
            }
        }
        else {
            for (lineIndex = start.line; lineIndex >= 0; lineIndex--) {
                const line = textEditor_1.TextEditor.getLineAt(new Position(lineIndex, 0)).text;
                charIndex = lineIndex === start.line ? start.character : line.length - 1;
                for (; charIndex >= 0; charIndex--) {
                    yield {
                        line: line,
                        char: line[charIndex],
                        pos: new Position(lineIndex, charIndex),
                    };
                }
            }
        }
    }
    /**
     * Iterate over every position in the block defined by the two positions passed in.
     */
    static *IterateBlock(topLeft, bottomRight) {
        for (let lineIndex = topLeft.line; lineIndex <= bottomRight.line; lineIndex++) {
            const line = textEditor_1.TextEditor.getLineAt(new Position(lineIndex, 0)).text;
            for (let charIndex = topLeft.character; charIndex < bottomRight.character + 1; charIndex++) {
                yield {
                    line: line,
                    char: line[charIndex],
                    pos: new Position(lineIndex, charIndex),
                };
            }
        }
    }
    /**
     * Iterate over every position in the selection defined by the two positions passed in.
     */
    static *IterateSelection(topLeft, bottomRight) {
        for (let lineIndex = topLeft.line; lineIndex <= bottomRight.line; lineIndex++) {
            const line = textEditor_1.TextEditor.getLineAt(new Position(lineIndex, 0)).text;
            if (lineIndex === topLeft.line) {
                for (let charIndex = topLeft.character; charIndex < line.length + 1; charIndex++) {
                    yield {
                        line: line,
                        char: line[charIndex],
                        pos: new Position(lineIndex, charIndex),
                    };
                }
            }
            else if (lineIndex === bottomRight.line) {
                for (let charIndex = 0; charIndex < bottomRight.character + 1; charIndex++) {
                    yield {
                        line: line,
                        char: line[charIndex],
                        pos: new Position(lineIndex, charIndex),
                    };
                }
            }
            else {
                for (let charIndex = 0; charIndex < line.length + 1; charIndex++) {
                    yield {
                        line: line,
                        char: line[charIndex],
                        pos: new Position(lineIndex, charIndex),
                    };
                }
            }
        }
    }
    /**
     * Iterate over every line in the block defined by the two positions passed in.
     *
     * This is intended for visual block mode.
     */
    static *IterateLine(vimState, options = { reverse: false }) {
        const { reverse } = options;
        const start = vimState.cursorStartPosition;
        const stop = vimState.cursorPosition;
        const topLeft = modes_1.VisualBlockMode.getTopLeftPosition(start, stop);
        const bottomRight = modes_1.VisualBlockMode.getBottomRightPosition(start, stop);
        // Special case for $, which potentially makes the block ragged
        // on the right side.
        const runToLineEnd = vimState.desiredColumn === Number.POSITIVE_INFINITY;
        const itrStart = reverse ? bottomRight.line : topLeft.line;
        const itrEnd = reverse ? topLeft.line : bottomRight.line;
        for (let lineIndex = itrStart; reverse ? lineIndex >= itrEnd : lineIndex <= itrEnd; reverse ? lineIndex-- : lineIndex++) {
            const line = textEditor_1.TextEditor.getLineAt(new Position(lineIndex, 0)).text;
            const endCharacter = runToLineEnd
                ? line.length + 1
                : Math.min(line.length, bottomRight.character + 1);
            yield {
                line: line.substring(topLeft.character, endCharacter),
                start: new Position(lineIndex, topLeft.character),
                end: new Position(lineIndex, endCharacter),
            };
        }
    }
    // Iterates through words on the same line, starting from the current position.
    static *IterateWords(start) {
        const text = textEditor_1.TextEditor.getLineAt(start).text;
        let wordEnd = start.getCurrentWordEnd(true);
        do {
            const word = text.substring(start.character, wordEnd.character + 1);
            yield {
                start: start,
                end: wordEnd,
                word: word,
            };
            if (wordEnd.getRight().isLineEnd()) {
                return;
            }
            start = start.getWordRight();
            wordEnd = start.getCurrentWordEnd(true);
        } while (true);
    }
    /**
     * Returns which of the 2 provided Positions comes later in the document.
     */
    static LaterOf(p1, p2) {
        if (Position.EarlierOf(p1, p2) === p1) {
            return p2;
        }
        return p1;
    }
    /**
     * Subtracts another position from this one, returning the
     * difference between the two.
     */
    subtract(other) {
        return new PositionDiff(this.line - other.line, this.character - other.character);
    }
    /**
     * Adds a PositionDiff to this position, returning a new
     * position.
     */
    add(diff, { boundsCheck = true } = {}) {
        let resultChar = this.character + diff.character;
        let resultLine = this.line + diff.line;
        if (diff.isBOLDiff()) {
            resultChar = diff.character;
        }
        if (boundsCheck) {
            if (resultChar < 0) {
                resultChar = 0;
            }
            if (resultLine < 0) {
                resultLine = 0;
            }
            if (resultLine >= textEditor_1.TextEditor.getLineCount() - 1) {
                resultLine = textEditor_1.TextEditor.getLineCount() - 1;
            }
        }
        return new Position(resultLine, resultChar);
    }
    setLocation(line, character) {
        let position = new Position(line, character);
        return position;
    }
    getLeftTabStop() {
        if (!this.isLineBeginning()) {
            let indentationWidth = textEditor_1.TextEditor.getIndentationLevel(textEditor_1.TextEditor.getLineAt(this).text);
            let tabSize = vscode.window.activeTextEditor.options.tabSize;
            if (indentationWidth % tabSize > 0) {
                return new Position(this.line, Math.max(0, this.character - (indentationWidth % tabSize)));
            }
            else {
                return new Position(this.line, Math.max(0, this.character - tabSize));
            }
        }
        return this;
    }
    /**
     * Gets the position one or more to the left of this position. Does not go up line
     * breaks.
     */
    getLeft(count = 1) {
        let newCharacter = Math.max(this.character - count, 0);
        if (newCharacter !== this.character) {
            return new Position(this.line, newCharacter);
        }
        return this;
    }
    /**
     * Same as getLeft, but goes up to the previous line on line
     * breaks.
     *
     * Equivalent to left arrow (in a non-vim editor!)
     */
    getLeftThroughLineBreaks(includeEol = true) {
        if (!this.isLineBeginning()) {
            return this.getLeft();
        }
        // First char on first line, can not go left any more
        if (this.line === 0) {
            return this;
        }
        if (includeEol) {
            return this.getUp(0).getLineEnd();
        }
        else {
            return this.getUp(0)
                .getLineEnd()
                .getLeft();
        }
    }
    getRightThroughLineBreaks(includeEol = false) {
        if (this.isAtDocumentEnd()) {
            // TODO(bell)
            return this;
        }
        if (this.isLineEnd()) {
            return this.getDown(0);
        }
        if (!includeEol && this.getRight().isLineEnd()) {
            return this.getDown(0);
        }
        return this.getRight();
    }
    getRight(count = 1) {
        if (!this.isLineEnd()) {
            return new Position(this.line, this.character + count);
        }
        return this;
    }
    /**
     * Get the position of the line directly below the current line.
     */
    getDown(desiredColumn) {
        if (this.getDocumentEnd().line !== this.line) {
            let nextLine = this.line + 1;
            let nextLineLength = Position.getLineLength(nextLine);
            return new Position(nextLine, Math.min(nextLineLength, desiredColumn));
        }
        return this;
    }
    /**
     * Get the position of the line directly above the current line.
     */
    getUp(desiredColumn) {
        if (this.getDocumentBegin().line !== this.line) {
            let prevLine = this.line - 1;
            let prevLineLength = Position.getLineLength(prevLine);
            return new Position(prevLine, Math.min(prevLineLength, desiredColumn));
        }
        return this;
    }
    /**
     * Get the position *count* lines down from this position, but not lower
     * than the end of the document.
     */
    getDownByCount(count = 0, { boundsCheck = true } = {}) {
        const line = boundsCheck
            ? Math.min(textEditor_1.TextEditor.getLineCount() - 1, this.line + count)
            : this.line + count;
        return new Position(line, this.character);
    }
    /**
     * Get the position *count* lines up from this position, but not higher
     * than the end of the document.
     */
    getUpByCount(count = 0) {
        return new Position(Math.max(0, this.line - count), this.character);
    }
    /**
     * Get the position *count* lines left from this position, but not farther
     * than the beginning of the line
     */
    getLeftByCount(count = 0) {
        return new Position(this.line, Math.max(0, this.character - count));
    }
    /**
     * Get the position *count* lines right from this position, but not farther
     * than the end of the line
     */
    getRightByCount(count = 0) {
        return new Position(this.line, Math.min(textEditor_1.TextEditor.getLineAt(this).text.length - 1, this.character + count));
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getWordLeft(inclusive = false) {
        return this.getWordLeftWithRegex(this._nonWordCharRegex, inclusive);
    }
    getBigWordLeft(inclusive = false) {
        return this.getWordLeftWithRegex(this._nonBigWordCharRegex, inclusive);
    }
    getFilePathLeft(inclusive = false) {
        return this.getWordLeftWithRegex(this._nonFileNameRegex, inclusive);
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getWordRight(inclusive = false) {
        return this.getWordRightWithRegex(this._nonWordCharRegex, inclusive);
    }
    getBigWordRight(inclusive = false) {
        return this.getWordRightWithRegex(this._nonBigWordCharRegex);
    }
    getFilePathRight(inclusive = false) {
        return this.getWordRightWithRegex(this._nonFileNameRegex, inclusive);
    }
    getLastWordEnd() {
        return this.getLastWordEndWithRegex(this._nonWordCharRegex);
    }
    getLastBigWordEnd() {
        return this.getLastWordEndWithRegex(this._nonBigWordCharRegex);
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getCurrentWordEnd(inclusive = false) {
        return this.getCurrentWordEndWithRegex(this._nonWordCharRegex, inclusive);
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getCurrentBigWordEnd(inclusive = false) {
        return this.getCurrentWordEndWithRegex(this._nonBigWordCharRegex, inclusive);
    }
    /**
     * Get the boundary position of the section.
     */
    getSectionBoundary(args) {
        let pos = this;
        if ((args.forward && pos.line === textEditor_1.TextEditor.getLineCount() - 1) ||
            (!args.forward && pos.line === 0)) {
            return pos.getFirstLineNonBlankChar();
        }
        pos = args.forward ? pos.getDown(0) : pos.getUp(0);
        while (!textEditor_1.TextEditor.getLineAt(pos).text.startsWith(args.boundary)) {
            if (args.forward) {
                if (pos.line === textEditor_1.TextEditor.getLineCount() - 1) {
                    break;
                }
                pos = pos.getDown(0);
            }
            else {
                if (pos.line === 0) {
                    break;
                }
                pos = pos.getUp(0);
            }
        }
        return pos.getFirstLineNonBlankChar();
    }
    /**
     * Get the end of the current paragraph.
     */
    getCurrentParagraphEnd(trimWhite = false) {
        let pos = this;
        // If we're not in a paragraph yet, go down until we are.
        while (pos.isLineBlank(trimWhite) && !textEditor_1.TextEditor.isLastLine(pos)) {
            pos = pos.getDown(0);
        }
        // Go until we're outside of the paragraph, or at the end of the document.
        while (!pos.isLineBlank(trimWhite) && pos.line < textEditor_1.TextEditor.getLineCount() - 1) {
            pos = pos.getDown(0);
        }
        return pos.getLineEnd();
    }
    /**
     * Get the beginning of the current paragraph.
     */
    getCurrentParagraphBeginning(trimWhite = false) {
        let pos = this;
        // If we're not in a paragraph yet, go up until we are.
        while (pos.isLineBlank(trimWhite) && !textEditor_1.TextEditor.isFirstLine(pos)) {
            pos = pos.getUp(0);
        }
        // Go until we're outside of the paragraph, or at the beginning of the document.
        while (pos.line > 0 && !pos.isLineBlank(trimWhite)) {
            pos = pos.getUp(0);
        }
        return pos.getLineBegin();
    }
    isLineBlank(trimWhite = false) {
        let text = textEditor_1.TextEditor.getLineAt(this).text;
        return (trimWhite ? text.trim() : text) === '';
    }
    isLineWhite() {
        return this.isLineBlank(true);
    }
    getSentenceBegin(args) {
        if (args.forward) {
            return this.getNextSentenceBeginWithRegex(this._sentenceEndRegex, false);
        }
        else {
            return this.getPreviousSentenceBeginWithRegex(this._sentenceEndRegex, false);
        }
    }
    getCurrentSentenceEnd() {
        return this.getCurrentSentenceEndWithRegex(this._sentenceEndRegex, false);
    }
    /**
     * Get the beginning of the current line.
     */
    getLineBegin() {
        return new Position(this.line, 0);
    }
    /**
     * Get the beginning of the line, excluding preceeding whitespace.
     * This respects the `autoindent` setting, and returns `getLineBegin()` if auto-indent
     * is disabled.
     */
    getLineBeginRespectingIndent() {
        if (!configuration_1.configuration.autoindent) {
            return this.getLineBegin();
        }
        return this.getFirstLineNonBlankChar();
    }
    /**
     * Get the beginning of the next line.
     */
    getPreviousLineBegin() {
        if (this.line === 0) {
            return this.getLineBegin();
        }
        return new Position(this.line - 1, 0);
    }
    /**
     * Get the beginning of the next line.
     */
    getNextLineBegin() {
        if (this.line >= textEditor_1.TextEditor.getLineCount() - 1) {
            return this.getLineEnd();
        }
        return new Position(this.line + 1, 0);
    }
    /**
     * Returns a new position at the end of this position's line.
     */
    getLineEnd() {
        return new Position(this.line, Position.getLineLength(this.line));
    }
    /**
     * Returns a new position at the end of this position's line, including the
     * invisible newline character.
     */
    getLineEndIncludingEOL() {
        return new Position(this.line, Position.getLineLength(this.line) + 1);
    }
    getDocumentBegin() {
        return new Position(0, 0);
    }
    /**
     * Returns a new Position one to the left if this position is on the EOL. Otherwise,
     * returns this position.
     */
    getLeftIfEOL() {
        if (this.character === Position.getLineLength(this.line)) {
            return this.getLeft();
        }
        else {
            return this;
        }
    }
    /**
     * Get the position that the cursor would be at if you
     * pasted *text* at the current position.
     */
    advancePositionByText(text) {
        const numberOfLinesSpanned = (text.match(/\n/g) || []).length;
        return new Position(this.line + numberOfLinesSpanned, numberOfLinesSpanned === 0
            ? this.character + text.length
            : text.length - (text.lastIndexOf('\n') + 1));
    }
    getDocumentEnd() {
        let lineCount = textEditor_1.TextEditor.getLineCount();
        let line = lineCount > 0 ? lineCount - 1 : 0;
        let char = Position.getLineLength(line);
        return new Position(line, char);
    }
    isValid() {
        try {
            // line
            let lineCount = textEditor_1.TextEditor.getLineCount() || 1;
            if (this.line >= lineCount) {
                return false;
            }
            // char
            let charCount = Position.getLineLength(this.line);
            if (this.character > charCount + 1) {
                return false;
            }
        }
        catch (e) {
            return false;
        }
        return true;
    }
    /**
     * Is this position at the beginning of the line?
     */
    isLineBeginning() {
        return this.character === 0;
    }
    /**
     * Is this position at the end of the line?
     */
    isLineEnd() {
        return this.character >= Position.getLineLength(this.line);
    }
    isFirstWordOfLine() {
        return Position.getFirstNonBlankCharAtLine(this.line) === this.character;
    }
    isAtDocumentBegin() {
        return this.line === 0 && this.isLineBeginning();
    }
    isAtDocumentEnd() {
        return this.line === textEditor_1.TextEditor.getLineCount() - 1 && this.isLineEnd();
    }
    /**
     * Returns whether the current position is in the leading whitespace of a line
     * @param allowEmpty : Use true if "" is valid
     */
    isInLeadingWhitespace(allowEmpty = false) {
        if (allowEmpty) {
            return /^\s*$/.test(textEditor_1.TextEditor.getText(new vscode.Range(this.getLineBegin(), this)));
        }
        else {
            return /^\s+$/.test(textEditor_1.TextEditor.getText(new vscode.Range(this.getLineBegin(), this)));
        }
    }
    static getFirstNonBlankCharAtLine(line) {
        return textEditor_1.TextEditor.readLineAt(line).match(/^\s*/)[0].length;
    }
    /**
     * The position of the first character on this line which is not whitespace.
     */
    getFirstLineNonBlankChar() {
        return new Position(this.line, Position.getFirstNonBlankCharAtLine(this.line));
    }
    static getLineLength(line) {
        return textEditor_1.TextEditor.readLineAt(line).length;
    }
    makeWordRegex(characterSet) {
        let escaped = characterSet && _.escapeRegExp(characterSet).replace(/-/g, '\\-');
        let segments = [];
        segments.push(`([^\\s${escaped}]+)`);
        segments.push(`[${escaped}]+`);
        segments.push(`$^`);
        let result = new RegExp(segments.join('|'), 'g');
        return result;
    }
    getAllPositions(line, regex) {
        let positions = [];
        let result = regex.exec(line);
        while (result) {
            positions.push(result.index);
            // Handles the case where an empty string match causes lastIndex not to advance,
            // which gets us in an infinite loop.
            if (result.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result = regex.exec(line);
        }
        return positions;
    }
    getAllEndPositions(line, regex) {
        let positions = [];
        let result = regex.exec(line);
        while (result) {
            if (result[0].length) {
                positions.push(result.index + result[0].length - 1);
            }
            // Handles the case where an empty string match causes lastIndex not to advance,
            // which gets us in an infinite loop.
            if (result.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result = regex.exec(line);
        }
        return positions;
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getWordLeftWithRegex(regex, inclusive = false) {
        for (let currentLine = this.line; currentLine >= 0; currentLine--) {
            let positions = this.getAllPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(positions.reverse(), index => (index < this.character && !inclusive) ||
                (index <= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter);
            }
        }
        return new Position(0, 0).getLineBegin();
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getWordRightWithRegex(regex, inclusive = false) {
        for (let currentLine = this.line; currentLine < textEditor_1.TextEditor.getLineCount(); currentLine++) {
            let positions = this.getAllPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(positions, index => (index > this.character && !inclusive) ||
                (index >= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter);
            }
        }
        return new Position(textEditor_1.TextEditor.getLineCount() - 1, 0).getLineEnd();
    }
    getLastWordEndWithRegex(regex) {
        for (let currentLine = this.line; currentLine < textEditor_1.TextEditor.getLineCount(); currentLine++) {
            let positions = this.getAllEndPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let index = _.findIndex(positions, i => i >= this.character || currentLine !== this.line);
            let newCharacter = 0;
            if (index === -1) {
                newCharacter = positions[positions.length - 1];
            }
            else if (index > 0) {
                newCharacter = positions[index - 1];
            }
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter);
            }
        }
        return new Position(textEditor_1.TextEditor.getLineCount() - 1, 0).getLineEnd();
    }
    /**
     * Inclusive is true if we consider the current position a valid result, false otherwise.
     */
    getCurrentWordEndWithRegex(regex, inclusive) {
        for (let currentLine = this.line; currentLine < textEditor_1.TextEditor.getLineCount(); currentLine++) {
            let positions = this.getAllEndPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(positions, index => (index > this.character && !inclusive) ||
                (index >= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter);
            }
        }
        return new Position(textEditor_1.TextEditor.getLineCount() - 1, 0).getLineEnd();
    }
    getPreviousSentenceBeginWithRegex(regex, inclusive) {
        let paragraphBegin = this.getCurrentParagraphBeginning();
        for (let currentLine = this.line; currentLine >= paragraphBegin.line; currentLine--) {
            let endPositions = this.getAllEndPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(endPositions.reverse(), index => (index < this.character &&
                !inclusive &&
                new Position(currentLine, index).getRightThroughLineBreaks().compareTo(this)) ||
                (index <= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter).getRightThroughLineBreaks();
            }
        }
        if (paragraphBegin.line + 1 === this.line || paragraphBegin.line === this.line) {
            return paragraphBegin;
        }
        else {
            return new Position(paragraphBegin.line + 1, 0);
        }
    }
    getNextSentenceBeginWithRegex(regex, inclusive) {
        // A paragraph and section boundary is also a sentence boundary.
        let paragraphEnd = this.getCurrentParagraphEnd();
        for (let currentLine = this.line; currentLine <= paragraphEnd.line; currentLine++) {
            let endPositions = this.getAllEndPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(endPositions, index => (index > this.character && !inclusive) ||
                (index >= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter).getRightThroughLineBreaks();
            }
        }
        return this.getFirstNonWhitespaceInParagraph(paragraphEnd, inclusive);
    }
    getCurrentSentenceEndWithRegex(regex, inclusive) {
        let paragraphEnd = this.getCurrentParagraphEnd();
        for (let currentLine = this.line; currentLine <= paragraphEnd.line; currentLine++) {
            let allPositions = this.getAllPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, regex);
            let newCharacter = _.find(allPositions, index => (index > this.character && !inclusive) ||
                (index >= this.character && inclusive) ||
                currentLine !== this.line);
            if (newCharacter !== undefined) {
                return new Position(currentLine, newCharacter);
            }
        }
        return this.getFirstNonWhitespaceInParagraph(paragraphEnd, inclusive);
    }
    getFirstNonWhitespaceInParagraph(paragraphEnd, inclusive) {
        // If the cursor is at an empty line, it's the end of a paragraph and the begin of another paragraph
        // Find the first non-whitepsace character.
        if (textEditor_1.TextEditor.getLineAt(new vscode.Position(this.line, 0)).text) {
            return paragraphEnd;
        }
        else {
            for (let currentLine = this.line; currentLine <= paragraphEnd.line; currentLine++) {
                let nonWhitePositions = this.getAllPositions(textEditor_1.TextEditor.getLineAt(new vscode.Position(currentLine, 0)).text, /\S/g);
                let newCharacter = _.find(nonWhitePositions, index => (index > this.character && !inclusive) ||
                    (index >= this.character && inclusive) ||
                    currentLine !== this.line);
                if (newCharacter !== undefined) {
                    return new Position(currentLine, newCharacter);
                }
            }
        }
        throw new Error('This should never happen...');
    }
    findHelper(char, count, direction) {
        // -1 = backwards, +1 = forwards
        const line = textEditor_1.TextEditor.getLineAt(this);
        let index = this.character;
        while (count && index !== -1) {
            if (direction > 0) {
                index = line.text.indexOf(char, index + direction);
            }
            else {
                index = line.text.lastIndexOf(char, index + direction);
            }
            count--;
        }
        if (index > -1) {
            return new Position(this.line, index);
        }
        return undefined;
    }
    tilForwards(char, count = 1) {
        const position = this.findHelper(char, count, +1);
        if (!position) {
            return null;
        }
        return new Position(this.line, position.character - 1);
    }
    tilBackwards(char, count = 1) {
        const position = this.findHelper(char, count, -1);
        if (!position) {
            return null;
        }
        return new Position(this.line, position.character + 1);
    }
    findForwards(char, count = 1) {
        const position = this.findHelper(char, count, +1);
        if (!position) {
            return null;
        }
        return new Position(this.line, position.character);
    }
    findBackwards(char, count = 1) {
        const position = this.findHelper(char, count, -1);
        if (!position) {
            return null;
        }
        return position;
    }
}
Position.NonWordCharacters = configuration_1.configuration.iskeyword;
Position.NonBigWordCharacters = '';
Position.NonFileCharacters = '"\'`;<>{}[]()';
exports.Position = Position;

//# sourceMappingURL=position.js.map
