import * as React from 'react'
import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';

type ColorAdjuster = {
  (): string
  negate(n: number): ColorAdjuster
  lighten(n: number): ColorAdjuster
  darken(n: number): ColorAdjuster
  saturate(n: number): ColorAdjuster
  desaturate(n: number): ColorAdjuster
  greyscale(n: number): ColorAdjuster
  whiten(n: number): ColorAdjuster
  blacken(n: number): ColorAdjuster
  clearer(n: number): ColorAdjuster
  opaquer(n: number): ColorAdjuster
  rotate(n: number): ColorAdjuster
}

export interface ThemeInterface {
  background: ColorAdjuster
  background2: ColorAdjuster
  background3: ColorAdjuster
  background4: ColorAdjuster
  primary: ColorAdjuster
  primaryText: ColorAdjuster
  secondary: ColorAdjuster
  white: string
  gray: ColorAdjuster
  black: ColorAdjuster
  green: ColorAdjuster
  redBackground: ColorAdjuster
  red: ColorAdjuster
  templateColor: string
}

export type ThemeProps<Props> = Props & {
  theme: ThemeInterface
}

type ComponentProps<Props> = ThemeProps<Props> & {
  className?: string
}

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>;



export function component<Props> (component?: string | React.ComponentClass<Props> | React.StatelessComponent<Props>): React.StatelessComponent<ComponentProps<Props>> {
  return props => React.createElement(component || 'div', props, props.children)
}

export { css, injectGlobal, keyframes, ThemeProvider };



export default styled;

