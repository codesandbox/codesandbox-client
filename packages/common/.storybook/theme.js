import { create } from '@storybook/theming';
import theme from '../src/theme.ts';

export default create({
  base: 'dark',
  brandTitle: 'CodeSandbox Storybook',
  brandUrl: 'https://codesandbox.io',
  brandImage:
    'https://pbs.twimg.com/profile_images/990658498940751873/Ri8HxX9d_400x400.jpg',
});
