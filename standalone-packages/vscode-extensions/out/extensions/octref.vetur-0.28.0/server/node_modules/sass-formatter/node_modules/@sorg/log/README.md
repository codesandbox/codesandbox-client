## @sorg/log

<span id="BADGE_GENERATION_MARKER_0"></span>
[![circleci](https://img.shields.io/circleci/build/github/TheRealSyler/s.log)](https://app.circleci.com/github/TheRealSyler/s.log/pipelines) [![Custom](https://codecov.io/gh/TheRealSyler/s.log/branch/master/graph/badge.svg)](https://codecov.io/gh/TheRealSyler/s.log) [![npmV](https://img.shields.io/npm/v/@sorg/log?color=green)](https://www.npmjs.com/package/@sorg/log) [![min](https://img.shields.io/bundlephobia/min/@sorg/log)](https://bundlephobia.com/result?p=@sorg/log) [![install](https://badgen.net/packagephobia/install/@sorg/log)](https://packagephobia.now.sh/result?p=@sorg/log) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/s.log)](https://github.com/TheRealSyler/s.log)
<span id="BADGE_GENERATION_MARKER_1"></span>

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[interfaces](#interfaces)**

  - [LogStyle](#logstyle)
  - [ConverterInput](#converterinput)
  - [LogMessage](#logmessage)
  - [LogTable](#logtable)

- **[loggers](#loggers)**

  - [LogTable](#logtable)
  - [Log](#log)

- **[styler](#styler)**

  - [styler](#styler)

### interfaces

##### LogStyle

```typescript
/**
 * color/background/font-weight work in node and the browser, the other properties only work in the browser.
 */
type LogStyle = string | {
    background?: string;
    color?: string;
    padding?: string;
    margin?: string;
    border?: string;
    /** for bold text in node add the value 'bold' */
    'font-weight'?: FontWeightProperty;
    /** if true the style doesn't get reset in node. */
    [key: string]: number | boolean | string | undefined;
}
```

##### ConverterInput

```typescript
type ConverterInput = AcceptableTypes | Array<AcceptableTypes>;
```

##### LogMessage

```typescript
type LogMessage = {
    message: string;
    style?: LogStyle;
}
```

##### LogTable

```typescript
type LogTable = (number | string)[][];
```

### loggers

##### LogTable

```typescript
/**Logs a table in node. */
function LogTable(table: LogTable): void;
```

##### Log

```typescript
function Log(...messages: (string | LogMessage)[]): void;
```

### styler

##### styler

```typescript
function styler(input: string, style?: LogStyle): string;
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

### License

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
