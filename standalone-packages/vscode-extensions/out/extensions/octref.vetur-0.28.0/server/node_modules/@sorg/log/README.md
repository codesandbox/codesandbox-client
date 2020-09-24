## @sorg/log

<span id="BADGE_GENERATION_MARKER_0"></span>
[![circleci](https://img.shields.io/circleci/build/github/TheRealSyler/s.log)](https://app.circleci.com/github/TheRealSyler/s.log/pipelines) [![Custom](https://www.codefactor.io/repository/github/therealsyler/s.log/badge)](https://www.codefactor.io/repository/github/therealsyler/s.log) [![npmV](https://img.shields.io/npm/v/@sorg/log?color=green)](https://www.npmjs.com/package/@sorg/log) [![min](https://img.shields.io/bundlephobia/min/@sorg/log)](https://bundlephobia.com/result?p=@sorg/log) [![install](https://badgen.net/packagephobia/install/@sorg/log)](https://packagephobia.now.sh/result?p=@sorg/log) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/s.log)](https://github.com/TheRealSyler/s.log)
<span id="BADGE_GENERATION_MARKER_1"></span>

![](https://raw.githubusercontent.com/TheRealSyler/s.log/master/images/s.logger.png)

#### Usage

```typescript
import { Logger, LoggerType } from '@sorg/log';

const logger = new Logger<{ error: LoggerType; info: LoggerType; browserMessage: LoggerType }>({
  error: {
    styles: ['#f24', { color: '#fc0', background: '#001' }],
    wrappers: [
      ['ERROR [', ']: '],
      [' ', '! ']
    ]
  },
  info: {
    styles: ['#39f'],
    wrappers: [['INFO: (', ')']]
  },
  // in the Browser, you can add css properties to style the message, in node you can only use color and background.
  browserMessage: {
    styles: [
      {
        color: '#fff',
        padding: '2rem',
        'text-shadow': '1.5px 1.5px 1px red, -1.5px -1.5px 1px blue',
        'font-size': '2rem'
      }
    ],
    wrappers: []
  }
});

logger.Log('error', '404', 'Message');
logger.Log('info', 'Message');
logger.Log('browserMessage', 'Message');
```

##### Or

```typescript
import { Logger, LoggerType } from '@sorg/log';

const logger = new Logger<{ help: LoggerType }>({
  help: {
    styles: [
      { color: '#f27', background: '#111' },
      { color: '#4e0', background: '#222' },
      { color: '#fa0', background: '#222' }
    ],
    preset: new PresetNodeHelp(
      `Help;
;
--concurrent;Number Of concurrent pages, this cli uses puppeteer to scrape the data.
--outPath;Path Where the Files will be created.;NOTE: The path has to exist.
--fileType;File Type Only Supported Types Are:;json | ts | js
--prefix;prefixes every File.
--ignore;Files in this list don't get Created.;This Arg is Comma Separated Example: 'noDataProps,standardProps'
-h h --help help;Shows this Message.`
    )
  }
});

logger.Log('help');
```

![](https://raw.githubusercontent.com/TheRealSyler/s.log/master/images/logger-ex.png)

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[interfaces](#interfaces)**

  - [LoggerWrapper](#loggerwrapper)
  - [LoggerStyle](#loggerstyle)
  - [LogType](#logtype)
  - [BrowserContext](#browsercontext)
  - [ConverterContext](#convertercontext)
  - [LoggerTypeStyles](#loggertypestyles)
  - [ConverterOutput](#converteroutput)
  - [Converter](#converter)
  - [Styler](#styler)
  - [LoggerType](#loggertype)
  - [CustomHandlerData](#customhandlerdata)
  - [CustomHandler](#customhandler)
  - [PresetHandler](#presethandler)

### interfaces

##### LoggerWrapper

```typescript
type LoggerWrapper = [string, string] | undefined | null;
```

##### LoggerStyle

```typescript
/**
 * color/background work in node and the browser, the other properties only work in the browser.
 */
type LoggerStyle = string | {
    background?: string;
    color?: string;
    padding?: string;
    margin?: string;
    border?: string;
    /** for bold text in node add the value 'bold' */
    'font-weight'?: FontWeightProperty;
    /** if true the style doesn't get reset in node. */
    removeResetColorCode?: boolean;
    [key: string]: number | boolean | string | undefined;
}
```

##### LogType

```typescript
type LogType = string | number | null | undefined | object | any[];
```

##### BrowserContext

```typescript
interface BrowserContext {
    styles: LoggerStyle[];
    index: number;
    offset: number;
}
```

##### ConverterContext

```typescript
interface ConverterContext {
    isObject?: boolean;
    styled?: boolean;
    browserContext?: BrowserContext;
    indentation?: number;
    index?: number;
    typeStyles: LoggerTypeStyles;
}
```

##### LoggerTypeStyles

```typescript
interface LoggerTypeStyles {
    /** Style Applied to any number. */
    number: LoggerStyle;
    /** Style Applied to any string inside of an array or object. */
    string: LoggerStyle;
    /** Style Applied to the brackets of any array or object */
    bracket: LoggerStyle;
    /** Style Applied to the key of any array or object */
    key: LoggerStyle;
    /** * Style Applied to the name (constructor) of any array or object */
    name: LoggerStyle;
    /** Style Applied to null type. */
    null: LoggerStyle;
    /** Style Applied to undefined type. */
    undefined: LoggerStyle;
    /** Style Applied to empty arrays. */
    emptyArray: LoggerStyle;
}
```

##### ConverterOutput

```typescript
type ConverterOutput = {
    message: string;
    styled: boolean;
    nodeOnly?: boolean;
    wrap?: boolean;
}
```

##### Converter

```typescript
type Converter = (message: LogType, context: ConverterContext) => ConverterOutput;
```

##### Styler

```typescript
type Styler = (message: ConverterOutput | string, style: LoggerStyle, wrapper?: LoggerWrapper) => string;
```

##### LoggerType

```typescript
interface LoggerType {
    styles?: LoggerStyle[];
    wrappers?: LoggerWrapper[];
    preset?: Preset;
    /**
     * Used to change Messages before they get styled.
     */
    customHandler?: CustomHandler;
    enabled?: boolean;
    /**
     * Customize styles of arrays, objects, string etc.
     */
    typeStyles?: LoggerTypeStyles;
}
```

##### CustomHandlerData

```typescript
type CustomHandlerData = {
    rawMessages: LogType[];
    wrappers: LoggerWrapper[];
    styles: LoggerStyle[];
    typeStyles: LoggerTypeStyles;
}
```

##### CustomHandler

```typescript
type CustomHandler = (data: CustomHandlerData) => string;
```

##### PresetHandler

```typescript
type PresetHandler<T> = (preset: T, data: CustomHandlerData) => string;
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

### License

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
