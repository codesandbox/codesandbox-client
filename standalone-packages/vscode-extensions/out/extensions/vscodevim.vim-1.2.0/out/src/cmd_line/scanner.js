"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Provides state and behavior to scan an input string character by character.
class Scanner {
    constructor(input) {
        this.start = 0;
        this.pos = 0;
        this.input = input;
    }
    // Returns the next character in the input, or EOF.
    next() {
        if (this.isAtEof) {
            this.pos = this.input.length;
            return Scanner.EOF;
        }
        let c = this.input[this.pos];
        this.pos++;
        return c;
    }
    // Returns the next word in the input, or EOF.
    nextWord(wordSeparators = [' ', '\t']) {
        this.skipRun(wordSeparators);
        if (this.isAtEof) {
            this.pos = this.input.length;
            return Scanner.EOF;
        }
        let result = '';
        let c = undefined;
        while (!this.isAtEof) {
            c = this.next();
            if (c === Scanner.EOF || wordSeparators.indexOf(c) !== -1) {
                break;
            }
            result += c;
        }
        if (c && wordSeparators.indexOf(c) !== -1) {
            this.backup();
        }
        this.ignore();
        return result;
    }
    // Returns whether we've reached EOF.
    get isAtEof() {
        return this.pos >= this.input.length;
    }
    // Ignores the span of text between the current start and the current position.
    ignore() {
        this.start = this.pos;
    }
    // Returns the span of text between the current start and the current position.
    emit() {
        let s = this.input.substring(this.start, this.pos);
        this.ignore();
        return s;
    }
    // Returns the text from the current position to the end.
    remaining() {
        while (!this.isAtEof) {
            this.next();
        }
        return this.emit();
    }
    backup() {
        this.pos--;
    }
    // skips over c and ignores the text span
    skip(c) {
        if (this.isAtEof) {
            return;
        }
        var s = this.next();
        while (!this.isAtEof) {
            if (s !== c) {
                break;
            }
            s = this.next();
        }
        this.backup();
        this.ignore();
    }
    // skips text while any of chars matches and ignores the text span
    skipRun(chars) {
        if (this.isAtEof) {
            return;
        }
        while (!this.isAtEof) {
            var c = this.next();
            if (chars.indexOf(c) === -1) {
                break;
            }
        }
        this.backup();
        this.ignore();
    }
    // skips over whitespace (tab, space) and ignores the text span
    skipWhiteSpace() {
        if (this.isAtEof) {
            return;
        }
        let c = null;
        while (!this.isAtEof) {
            c = this.next();
            if (c === ' ' || c === '\t') {
                continue;
            }
            break;
        }
        if (c !== Scanner.EOF && c !== ' ' && c !== '\t') {
            this.backup();
        }
        this.ignore();
    }
    expect(value) {
        if (!this.input.substring(this.pos).startsWith(value)) {
            throw new Error('Unexpected character.');
        }
        this.pos += value.length;
    }
    expectOneOf(values) {
        let match = values.filter(s => this.input.substr(this.pos).startsWith(s));
        if (match.length !== 1) {
            if (match.length > 1) {
                throw new Error('Too many matches.');
            }
            throw new Error('Unexpected character.');
        }
        this.pos += match[0].length;
    }
}
Scanner.EOF = '__EOF__';
exports.Scanner = Scanner;

//# sourceMappingURL=scanner.js.map
