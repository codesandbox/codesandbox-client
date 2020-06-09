import { DarkIcons } from '@codesandbox/template-icons';
import getDefinition from '@codesandbox/common/lib/templates';

export const getTemplateIcon = sandbox => {
  if (!sandbox) return () => null;

  // prefer template icon url
  const iconUrl = sandbox.forkedTemplate?.iconUrl;
  if (iconUrl && DarkIcons[iconUrl + 'Dark']) {
    return DarkIcons[iconUrl + 'Dark'];
  }

  // fallback to environment
  const environment = sandbox.source.template;
  const templateDefinition = getDefinition(environment);
  let niceName = templateDefinition.niceName;

  // this is bad / going to hurt in the future
  // TODO: move Icon to part of template definition
  if (niceName === 'Static') niceName = 'HTML5';
  else if (niceName === 'Vanilla') niceName = 'JavaScript';

  if (niceName && DarkIcons[niceName + 'IconDark']) {
    return DarkIcons[niceName + 'IconDark'];
  }

  // giving up
  return () => null;
};
