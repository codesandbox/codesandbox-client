/**
 * There are 3 layers to our component styles.
 *
 * design language - spacing, fontsizes, radii, etc.
 * vscode theme - color tokens
 * polyfill - color tokens missing from vscode
 */
import dot from 'dot-object';
import deepmerge from 'deepmerge';
import designLanguage from '@codesandbox/common/lib/design-language';
import VSCodeThemes from '@codesandbox/common/lib/themes/';
import polyfillTheme from '../../utils/polyfill-theme';

export const getThemes = async () => {
  // eslint-disable-next-line consistent-return
  const results = VSCodeThemes.map(async theme => {
    if (theme.content) {
      return {
        name: theme.name,
        ...theme.content,
      };
    }
    if (theme.get) {
      const t = await theme.get();
      return {
        name: theme.name,
        ...t,
      };
    }
    if (theme.url) {
      try {
        const t = await fetch(theme.url).then(a => a.json());
        return {
          name: theme.name,
          ...t,
        };
      } catch {
        return null;
      }
    }
  });

  const values = await Promise.all(results);

  return values.filter(a => a);
};
export const makeTheme = (vsCodeTheme = { colors: {} }, name: string) => {
  // black is the default, it would be helpful to use storybook-addon-themes
  // to test our components across multiple themes
  // convert vscode colors to dot notation so that we can use them in tokens
  const vsCodeColors = dot.object({ ...vsCodeTheme.colors });

  // Our interface does not map 1-1 with vscode.
  // To add styles that remain themeable, we add
  // some polyfills to the theme tokens.
  const polyfilledVSCodeColors = polyfillTheme(vsCodeColors);

  // merge the design language and vscode theme
  const theme = deepmerge(designLanguage, { colors: polyfilledVSCodeColors });

  return {
    name,
    ...theme,
  };
};
