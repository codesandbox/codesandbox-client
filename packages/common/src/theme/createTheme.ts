import Color from 'color';
import { decorateSelector } from './decorateSelector';

type NestedColor = { [P in keyof Color]: (val: number) => NestedColor } &
  (() => string);

export const createTheme = <T>(colors: T): { [P in keyof T]: NestedColor } =>
  Object.keys(colors)
    .map(c => ({ key: c, value: colors[c] }))
    .map(({ key, value }) => ({ key, value: decorateSelector(() => value) }))
    .reduce((prev, { key, value }) => ({ ...prev, [key]: value }), {}) as any;
