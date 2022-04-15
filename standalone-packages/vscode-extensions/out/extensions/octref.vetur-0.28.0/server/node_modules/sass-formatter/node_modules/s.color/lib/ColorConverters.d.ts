import { RGBColor, HSVColor } from './ColorTypes';
import { GetColorTypeHex } from './interfaces';
/**
 * Takes an `RGBColor` and converts it to `HSVColor`
 */
export declare function RGBToHSV(color: RGBColor, is255?: boolean): HSVColor;
/**
 * Takes an `HSVColor` and converts it to `RGBColor`
 */
export declare function HSVToRGB(hsv: HSVColor, is100?: boolean): RGBColor;
/**
 * Takes an `StringColor` and converts it to `RGBColor`,
 * If input string is invalid `null` will be returned.
 */
export declare function StringToRGB(input: string, return255?: boolean, alpha255?: boolean): RGBColor;
/**
 * Takes an `StringColor` and converts it to `HSVColor`,
 * If input string is invalid `null` will be returned.
 */
export declare function StringToHVS(input: string, return255?: boolean, alpha255?: boolean): HSVColor;
/**
 * Takes an `HSVColor` and converts it to `String` (HEX Format)
 */
export declare function HSVToHEX(hsv: HSVColor, options?: {
    type?: GetColorTypeHex;
    isLong?: boolean;
}): string;
/**
 * Takes an `RGBColor` and converts it to `String` (HEX Format)
 */
export declare function RGBToHEX(color: RGBColor, type?: GetColorTypeHex): string;
