import codesandbox from './codesandbox.json';

export default [
  {
    name: 'CodeSandbox',
    id: 'codesandbox',
    content: codesandbox,
  },
  {
    name: 'Night Owl',
    id: 'nightOwl',
    url:
      'https://cdn.rawgit.com/sdras/night-owl-vscode-theme/ff58e0d3/themes/Night%20Owl-color-theme.json',
  },
  {
    name: 'Night Owl (No Italics)',
    id: 'nightOwlNoItalics',
    url:
      'https://cdn.rawgit.com/sdras/night-owl-vscode-theme/ff58e0d3/themes/Night%20Owl-color-theme-noitalic.json',
  },
  {
    name: 'Atom Dark',
    id: 'atomDark',
    type: 'dark',
    url:
      'https://cdn.rawgit.com/akamud/vscode-theme-onedark/11ef4839/themes/OneDark.json',
  },
  {
    name: 'Cobalt 2',
    id: 'cobalt2',
    url:
      'https://cdn.rawgit.com/wesbos/cobalt2-vscode/master/theme/cobalt2.json',
  },
  {
    name: 'Palenight',
    id: 'palenight',
    url:
      'https://cdn.rawgit.com/whizkydee/vscode-material-palenight-theme/master/themes/palenight.json',
  },
  {
    name: 'Palenight Italic',
    id: 'palenightItalic',
    url:
      'https://cdn.rawgit.com/whizkydee/vscode-material-palenight-theme/master/themes/palenight-italic.json',
  },
  {
    name: 'Shades of Purple',
    id: 'shadesOfPurple',
    url:
      'https://cdn.rawgit.com/ahmadawais/shades-of-purple-vscode/983101b2e9f57638fbc1bd5c551f5c84e561756e/themes/shades-of-purple-color-theme.json',
  },
  {
    name: 'Lucy',
    id: 'lucy',
    url:
      'https://cdn.rawgit.com/juliettepretot/lucy-vscode/f27d8363/dist/color-theme.json',
  },
  {
    name: 'High Contrast',
    id: 'highContrast',
    get: () => import('./high-contrast'),
  },
  {
    name: 'VSCode Light',
    id: 'vscodeLight',
    get: () => import('./vscode-light'),
  },
  {
    name: 'Atom Light',
    id: 'atomLight',
    url:
      'https://cdn.rawgit.com/akamud/vscode-theme-onelight/master/themes/OneLight.json',
  },
  {
    name: 'Solarized Light',
    id: 'solarizedLight',
    url:
      'https://raw.githubusercontent.com/Microsoft/vscode/d2b6bbb46fbdf535e2c96b3e00ac56ac1d427a69/extensions/theme-solarized-light/themes/solarized-light-color-theme.json',
  },
];
