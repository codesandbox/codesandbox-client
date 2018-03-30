import * as React from 'react';
import * as styledComponents from 'styled-components';

type ColorAdjuster = {
    (): string;
    negate(n: number): ColorAdjuster;
    lighten(n: number): ColorAdjuster;
    darken(n: number): ColorAdjuster;
    saturate(n: number): ColorAdjuster;
    desaturate(n: number): ColorAdjuster;
    greyscale(n: number): ColorAdjuster;
    whiten(n: number): ColorAdjuster;
    blacken(n: number): ColorAdjuster;
    clearer(n: number): ColorAdjuster;
    opaquer(n: number): ColorAdjuster;
    rotate(n: number): ColorAdjuster;
};

export interface IThemeInterface {
    background: ColorAdjuster;
    background2: ColorAdjuster;
    background3: ColorAdjuster;
    background4: ColorAdjuster;
    primary: ColorAdjuster;
    primaryText: ColorAdjuster;
    secondary: ColorAdjuster;
    white: string;
    gray: ColorAdjuster;
    black: ColorAdjuster;
    green: ColorAdjuster;
    redBackground: ColorAdjuster;
    red: ColorAdjuster;
    templateColor: () => string;
}

export type ThemeProps<Props> = Props & {
    theme: IThemeInterface;
};

type ComponentProps<Props> = ThemeProps<Props> & {
    className?: string;
};

const {
    default: styled,
    css,
    injectGlobal,
    keyframes,
    ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<IThemeInterface>;

const allowedDomProps = [ 'className', 'style' ];

function filterProps(props) {
    return Object.keys(props).reduce((currentProps, key) => {
        if (allowedDomProps.indexOf(key) >= 0) {
            currentProps[key] = props[key];
        }

        return currentProps;
    }, {}) as any;
}

export function component<Props, ExtendedProps = {}>(
    comp: string | React.ComponentClass<ExtendedProps> | React.StatelessComponent<ExtendedProps> = 'div'
): React.StatelessComponent<ComponentProps<Props & ExtendedProps>> {
    return (props) =>
        React.createElement(comp, typeof component === 'string' ? filterProps(props) : props, props.children);
}

export { css, injectGlobal, keyframes, ThemeProvider };

export default styled;
