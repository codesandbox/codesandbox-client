import { GetColorType, GetColorOptions } from './interfaces';
import { RGBColor } from './ColorTypes';
export * from './ColorTypes';
export * from './ColorConverters';
export * from './regex';
export * from './validators';
export * from './utils';
export default class Color {
    private color;
    constructor(input?: string | RGBColor);
    Get(type?: GetColorType, options?: GetColorOptions): string | RGBColor | import("./ColorTypes").HSVColor;
    Set(input: string | RGBColor): void;
}
