import AtomDark from './atom-dark';
import AtomLight from './atom-light';
import Cobalt2 from './cobalt2';
import CodeSandbox from './codesandbox';
import CodeSandboxBlack from './codesandbox-black';
import CodeSandboxLight from './codesandbox-light';
import HighContrast from './high-contrast';
import Lucy from './lucy';
import NightOwl from './night-owl';
import NightOwlNoItalics from './nightOwlNoItalics';
import Palenight from './palenight';
import PalenightItalic from './palenight-italic';
import ShadesOfPurple from './shades-of-purple';
import SolarizedLight from './solarized-light';
import VSCodeLight from './vscode-light';

export default [
  {
    name: 'CodeSandbox',
    id: 'codesandbox',
    content: CodeSandbox,
  },
  {
    name: 'CodeSandbox Black',
    id: 'codesandboxBlack',
    content: CodeSandboxBlack,
  },
  {
    name: 'CodeSandbox Light',
    id: 'codesandboxLight',
    content: CodeSandboxLight,
  },
  {
    name: 'Night Owl',
    id: 'nightOwl',
    content: NightOwl,
  },
  {
    name: 'Night Owl (No Italics)',
    id: 'nightOwlNoItalics',
    content: NightOwlNoItalics,
  },
  {
    name: 'Atom Dark',
    id: 'atomDark',
    type: 'dark',
    content: AtomDark,
  },
  {
    name: 'Cobalt 2',
    id: 'cobalt2',
    content: Cobalt2,
  },
  {
    name: 'Palenight',
    id: 'palenight',
    content: Palenight,
  },
  {
    name: 'Palenight Italic',
    id: 'palenightItalic',
    content: PalenightItalic,
  },
  {
    name: 'Shades of Purple',
    id: 'shadesOfPurple',
    content: ShadesOfPurple,
  },
  {
    name: 'Lucy',
    id: 'lucy',
    content: Lucy,
  },
  {
    name: 'High Contrast',
    id: 'highContrast',
    content: HighContrast,
  },
  {
    name: 'VSCode Light',
    id: 'vscodeLight',
    content: VSCodeLight,
  },
  {
    name: 'Atom Light',
    id: 'atomLight',
    content: AtomLight,
  },
  {
    name: 'Solarized Light',
    id: 'solarizedLight',
    content: SolarizedLight,
  },
];
