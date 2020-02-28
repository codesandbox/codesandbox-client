# ts-simple-type

<a href="https://npmcharts.com/compare/ts-simple-type?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/ts-simple-type.svg" height="20"></img></a>
<a href="https://www.npmjs.com/package/ts-simple-type"><img alt="NPM Version" src="https://badge.fury.io/js/ts-simple-type.svg" height="20"></img></a>
<a href="https://github.com/runem/ts-simple-type/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/runem/ts-simple-type.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
[![CircleCI](https://circleci.com/gh/runem/ts-simple-type.svg?style=svg)](https://circleci.com/gh/runem/ts-simple-type)

## What is this?

Right now the type checker for Typescript API doesn't expose methods for checking assignability and building types. See issue [#9879](https://github.com/Microsoft/TypeScript/issues/9879) and [#29432](https://github.com/Microsoft/TypeScript/issues/29432) on the Typescript github repository.

To fill in the gap while this issue is being discussed this library aims to provide the most essential helper functions for working with types in Typescript.

Furthermore this library can help you construct types (called `SimpleType`) which can be serialized and easy analyzed. 

This library has more than 6000 tests comparing results to actual Typescript diagnostics (see [test-types.ts](https://github.com/runem/ts-simple-type/blob/master/test-types/test-types.ts)).

## Installation

```bash
npm install ts-simple-type
```

## How to use

The API is very simple. For example if you want to check if Typescript type `typeB` is assignable to `typeA`, you can use the following function.

```typescript
import { isAssignableToType } from "ts-simple-type";

const isAssignable = isAssignableToType(typeA, typeB, typeChecker);
```

## SimpleType

To make it easier to work with typescript types this library works by (behind the curtain) converting them to the interface `SimpleType`. Most functions in this library work with both `SimpleType` and the known and loved Typescript-provided `Type` interface. This means that you can easily create a complex type yourself and compare it to a native Typescript type. It also means that you can use this library to serialize types and even compare them in the browser.

The `SimpleType` interface can be used to construct your own types for typechecking.

```typescript
import { SimpleType, SimpleTypeKind } from "ts-simple-type";

const colors: SimpleType = {
  kind: SimpleTypeKind.UNION,
  types: [
    { kind: SimpleTypeKind.STRING_LITERAL, value: "RED" },
    { kind: SimpleTypeKind.STRING_LITERAL, value: "GREEN" },
    { kind: SimpleTypeKind.STRING_LITERAL, value: "BLUE" }
  ]
};

simpleTypeToString(colors)
> "RED" | "GREEN" | "BLUE"

isAssignableToType(colors, { kind: SimpleTypeKind.STRING_LITERAL, value: "YELLOW" })
> false;

isAssignableToValue(colors, "BLUE")
> true;

isAssignableToValue(colors, "PINK")
> false;
```

## More examples

```typescript
const typeA = checker.getTypeAtLocation(nodeA);
const typeB = checker.getTypeAtLocation(nodeB);

/*
  For this example, let's say:
  - typeA is number
  - typeB is string[]
*/

// simpleTypeToString
simpleTypeToString(typeA)
> "number"

simpleTypeToString(typeB)
> "string[]"


// isAssignableToType
isAssignableToType(typeA, typeB, checker)
> false

isAssignableToType(typeA, { kind: SimpleTypeKind.NUMBER }, checker)
> true

isAssignableToType(
  typeB,
  { kind: SimpleTypeKind.ARRAY, type: {kind: SimpleTypeKind.STRING} }
  checker)
> true

isAssignableToType(
  { kind: SimpleTypeKind.STRING },
  { kind: SimpleTypeKind.STRING_LITERAL, value: "hello"})
> true


// isAssignableToPrimitiveType
isAssignableToPrimitiveType(typeA, checker)
> true

isAssignableToPrimitiveType(typeB, checker)
> false

isAssignableToPrimitiveType({ kind: SimpleTypeKind.ARRAY, type: {kind: SimpleTypeKind.STRING} })
> false


// isAssignableToSimpleTypeKind
isAssignableToSimpleTypeKind(typeA, SimpleTypeKind.NUMBER, checker)
> true

isAssignableToSimpleTypeKind(typeB, SimpleTypeKind.BOOLEAN, checker)
> false

isAssignableToSimpleTypeKind(typeB, [SimpleTypeKind.STRING, SimpleTypeKind.UNDEFINED], checker, {op: "or"})
> true


// isAssignableToValue
isAssignableToValue(typeA, 123, checker)
> true

isAssignableToValue(typeA, "hello", checker)
> false

isAssignableToValue(typeB, true, checker)
> false


// toSimpleType
toSimpleType(typeA, {checker})
> { kind: SimpleTypeKind.NUMBER }

toSimpleType(typeB, {checker})
> { kind: SimpleTYpeKind.ARRAY, type: { kind: SimpleTypeKind.NUMBER } }

```

## API Documentation

For functions that take either a native Typescript `Type` or a `SimpleType` the `TypeChecker` is only required if a Typescript `Type` has been given to the function.

### isAssignableToType
> isAssignableToType(typeA: Type | SimpleType, typeB: Type | SimpleType, checker?: TypeChecker): boolean

Returns true if `typeB` is assignable to `typeA`.

### isAssignableToPrimitiveType
> isAssignableToPrimitiveType(type: Type | SimpleType, checker?: TypeChecker): boolean

Returns true if `type` is assignable to a primitive type like `string`, `number`, `boolean`, `bigint`, `null` or `undefined`.

### isAssignableToSimpleTypeKind
> isAssignableToSimpleTypeKind(type: Type | SimpleType, kind: SimpleTypeKind | SimpleTypeKind[], checker?: TypeChecker, options?: Options): boolean

Returns true if `type` is assignable to a `SimpleTypeKind`.
- `options.matchAny` (boolean): Can be used to allow the "any" type to match everything.
- `options.or` ("and" | "or"): Can be used control how an array will match if kind is an array of SimpleTypeKind.

### isAssignableToValue
> isAssignableToValue(type: SimpleType | Type, value: any, checker?: TypeChecker): boolean

Returns true if `type` is assignable to the value.

### simpleTypeToString
> simpleTypeToString(type: SimpleType): string

Returns a string representation of the simple type. The string representation matches the one Typescript generates.

### toSimpleType
> toSimpleType(type: Type | Node, checker: TypeChecker): SimpleType

Returns a `SimpleType` that represents a native Typescript `Type`.

## Roadmap

-   Overloaded functions
-   Change behavior when `string literal` is assigned to an enum
-   Options to switch from strict type checking
