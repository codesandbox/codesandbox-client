import codesandbox from '../themes/codesandbox.json';
import { media, sizes } from './breakpoints';
import { createTheme } from './createTheme';
import * as fonts from './fonts';

export const theme = {
  ...createTheme({
    background: '#24282A',
    background2: '#1C2022',
    background3: '#374140',
    background4: '#141618',
    background5: '#111518', // Less brown version
    primary: '#FFD399',
    primaryText: '#7F694C',
    lightText: '#F2F2F2',
    secondary: '#40A9F3',
    shySecondary: '#66b9f4',
    darkBlue: '#1081D0',
    white: '#E0E0E0',
    gray: '#C0C0C0',
    black: '#74757D',
    green: '#5da700',
    redBackground: '#400000',
    red: '#F27777',
    dangerBackground: '#DC3545',
    sidebar: '#191d1f',
    placeholder: '#B8B9BA',
  }),
  vscodeTheme: codesandbox,
  new: {
    ...createTheme({
      title: '#EEEEFF',
      description: '#777788',
      bg: '#2B2E41',
    }),
  },
  fonts,
  media,
  sizes,
};
