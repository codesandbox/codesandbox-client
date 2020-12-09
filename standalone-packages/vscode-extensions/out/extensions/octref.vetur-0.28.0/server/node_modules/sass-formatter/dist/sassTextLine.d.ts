export declare class SassTextLine {
    private text;
    isEmptyOrWhitespace: boolean;
    constructor(text: string);
    /**Sets the text of the line. */
    set(text: string): void;
    /**Gets the text of the line. */
    get(): string;
}
