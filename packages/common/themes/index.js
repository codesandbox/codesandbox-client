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
];
