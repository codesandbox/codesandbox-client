export declare enum TokenType {
    StartCommentTag = 0,
    Comment = 1,
    EndCommentTag = 2,
    StartTagOpen = 3,
    StartTagClose = 4,
    StartTagSelfClose = 5,
    StartTag = 6,
    StartInterpolation = 7,
    EndTagOpen = 8,
    EndTagClose = 9,
    EndTag = 10,
    EndInterpolation = 11,
    DelimiterAssign = 12,
    AttributeName = 13,
    AttributeValue = 14,
    StartDoctypeTag = 15,
    Doctype = 16,
    EndDoctypeTag = 17,
    Content = 18,
    InterpolationContent = 19,
    Whitespace = 20,
    Unknown = 21,
    Script = 22,
    Styles = 23,
    EOS = 24
}
export declare enum ScannerState {
    WithinContent = 0,
    WithinInterpolation = 1,
    AfterOpeningStartTag = 2,
    AfterOpeningEndTag = 3,
    WithinDoctype = 4,
    WithinTag = 5,
    WithinEndTag = 6,
    WithinComment = 7,
    WithinScriptContent = 8,
    WithinStyleContent = 9,
    AfterAttributeName = 10,
    BeforeAttributeValue = 11
}
export interface Scanner {
    scan(): TokenType;
    scanForRegexp(regexp: RegExp): TokenType;
    getTokenType(): TokenType;
    getTokenOffset(): number;
    getTokenLength(): number;
    getTokenEnd(): number;
    getTokenText(): string;
    getTokenError(): string;
    getScannerState(): ScannerState;
}
export declare function createScanner(input: string, initialOffset?: number, initialState?: ScannerState): Scanner;
