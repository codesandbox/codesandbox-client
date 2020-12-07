<span id="BADGE_GENERATION_MARKER_0"></span>
[![circleci](https://img.shields.io/circleci/build/github/TheRealSyler/s.color)](https://app.circleci.com/github/TheRealSyler/s.color/pipelines) [![Custom](https://codecov.io/gh/TheRealSyler/s.color/branch/master/graph/badge.svg)](https://codecov.io/gh/TheRealSyler/s.color) [![npmV](https://img.shields.io/npm/v/s.color?color=green)](https://www.npmjs.com/package/s.color) [![min](https://img.shields.io/bundlephobia/min/s.color)](https://bundlephobia.com/result?p=s.color) [![install](https://badgen.net/packagephobia/install/s.color)](https://packagephobia.now.sh/result?p=s.color) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/s.color)](https://github.com/TheRealSyler/s.color)
<span id="BADGE_GENERATION_MARKER_1"></span>

> Note: if you want a reliable library use something like color instead.

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[ColorConverters](#colorconverters)**

  - [RGBToHSV](#rgbtohsv)
  - [HSVToRGB](#hsvtorgb)
  - [StringToRGB](#stringtorgb)
  - [StringToHVS](#stringtohvs)
  - [HSVToHEX](#hsvtohex)
  - [RGBToHEX](#rgbtohex)

- **[ColorTypes](#colortypes)**

  - [RGBColor](#rgbcolor)
  - [HSVColor](#hsvcolor)
  - [StringColor](#stringcolor)

- **[HandleGet](#handleget)**

  - [HandleGetHex](#handlegethex)

- **[HandleSet](#handleset)**

  - [ConvertString](#convertstring)
  - [HandleConvertHexString](#handleconverthexstring)

- **[UtilityFunction](#utilityfunction)**

  - [GetReadableTextColor](#getreadabletextcolor)
  - [ShiftHue](#shifthue)

- **[index](#index)**


- **[interfaces](#interfaces)**

  - [GetColorTypeHex](#getcolortypehex)
  - [GetColorType](#getcolortype)
  - [GetColorOptions](#getcoloroptions)

- **[regex](#regex)**

  - [isValidHex](#isvalidhex)
  - [isValidRGB](#isvalidrgb)

- **[utils](#utils)**

  - [GetReadableTextColor](#getreadabletextcolor)
  - [ShiftHue](#shifthue)
  - [convertCssColorToHex](#convertcsscolortohex)

- **[validators](#validators)**

  - [isValidStringColor](#isvalidstringcolor)

### ColorConverters

##### RGBToHSV

```typescript
/**
 * Takes an `RGBColor` and converts it to `HSVColor`
 */
function RGBToHSV(color: RGBColor, is255?: boolean): HSVColor;
```

##### HSVToRGB

```typescript
/**
 * Takes an `HSVColor` and converts it to `RGBColor`
 */
function HSVToRGB(hsv: HSVColor, is100?: boolean): RGBColor;
```

##### StringToRGB

```typescript
/**
 * Takes an `StringColor` and converts it to `RGBColor`,
 * If input string is invalid `null` will be returned.
 */
function StringToRGB(input: string, return255?: boolean, alpha255?: boolean): RGBColor;
```

##### StringToHVS

```typescript
/**
 * Takes an `StringColor` and converts it to `HSVColor`,
 * If input string is invalid `null` will be returned.
 */
function StringToHVS(input: string, return255?: boolean, alpha255?: boolean): HSVColor;
```

##### HSVToHEX

```typescript
/**
 * Takes an `HSVColor` and converts it to `String` (HEX Format)
 */
function HSVToHEX(hsv: HSVColor, options?: {
    type?: GetColorTypeHex;
    isLong?: boolean;
}
```

##### RGBToHEX

```typescript
/**
 * Takes an `RGBColor` and converts it to `String` (HEX Format)
 */
function RGBToHEX(color: RGBColor, type?: GetColorTypeHex): string;
```

### ColorTypes

##### RGBColor

```typescript
/**
 * Represents a color in the rgb(a) format.
 *
 *
 * Range `[0 - 1]`
 */
class RGBColor {
    /**
     * Range [0-1]
     */
    r: number;
    /**
     * Range [0-1]
     */
    g: number;
    /**
     * Range [0-1]
     */
    b: number;
    /**
     * Range [0-1]
     */
    a: number;
    constructor(r: number, g: number, b: number, a?: number);
}
```

##### HSVColor

```typescript
/**
 * Represents a color in the hsv(a) format.
 *
 *
 * Range `[h 0 - 360, v/s/a 0 - 1]`
 */
class HSVColor {
    /**
     * Range [0-360]
     */
    h: number;
    /**
     * Range [0-100]
     */
    s: number;
    /**
     * Range [0-100]
     */
    v: number;
    /**
     * Range [0-1]
     */
    a: number;
    constructor(h: number, s: number, v: number, a?: number);
}
```

##### StringColor

```typescript
/**
 * Represents a color in a string format.
 * Valid strings are `#000 | #0000 | #000000 | #00000000`
 * Or `rgb(0, 0, 0, 0) | rgba(0, 0, 0, 0, 0)` Range [rgb 0-255, a: 0-1]
 *
 */
class StringColor {
    color: string;
    constructor(color: string);
}
```

### HandleGet

##### HandleGetHex

```typescript
function HandleGetHex(type: GetColorType, color: RGBColor, options?: GetColorOptions): string;
```

### HandleSet

##### ConvertString

```typescript
function ConvertString(input: string, return255?: boolean, alpha255?: boolean): RGBColor;
```

##### HandleConvertHexString

```typescript
/**
 * **assumes that the input is valid**
 */
function HandleConvertHexString(text: string, return255?: boolean, alpha255?: boolean): RGBColor;
```

### UtilityFunction

##### GetReadableTextColor

```typescript
function GetReadableTextColor(color: RGBColor | HSVColor | StringColor | string): RGBColor | HSVColor | "#000" | "#fff";
```

##### ShiftHue

```typescript
/**
 * Shifts the hue of the `HSVColor` by the Value
 */
function ShiftHue(hsv: HSVColor, value: number): HSVColor;
```

### index

### interfaces

##### GetColorTypeHex

```typescript
type GetColorTypeHex = 'hex' | 'hex-short' | 'hex-without-alpha' | 'hex-without-alpha-short';
```

##### GetColorType

```typescript
type GetColorType = 'rgb' | GetColorTypeHex | 'rgba' | 'object' | 'hsv';
```

##### GetColorOptions

```typescript
interface GetColorOptions {
    /**
     * if true `#fff` will be output as `#FFF`
     */
    UpperCaseHex: boolean;
}
```

### regex

##### isValidHex

```typescript
function isValidHex(text: string): boolean;
```

##### isValidRGB

```typescript
function isValidRGB(text: string): boolean;
```

### utils

##### GetReadableTextColor

```typescript
function GetReadableTextColor(color: RGBColor | HSVColor | StringColor | string): RGBColor | HSVColor | "#000" | "#fff";
```

##### ShiftHue

```typescript
/**
 * Shifts the hue of the `HSVColor` by the Value
 */
function ShiftHue(hsv: HSVColor, value: number): HSVColor;
```

##### convertCssColorToHex

```typescript
/**Returns the hex value of the color string or the input string */
function convertCssColorToHex(color: string): string;
```

### validators

##### isValidStringColor

```typescript
function isValidStringColor(input: string): string;
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

# License

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
