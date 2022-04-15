import { RGBColor } from './ColorTypes';
export declare function ConvertString(input: string, return255?: boolean, alpha255?: boolean): RGBColor;
/**
 * **assumes that the input is valid**
 */
export declare function HandleConvertHexString(text: string, return255?: boolean, alpha255?: boolean): RGBColor;
