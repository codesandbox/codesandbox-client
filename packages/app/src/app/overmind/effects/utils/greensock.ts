const GREENSOCK_KEYWORDS = [
  'scrolltrigger',
  'scrollsmoother',
  'scrollintent',
  'scrollto',
  'scrolltoplugin',
  'flip',
  'flipplugin',
  'draggable',
  'cssrule',
  'cssruleplugin',
  'easelplugin',
  'pixiplugin',
  'modifiersplugin',
  'textplugin',
  'customease',

  'greensock',
  'gsap',
  'gasp',
  'tween',
  'timeline',
  'animate',
  'animation',
];

const GREENSOCK_MEMBER_KEYWORDS = [
  'motionpathplugin',
  'motionpathhelper',
  'morphsvg',
  'morphsvgplugin',
  'drawsvg',
  'drawsvgplugin',
  'inertia',
  'inertiaplugin',
  'scrambletext',
  'scrambletextplugin',
  'splittext',
  'physics2d',
  'physics2dplugin',
  'physicsprops',
  'physicspropsplugin',
  'custombounce',
  'customwiggle',
  'gsdevtools',
];

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
