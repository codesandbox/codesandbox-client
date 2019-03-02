"use strict";
/* tslint:disable:no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
const node = require("../commands/substitute");
const scanner_1 = require("../scanner");
const error = require("../../error");
function isValidDelimiter(char) {
    return !!/^[^\w\s\\|"]{1}$/g.exec(char);
}
function parsePattern(pattern, scanner, delimiter) {
    if (scanner.isAtEof) {
        return [pattern, false];
    }
    else {
        let currentChar = scanner.next();
        if (currentChar === delimiter) {
            // TODO skip delimiter
            return [pattern, true];
        }
        else if (currentChar === '\\') {
            if (!scanner.isAtEof) {
                currentChar = scanner.next();
                if (currentChar !== delimiter) {
                    switch (currentChar) {
                        case 'r':
                            pattern += '\r';
                            break;
                        case 'n':
                            pattern += '\n';
                            break;
                        default:
                            pattern += '\\';
                            pattern += currentChar;
                            break;
                    }
                }
                else {
                    pattern += currentChar;
                }
            }
            return parsePattern(pattern, scanner, delimiter);
        }
        else {
            pattern += currentChar;
            return parsePattern(pattern, scanner, delimiter);
        }
    }
}
function parseSubstituteFlags(scanner) {
    let flags = 0;
    let index = 0;
    while (true) {
        if (scanner.isAtEof) {
            break;
        }
        let c = scanner.next();
        switch (c) {
            case '&':
                if (index === 0) {
                    flags = flags | node.SubstituteFlags.KeepPreviousFlags;
                }
                else {
                    // Raise Error
                    return node.SubstituteFlags.None;
                }
                break;
            case 'c':
                flags = flags | node.SubstituteFlags.ConfirmEach;
                break;
            case 'e':
                flags = flags | node.SubstituteFlags.SuppressError;
                break;
            case 'g':
                flags = flags | node.SubstituteFlags.ReplaceAll;
                break;
            case 'i':
                flags = flags | node.SubstituteFlags.IgnoreCase;
                break;
            case 'I':
                flags = flags | node.SubstituteFlags.NoIgnoreCase;
                break;
            case 'n':
                flags = flags | node.SubstituteFlags.PrintCount;
                break;
            case 'p':
                flags = flags | node.SubstituteFlags.PrintLastMatchedLine;
                break;
            case '#':
                flags = flags | node.SubstituteFlags.PrintLastMatchedLineWithNumber;
                break;
            case 'l':
                flags = flags | node.SubstituteFlags.PrintLastMatchedLineWithList;
                break;
            case 'r':
                flags = flags | node.SubstituteFlags.UsePreviousPattern;
                break;
            default:
                scanner.backup();
                return flags;
        }
        index++;
    }
    return flags;
}
function parseCount(scanner) {
    let countStr = '';
    while (true) {
        if (scanner.isAtEof) {
            break;
        }
        countStr += scanner.next();
    }
    let count = Number.parseInt(countStr, 10);
    // TODO: If count is not valid number, raise error
    return Number.isInteger(count) ? count : -1;
}
/**
 * Substitute
 * :[range]s[ubstitute]/{pattern}/{string}/[flags] [count]
 * For each line in [range] replace a match of {pattern} with {string}.
 * {string} can be a literal string, or something special; see |sub-replace-special|.
 */
function parseSubstituteCommandArgs(args) {
    try {
        let searchPattern;
        let replaceString;
        let flags;
        let count;
        if (!args) {
            // special case for :s
            return new node.SubstituteCommand({
                pattern: undefined,
                replace: '',
                flags: node.SubstituteFlags.None,
            });
        }
        let scanner;
        let delimiter = args[0];
        if (isValidDelimiter(delimiter)) {
            if (args.length === 1) {
                // special case for :s/ or other delimiters
                return new node.SubstituteCommand({
                    pattern: '',
                    replace: '',
                    flags: node.SubstituteFlags.None,
                });
            }
            let secondDelimiterFound;
            scanner = new scanner_1.Scanner(args.substr(1, args.length - 1));
            [searchPattern, secondDelimiterFound] = parsePattern('', scanner, delimiter);
            if (!secondDelimiterFound) {
                // special case for :s/search
                return new node.SubstituteCommand({
                    pattern: searchPattern,
                    replace: '',
                    flags: node.SubstituteFlags.None,
                });
            }
            replaceString = parsePattern('', scanner, delimiter)[0];
        }
        else {
            // if it's not a valid delimiter, it must be flags, so start parsing from here
            searchPattern = undefined;
            replaceString = '';
            scanner = new scanner_1.Scanner(args);
        }
        scanner.skipWhiteSpace();
        flags = parseSubstituteFlags(scanner);
        scanner.skipWhiteSpace();
        count = parseCount(scanner);
        return new node.SubstituteCommand({
            pattern: searchPattern,
            replace: replaceString,
            flags: flags,
            count: count,
        });
    }
    catch (e) {
        throw error.VimError.fromCode(error.ErrorCode.E486);
    }
}
exports.parseSubstituteCommandArgs = parseSubstituteCommandArgs;

//# sourceMappingURL=substitute.js.map
