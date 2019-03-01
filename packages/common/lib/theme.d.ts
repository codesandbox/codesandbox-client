import * as Color from 'color';
/**
 * Add useful methods directly to selector function, as well as put an rgbString() call at the end
 * @param selector
 */
export declare const decorateSelector: (selector: any) => any;
declare const theme: {
    vscodeTheme: {
        "$schema": string;
        "isCodeSandbox": boolean;
        "type": string;
        "colors": {
            "editor.background": string;
            "editor.foreground": string;
            "editor.selectionBackground": string;
        };
        "tokenColors": ({
            "name": string;
            "scope": string[];
            "settings": {
                "foreground": string;
                "fontStyle": string;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "background": string;
                "foreground": string;
                "fontStyle"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "text-decoration": string;
                "foreground"?: undefined;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string[];
            "settings": {
                "-webkit-font-smoothing": string;
                "foreground"?: undefined;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
            };
        } | {
            "name": string;
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "name": string;
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle": string;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
        } | {
            "scope": string;
            "settings": {
                "foreground": string;
                "fontStyle"?: undefined;
                "background"?: undefined;
                "text-decoration"?: undefined;
                "-webkit-font-smoothing"?: undefined;
            };
            "name"?: undefined;
        })[];
    };
    new: {
        title: Color.Color & (() => string);
        description: Color.Color & (() => string);
        bg: Color.Color & (() => string);
    };
    background: Color.Color & (() => string);
    background2: Color.Color & (() => string);
    background3: Color.Color & (() => string);
    background4: Color.Color & (() => string);
    background5: Color.Color & (() => string);
    primary: Color.Color & (() => string);
    primaryText: Color.Color & (() => string);
    secondary: Color.Color & (() => string);
    shySecondary: Color.Color & (() => string);
    white: Color.Color & (() => string);
    gray: Color.Color & (() => string);
    black: Color.Color & (() => string);
    green: Color.Color & (() => string);
    redBackground: Color.Color & (() => string);
    red: Color.Color & (() => string);
    dangerBackground: Color.Color & (() => string);
};
export default theme;
