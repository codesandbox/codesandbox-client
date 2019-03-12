export declare enum ScanError {
    None = 0,
    UnexpectedEndOfComment = 1,
    UnexpectedEndOfString = 2,
    UnexpectedEndOfNumber = 3,
    InvalidUnicode = 4,
    InvalidEscapeCharacter = 5,
    InvalidCharacter = 6,
}
export declare enum SyntaxKind {
    Unknown = 0,
    OpenBraceToken = 1,
    CloseBraceToken = 2,
    OpenBracketToken = 3,
    CloseBracketToken = 4,
    CommaToken = 5,
    ColonToken = 6,
    NullKeyword = 7,
    TrueKeyword = 8,
    FalseKeyword = 9,
    StringLiteral = 10,
    NumericLiteral = 11,
    LineCommentTrivia = 12,
    BlockCommentTrivia = 13,
    LineBreakTrivia = 14,
    Trivia = 15,
    EOF = 16,
}
/**
 * The scanner object, representing a JSON scanner at a position in the input string.
 */
export interface JSONScanner {
    /**
     * Sets the scan position to a new offset. A call to 'scan' is needed to get the first token.
     */
    setPosition(pos: number): void;
    /**
     * Read the next token. Returns the tolen code.
     */
    scan(): SyntaxKind;
    /**
     * Returns the current scan position, which is after the last read token.
     */
    getPosition(): number;
    /**
     * Returns the last read token.
     */
    getToken(): SyntaxKind;
    /**
     * Returns the last read token value. The value for strings is the decoded string content. For numbers its of type number, for boolean it's true or false.
     */
    getTokenValue(): string;
    /**
     * The start offset of the last read token.
     */
    getTokenOffset(): number;
    /**
     * The length of the last read token.
     */
    getTokenLength(): number;
    /**
     * An error code of the last scan.
     */
    getTokenError(): ScanError;
}
/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */
export declare function createScanner(text: string, ignoreTrivia?: boolean): JSONScanner;
/**
 * Takes JSON with JavaScript-style comments and remove
 * them. Optionally replaces every none-newline character
 * of comments with a replaceCharacter
 */
export declare function stripComments(text: string, replaceCh?: string): string;
export interface ParseError {
    error: ParseErrorCode;
    offset: number;
    length: number;
}
export declare enum ParseErrorCode {
    InvalidSymbol = 0,
    InvalidNumberFormat = 1,
    PropertyNameExpected = 2,
    ValueExpected = 3,
    ColonExpected = 4,
    CommaExpected = 5,
    CloseBraceExpected = 6,
    CloseBracketExpected = 7,
    EndOfFileExpected = 8,
}
export declare type NodeType = 'object' | 'array' | 'property' | 'string' | 'number' | 'boolean' | 'null';
export interface Node {
    type: NodeType;
    value?: any;
    offset: number;
    length: number;
    columnOffset?: number;
    parent?: Node;
    children?: Node[];
}
export declare type Segment = string | number;
export declare type JSONPath = Segment[];
export interface Location {
    /**
     * The previous property key or literal value (string, number, boolean or null) or undefined.
     */
    previousNode?: Node;
    /**
     * The path describing the location in the JSON document. The path consists of a sequence strings
     * representing an object property or numbers for array indices.
     */
    path: JSONPath;
    /**
     * Matches the locations path against a pattern consisting of strings (for properties) and numbers (for array indices).
     * '*' will match a single segment, of any property name or index.
     * '**' will match a sequece of segments or no segment, of any property name or index.
     */
    matches: (patterns: JSONPath) => boolean;
    /**
     * If set, the location's offset is at a property key.
     */
    isAtPropertyKey: boolean;
}
/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */
export declare function getLocation(text: string, position: number): Location;
export interface ParseOptions {
    disallowComments?: boolean;
    allowTrailingComma?: boolean;
}
/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */
export declare function parse(text: string, errors?: ParseError[], options?: ParseOptions): any;
/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */
export declare function parseTree(text: string, errors?: ParseError[], options?: ParseOptions): Node;
export declare function findNodeAtLocation(root: Node, path: JSONPath): Node;
export declare function getNodeValue(node: Node): any;
/**
 * Parses the given text and invokes the visitor functions for each object, array and literal reached.
 */
export declare function visit(text: string, visitor: JSONVisitor, options?: ParseOptions): any;
export interface JSONVisitor {
    /**
     * Invoked when an open brace is encountered and an object is started. The offset and length represent the location of the open brace.
     */
    onObjectBegin?: (offset: number, length: number) => void;
    /**
     * Invoked when a property is encountered. The offset and length represent the location of the property name.
     */
    onObjectProperty?: (property: string, offset: number, length: number) => void;
    /**
     * Invoked when a closing brace is encountered and an object is completed. The offset and length represent the location of the closing brace.
     */
    onObjectEnd?: (offset: number, length: number) => void;
    /**
     * Invoked when an open bracket is encountered. The offset and length represent the location of the open bracket.
     */
    onArrayBegin?: (offset: number, length: number) => void;
    /**
     * Invoked when a closing bracket is encountered. The offset and length represent the location of the closing bracket.
     */
    onArrayEnd?: (offset: number, length: number) => void;
    /**
     * Invoked when a literal value is encountered. The offset and length represent the location of the literal value.
     */
    onLiteralValue?: (value: any, offset: number, length: number) => void;
    /**
     * Invoked when a comma or colon separator is encountered. The offset and length represent the location of the separator.
     */
    onSeparator?: (charcter: string, offset: number, length: number) => void;
    /**
     * Invoked on an error.
     */
    onError?: (error: ParseErrorCode, offset: number, length: number) => void;
}
