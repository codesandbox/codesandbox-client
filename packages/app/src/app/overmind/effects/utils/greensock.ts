const GREENSOCK_KEYWORDS = [
  'animate',
  'animation',
  'cssrule',
  'cssruleplugin',
  'customease',
  'draggable',
  'easelplugin',
  'flip',
  'flipplugin',
  'gasp',
  'greensock',
  'gsap',
  'modifiersplugin',
  'motionpathplugin',
  'pixiplugin',
  'scrollintent',
  'scrollsmoother',
  'scrollto',
  'scrolltoplugin',
  'scrolltrigger',
  'textplugin',
  'timeline',
  'tween',
];

const GREENSOCK_MEMBER_KEYWORDS = [
  'custombounce',
  'customwiggle',
  'drawsvg',
  'drawsvgplugin',
  'gsdevtools',
  'inertia',
  'inertiaplugin',
  'morph',
  'morphsvg',
  'morphsvgplugin',
  'motionpathhelper',
  'physics2d',
  'physics2dplugin',
  'physicsprops',
  'physicspropsplugin',
  'scrambletext',
  'scrambletextplugin',
  'splittext',
];

export const GREENSOCK_ALIASES = ['gsap', 'gsap-trial'];

export function getGreensockAlias(name: string): string | undefined {
  const lowercaseName = name.toLocaleLowerCase();
  if (GREENSOCK_KEYWORDS.includes(lowercaseName)) {
    return 'gsap';
  }
  if (GREENSOCK_MEMBER_KEYWORDS.includes(lowercaseName)) {
    return 'gsap-trial';
  }

  return undefined;
}
