export declare class ParseLocation {
    file: ParseSourceFile;
    offset: number;
    line: number;
    col: number;
    constructor(file: ParseSourceFile, offset: number, line: number, col: number);
    toString(): string;
    moveBy(delta: number): ParseLocation;
    getContext(maxChars: number, maxLines: number): {
        before: string;
        after: string;
    } | null;
}
export declare class ParseSourceFile {
    content: string;
    url: string;
    constructor(content: string, url: string);
}
export declare class ParseSourceSpan {
    start: ParseLocation;
    end: ParseLocation;
    details: string | null;
    constructor(start: ParseLocation, end: ParseLocation, details?: string | null);
    toString(): string;
}
export declare enum ParseErrorLevel {
    WARNING = 0,
    ERROR = 1
}
export declare class ParseError {
    span: ParseSourceSpan;
    msg: string;
    level: ParseErrorLevel;
    constructor(span: ParseSourceSpan, msg: string, level?: ParseErrorLevel);
    contextualMessage(): string;
    toString(): string;
}
