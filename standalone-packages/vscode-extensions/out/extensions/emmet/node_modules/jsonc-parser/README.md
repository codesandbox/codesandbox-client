# jsonc-parser
Scanner and parser for JSON with comments.

[![npm Package](https://img.shields.io/npm/v/jsonc-parser.svg?style=flat-square)](https://www.npmjs.org/package/jsonc-parser)
[![NPM Downloads](https://img.shields.io/npm/dm/jsonc-parser.svg)](https://npmjs.org/package/jsonc-parser)
[![Build Status](https://travis-ci.org/Microsoft/node-jsonc-parser.svg?branch=master)](https://travis-ci.org/Microsoft/node-jsonc-parser)

Why?
----
JSONC is JSON with JavaScript style comments. This node module provides a scanner and fault tolerant parser that can process JSONC but is also useful for standard JSON.
 - the *scanner* tokenizes the input string into tokens and token offsets
 - the *parse* function evaluates the JavaScipt object represented by JSON string in a fault tolerant fashion.
 - the *visit* function implements a 'SAX' style parser with callbacks for the encountered properties and values.
 - the *getLocation* API returns a path that describes the location of a given offset in a given file.

Installation
------------

    npm install --save jsonc-parser
    
    
API
---

### Scanner:
```typescript

/**
 * Creates a JSON scanner on the given text.
 * If ignoreTrivia is set, whitespaces or comments are ignored.
 */
export function createScanner(text:string, ignoreTrivia:boolean = false):JSONScanner;
    
/**
 * The scanner object, representing a JSON scanner at a position in the input string.
 */
export interface JSONScanner {
    /**
     * Sets the scan position to a new offset. A call to 'scan' is needed to get the first token.
     */
    setPosition(pos: number): any;
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
```

### Parser:
```typescript

export interface ParseOptions {
    disallowComments?: boolean;
}
/**
 * Parses the given text and returns the object the JSON content represents. On invalid input, the parser tries to be as fault lolerant as possible, but still return a result.
 * Therefore always check the errors list to find out if the input was valid.
 */
export declare function parse(text: string, errors?: {error: ParseErrorCode;}[], options?: ParseOptions): any;

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

/**
 * Parses the given text and returns a tree representation the JSON content. On invalid input, the parser tries to be as fault tolerant as possible, but still return a result.
 */
export declare function parseTree(text: string, errors?: ParseError[], options?: ParseOptions): Node;

export declare type NodeType = "object" | "array" | "property" | "string" | "number" | "boolean" | "null";
export interface Node {
    type: NodeType;
    value?: any;
    offset: number;
    length: number;
    columnOffset?: number;
    parent?: Node;
    children?: Node[];
}

```

### Utilities:
```typescript
/**
 * Takes JSON with JavaScript-style comments and remove
 * them. Optionally replaces every none-newline character
 * of comments with a replaceCharacter
 */
export declare function stripComments(text: string, replaceCh?: string): string;

/**
 * For a given offset, evaluate the location in the JSON document. Each segment in the location path is either a property name or an array index.
 */
export declare function getLocation(text: string, position: number): Location;

export declare type Segment = string | number;
export interface Location {
    /**
     * The previous property key or literal value (string, number, boolean or null) or undefined.
     */
    previousNode?: Node;
    /**
     * The path describing the location in the JSON document. The path consists of a sequence strings
     * representing an object property or numbers for array indices.
     */
    path: Segment[];
    /**
     * Matches the locations path against a pattern consisting of strings (for properties) and numbers (for array indices).
     * '*' will match a single segment, of any property name or index.
     * '**' will match a sequece of segments or no segment, of any property name or index.
     */
    matches: (patterns: Segment[]) => boolean;
    /**
     * If set, the location's offset is at a property key.
     */
    isAtPropertyKey: boolean;
}



```


License
-------

(MIT License)

Copyright 2016, Microsoft