import theme from '../../theme';
export declare type ColorProps = {
    small?: boolean;
    right?: boolean;
    offMode?: boolean;
    secondary?: boolean;
    theme: (typeof theme) & {
        templateColor: string;
    };
};
export declare const Container: import("styled-components").StyledComponent<"div", any, ColorProps, never>;
export declare const Dot: import("styled-components").StyledComponent<"div", any, {
    small: boolean;
    right: boolean;
}, never>;
